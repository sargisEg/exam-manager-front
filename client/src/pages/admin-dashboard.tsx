import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department, Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Users, BookOpen, Building2, Layers } from "lucide-react";

// Test data
const TEST_GROUPS: Group[] = [
  { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
  { id: 2, name: "ME-2025", startYear: 2025, endYear: 2029 },
];

const TEST_SUBGROUPS: Subgroup[] = [
  { id: 1, name: "CS-2025-A", groupId: 1 },
  { id: 2, name: "CS-2025-B", groupId: 1 },
  { id: 3, name: "ME-2025-A", groupId: 2 },
];

const TEST_COURSES: Course[] = [
  { id: 1, name: "Introduction to Programming", groupId: 1 },
  { id: 2, name: "Data Structures", groupId: 1 },
  { id: 3, name: "Mechanics", groupId: 2 },
];

const TEST_USERS: User[] = [
  {
    id: 1,
    name: "John Doe",
    username: "john",
    password: "test",
    email: "john@example.com",
    phone: "1234567890",
    role: UserRole.STUDENT,
    subgroupId: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "jane",
    password: "test",
    email: "jane@example.com",
    phone: "1234567891",
    role: UserRole.TEACHER,
    subgroupId: null,
  },
];

const TEST_DEPARTMENTS: Department[] = [
  { id: 1, name: "Computer Science", nameShort: "CS", headOfDepartmentId: 2 },
  { id: 2, name: "Mechanical Engineering", nameShort: "ME", headOfDepartmentId: 2 },
];

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

const departmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "nameShort",
    header: "Short Name",
  },
];

const groupColumns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startYear",
    header: "Start Year",
  },
  {
    accessorKey: "endYear",
    header: "End Year",
  },
];

const subgroupColumns: ColumnDef<Subgroup>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "groupId",
    header: "Group ID",
  },
];

const courseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "groupId",
    header: "Group ID",
  },
];

const stats = [
  {
    title: "Total Users",
    value: TEST_USERS.length,
    icon: Users,
  },
  {
    title: "Departments",
    value: TEST_DEPARTMENTS.length,
    icon: Building2,
  },
  {
    title: "Groups",
    value: TEST_GROUPS.length,
    icon: Layers,
  },
  {
    title: "Courses",
    value: TEST_COURSES.length,
    icon: BookOpen,
  },
];

export default function AdminDashboard() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="subgroups">Subgroups</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={userColumns} data={TEST_USERS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={departmentColumns} data={TEST_DEPARTMENTS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Group Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={groupColumns} data={TEST_GROUPS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subgroups">
            <Card>
              <CardHeader>
                <CardTitle>Subgroup Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={subgroupColumns} data={TEST_SUBGROUPS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={courseColumns} data={TEST_COURSES} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}