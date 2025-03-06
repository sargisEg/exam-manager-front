import {Switch, Route} from "wouter";
import {queryClient} from "./lib/queryClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/toaster";
import {AuthProvider} from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student/student-dashboard.tsx";
import TeacherDashboard from "@/pages/teacher/teacher-dashboard.tsx";
import AdminDashboard from "@/pages/admin/admin-dashboard.tsx";
import StudentCourseDetails from "@/pages/student/student-course-details.tsx";
import TeacherCourseDetails from "@/pages/teacher/teacher-course-details.tsx";
import DepartmentDetails from "@/pages/admin/department-details.tsx";
import TeacherGroupDetails from "@/pages/teacher/teacher-group-details.tsx";
import StudentDetails from "@/pages/admin/student-details.tsx";
import TeacherDetails from "@/pages/admin/teacher-details.tsx";
import {ProtectedRoute} from "./lib/protected-route";
import {UserRole} from "@shared/response-models.ts";
import UngradedExams from "./pages/teacher/ungraded-exams.tsx";
import TeacherSubgroupDetails from "@/pages/teacher/teacher-subgroup-details.tsx";
import AdminGroupDetails from "@/pages/admin/admin-group-details.tsx";
import AdminSubgroupDetails from "@/pages/admin/admin-subgroup-details.tsx";

function Router() {
    return (
        <Switch>
            <Route path="/auth" component={AuthPage}/>
            <ProtectedRoute
                path="/admin"
                component={AdminDashboard}
                allowedRoles={[UserRole.ADMIN]}
            />
            <ProtectedRoute
                path="/department/:departmentId"
                component={DepartmentDetails}
                allowedRoles={[UserRole.ADMIN]}
            />
            <ProtectedRoute
                path="/department/:departmentId/admin-group/:groupId"
                component={AdminGroupDetails}
                allowedRoles={[UserRole.ADMIN]}
            />
            <ProtectedRoute
                path="/department/:departmentId/admin-group/:groupId/admin-subgroup/:subgroupId"
                component={AdminSubgroupDetails}
                allowedRoles={[UserRole.ADMIN]}
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
                path="/teacher"
                component={TeacherDashboard}
                allowedRoles={[UserRole.TEACHER]}
            />
            <ProtectedRoute
                path="/department/:departmentId/teacher-group/:groupId"
                component={TeacherGroupDetails}
                allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}
            />
            <ProtectedRoute
                path="/department/:departmentId/teacher-group/:groupId/teacher-subgroup/:subgroupId"
                component={TeacherSubgroupDetails}
                allowedRoles={[UserRole.TEACHER]}
            />

            <ProtectedRoute
                path="/department/:departmentId/teacher-group/:groupId/teacher-course/:courseId"
                component={TeacherCourseDetails}
                allowedRoles={[UserRole.TEACHER]}
            />
            <ProtectedRoute
                path="/ungraded-exams"
                component={UngradedExams}
                allowedRoles={[UserRole.TEACHER]}
            />
            <ProtectedRoute
                path="/student"
                component={StudentDashboard}
                allowedRoles={[UserRole.STUDENT]}
            />
            <ProtectedRoute
                path="/department/:departmentId/student-group/:groupId/student-course/:courseId"
                component={StudentCourseDetails}
                allowedRoles={[UserRole.STUDENT]}
            />
            <Route component={NotFound}/>
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router/>
                <Toaster/>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;