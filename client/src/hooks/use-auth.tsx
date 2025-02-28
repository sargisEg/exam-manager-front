import { createContext, ReactNode, useContext } from "react";
import {apiRequest, queryClient} from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {SignInResponse, UserResponse} from "@shared/response-models.ts";

type AuthContextType = {
  user: UserResponse | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  registerMutation: any;
  logoutMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () : Promise<UserResponse | null> => {
      const refreshToken = localStorage.getItem("refresh");
      const token = localStorage.getItem("token");
      if (refreshToken !== null || token !== null) {
        const userResponse = await apiRequest("GET", "/api/user/v1/me");
        const userResponseJson: UserResponse = await userResponse.json() as UserResponse;
        localStorage.setItem('userId', userResponseJson.id);
        return userResponseJson;
      }
      return null;
      },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }): Promise<UserResponse> => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      const tokenResponse = await apiRequest("POST", "/api/auth/v1/sign-in", credentials);

      if (tokenResponse === null || !tokenResponse.ok) {
        throw new Error("Login failed");
      }
      const tokenResponseJson: SignInResponse = await tokenResponse.json() as SignInResponse;
      localStorage.setItem('token', tokenResponseJson.token);
      localStorage.setItem('refresh', tokenResponseJson.refreshToken);

      const userResponse = await apiRequest("GET", "/api/user/v1/me");
      const userResponseJson: UserResponse = await userResponse.json() as UserResponse;

      localStorage.setItem('userId', userResponseJson.id);
      localStorage.setItem('email', userResponseJson.email);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      return userResponseJson;
    },
    onSuccess: (data : UserResponse) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries();
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        registerMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
