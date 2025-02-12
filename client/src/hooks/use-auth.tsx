import { createContext, ReactNode, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, UserRole } from "@shared/schema";

// Hardcoded test user
const TEST_USER: User = {
  id: 1,
  name: "Test User",
  username: "test",
  password: "test",
  email: "test@example.com",
  phone: "1234567890",
  role: UserRole.ADMIN, // Change this to test different roles
  subgroupId: null,
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: TEST_USER,
        isLoading: false,
        error: null,
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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
    },
  });

  return { ...context, logoutMutation };
}