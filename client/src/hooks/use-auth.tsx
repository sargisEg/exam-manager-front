import { createContext, ReactNode, useContext } from "react";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { UserRole } from "@shared/schema";

const TEST_TEACHER: User = {
  id: "1",
  name: "Test Teacher",
  password: "test",
  email: "teacher@example.com",
  phone: "1234567890",
  role: UserRole.TEACHER,
  subgroupId: null,
};


const TEST_STUDENT: User = {
  id: "2",
  name: "Test SYUDENT",
  password: "test",
  email: "student@example.com",
  phone: "1234567890",
  role: UserRole.STUDENT,
  subgroupId: "9c8b6d7e-8f5f-4b3a-a5e9-b9f1a3c1a0a1", //CS Subgroup 1A
};

const TEST_ADMIN: User = {
  id: "3",
  name: "Test Admin",
  password: "test",
  email: "student@example.com",
  phone: "1234567890",
  role: UserRole.ADMIN,
  subgroupId: null, //CS Subgroup 1A
};

type AuthContextType = {
  user: User | null;
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
    queryFn: async () => {
      const response = await fetch("/api/user", {
        credentials: "include",
      });
      if (!response.ok) return null;
      return response.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify(credentials),
      // });
      let response: User | null = null;
      if (credentials.username == "teacher") {
        response = TEST_TEACHER;
      }
      if (credentials.username == "student") {
        response = TEST_STUDENT;
      }
      if (credentials.username == "admin") {
        response = TEST_ADMIN;
      }
      if (response === null) {
        throw new Error("Login failed");
      }
      localStorage.setItem('userId', response.id);
      localStorage.setItem('subgroupId', response.subgroupId ? response.subgroupId : '');
      // return response.json();
      return response;
    },
    onSuccess: (data) => {
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
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      queryClient.invalidateQueries();
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
