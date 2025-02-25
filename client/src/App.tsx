import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import TeacherDashboard from "@/pages/teacher-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import StudentCourseDetails from "@/pages/student-course-details";
import TeacherCourseDetails from "@/pages/teacher-course-details";
import DepartmentDetails from "@/pages/department-details";
import GroupDetails from "@/pages/group-details";
import StudentDetails from "@/pages/student-details";
import TeacherDetails from "@/pages/teacher-details";
import { ProtectedRoute } from "./lib/protected-route";
import { UserRole } from "@shared/schema";
import UngradedExams from "./pages/ungraded-exams";
import SubgroupDetails from "@/pages/subgroup-details";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute 
        path="/" 
        component={StudentDashboard} 
        allowedRoles={[UserRole.STUDENT]} 
      />
      <ProtectedRoute 
        path="/teacher" 
        component={TeacherDashboard}
        allowedRoles={[UserRole.TEACHER]} 
      />
      <ProtectedRoute 
        path="/admin" 
        component={AdminDashboard}
        allowedRoles={[UserRole.ADMIN]} 
      />
      <ProtectedRoute 
        path="/course-student/:courseId" 
        component={StudentCourseDetails}
        allowedRoles={[UserRole.STUDENT]} 
      />
      <ProtectedRoute 
        path="/course-teacher/:courseId" 
        component={TeacherCourseDetails}
        allowedRoles={[UserRole.TEACHER]} 
      />
      <ProtectedRoute 
        path="/department/:departmentId" 
        component={DepartmentDetails}
        allowedRoles={[UserRole.ADMIN]} 
      />
      <ProtectedRoute 
        path="/group/:groupId" 
        component={GroupDetails}
        allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]} 
      />
      <ProtectedRoute 
        path="/group/:groupId/subgroup/:subgroupId"
        component={SubgroupDetails}
        allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]} 
      />
      <ProtectedRoute 
        path="/student/:studentId" 
        component={StudentDetails}
        allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]} 
      />
      <ProtectedRoute 
        path="/teacher/:teacherId" 
        component={TeacherDetails}
        allowedRoles={[UserRole.ADMIN]} 
      />
      <ProtectedRoute 
        path="/ungraded-exams" 
        component={UngradedExams}
        allowedRoles={[UserRole.TEACHER]} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;