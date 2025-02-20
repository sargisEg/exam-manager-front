import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@shared/schema";
import { Link } from "wouter";
import { User } from "lucide-react";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  const getHomeLink = () => {
    switch (user?.role) {
      case UserRole.STUDENT:
        return "/";
      case UserRole.TEACHER:
        return "/teacher";
      case UserRole.ADMIN:
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={getHomeLink()}>
          <a className="text-xl font-bold">Exam Management</a>
        </Link>
        <div className="flex gap-4">
          {user?.email}
        </div>
        <nav className="flex items-center gap-6">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
