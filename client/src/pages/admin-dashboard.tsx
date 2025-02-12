import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Department, Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Users, BookOpen, Building2, Layers, ChevronRight } from "lucide-react";

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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const teacherColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/teacher/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const studentColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        const subgroup = TEST_SUBGROUPS.find(sg => sg.id === row.original.subgroupId);
        const group = subgroup ? TEST_GROUPS.find(g => g.id === subgroup.groupId) : null;
        return group?.name || "-";
      },
    },
    {
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        const subgroup = TEST_SUBGROUPS.find(sg => sg.id === row.original.subgroupId);
        return subgroup?.name || "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/student/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
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
    {
      id: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const groups = TEST_GROUPS.filter(g => true); // In real app, filter by department
        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {groups.length} groups
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/department/${row.original.id}`)}
            >
              View Groups <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: TEST_USERS.length,
      icon: Users,
    },
    {
      title: "Teachers",
      value: TEST_USERS.filter(u => u.role === UserRole.TEACHER).length,
      icon: Users,
    },
    {
      title: "Students",
      value: TEST_USERS.filter(u => u.role === UserRole.STUDENT).length,
      icon: Users,
    },
    {
      title: "Departments",
      value: TEST_DEPARTMENTS.length,
      icon: Building2,
    },
  ];

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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={departmentColumns} data={TEST_DEPARTMENTS} />
            </CardContent>
          </Card>

          <Tabs defaultValue="teachers">
            <TabsList>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="teachers">
              <Card>
                <CardHeader>
                  <CardTitle>Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={teacherColumns} 
                    data={TEST_USERS.filter(u => u.role === UserRole.TEACHER)} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={studentColumns} 
                    data={TEST_USERS.filter(u => u.role === UserRole.STUDENT)} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}