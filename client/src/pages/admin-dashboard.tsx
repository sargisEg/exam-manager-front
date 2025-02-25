import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Department, Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Users, BookOpen, Building2, ChevronRight } from "lucide-react";
import * as testData from "@shared/test-data";

// Test data

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
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
        const group = subgroup ? Object.values(testData.TEST_GROUPS).find(g => g.id === subgroup.groupId) : null;
        return group?.name || "-";
      },
    },
    {
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
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
        const groups = Object.values(testData.TEST_GROUPS).filter(g => true); // In real app, filter by department
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
      value: Object.values(testData.TEST_USERS).length,
      icon: Users,
    },
    {
      title: "Teachers",
      value: Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.TEACHER).length,
      icon: Users,
    },
    {
      title: "Students",
      value: Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.STUDENT).length,
      icon: Users,
    },
    {
      title: "Departments",
      value: Object.values(testData.TEST_DEPARTMENTS).length,
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
              <DataTable columns={departmentColumns} data={Object.values(testData.TEST_DEPARTMENTS)} initialSorting={[{ id: "name", desc: false }]}/>
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
                    data={Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.TEACHER)} 
                    initialSorting={[{ id: "name", desc: false }]}
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
                    data={Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.STUDENT)} 
                    initialSorting={[{ id: "name", desc: false }]}
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