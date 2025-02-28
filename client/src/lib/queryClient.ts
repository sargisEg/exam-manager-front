import {QueryClient, QueryFunction} from "@tanstack/react-query";
import {SignInResponse} from "@shared/response-models.ts";

async function throwIfResNotOk(res: Response) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        const errorObj = JSON.parse(text);
        throw new Error(`${errorObj.message}`);
    }
}

const refreshAccessToken = async () : Promise<string | null> => {
    const refreshToken = localStorage.getItem("refresh");
    const email = localStorage.getItem("email");
    if (!refreshToken || !email) {
        localStorage.clear();
        window.location.href = '/auth';
        return null;
    }

    try {
        const response = await fetch('http://localhost:8088/api/auth/v1/refresh', {  // Replace with your refresh token endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken, email: email }),
        });

        if (!response.ok) {
            localStorage.clear();
            window.location.href = '/auth';
            return null;
        }

        const data: SignInResponse = await response.json() as SignInResponse;

        // Save the new tokens
        localStorage.setItem("refresh", data.refreshToken);
        localStorage.setItem("token", data.token);
        return data.token;
    } catch (error) {
        localStorage.clear();
        window.location.href = '/auth';
        return null;
    }
};

export async function apiRequest(
    method: string,
    url: string,
    data?: unknown | undefined,
): Promise<Response> {
    const token = localStorage.getItem("token");
    let headers : Record<string, string> = {
        "Content-Type": "application/json",
        "Origin": "http://localhost:5000",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("http://localhost:8088" + url, {
        method,
        headers: headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
    });

    if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
            throw new Error("Session timeout");
        }
        headers["Authorization"] = `Bearer ${newToken}`;

        const retryResponse = await fetch("http://localhost:8088" + url, {
            method,
            headers: headers,
            body: data ? JSON.stringify(data) : undefined,
            credentials: "include",
        });
        if (retryResponse.status === 401) {
            localStorage.clear();
            window.location.href = '/auth';
            throw new Error("Session timeout");
        }

        await throwIfResNotOk(retryResponse);
        return retryResponse;
    }


    await throwIfResNotOk(res);
    return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
    on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
    ({on401: unauthorizedBehavior}) =>
        async ({queryKey}) => {
            const res = await fetch(queryKey[0] as string, {
                credentials: "include",
            });

            if (unauthorizedBehavior === "returnNull" && res.status === 401) {
                return null;
            }

            await throwIfResNotOk(res);
            return await res.json();
        };

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({on401: "throw"}),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
