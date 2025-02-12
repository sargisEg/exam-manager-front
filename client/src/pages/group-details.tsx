import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

// Test data
const TEST_GROUPS: Record<string, Group> = {
  "1": { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
  "2": { id: 2, name: "ME-2025", startYear: 2025, endYear: 2029 },
};

const TEST_SUBGROUPS: Subgroup[] = [
  { id: 1, name: "CS-2025-A", groupId: 1 },
  { id: 2, name: "CS-2025-B", groupId: 1 },
];

const TEST_COURSES: Course[] = [
  { id: 1, name: "Mathematics", groupId: 1 },
  { id: 2, name: "Physics", groupId: 1 },
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
];

export default function GroupDetails() {
  const { groupId } = useParams();
  const [, navigate] = useLocation();
  const group = TEST_GROUPS[groupId || ""];

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = TEST_USERS.filter(
          u => u.role === UserRole.STUDENT && u.subgroupId === row.original.id
        );
        return students.length;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/subgroup/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/course/${row.original.id}`)}
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

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">
            Academic Year: {group.startYear} - {group.endYear}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subgroups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={subgroupColumns} 
                data={TEST_SUBGROUPS.filter(sg => sg.groupId === Number(groupId))} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={courseColumns} 
                data={TEST_COURSES.filter(c => c.groupId === Number(groupId))} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={studentColumns} 
                data={TEST_USERS.filter(u => {
                  if (u.role !== UserRole.STUDENT) return false;
                  const subgroup = TEST_SUBGROUPS.find(sg => sg.id === u.subgroupId);
                  return subgroup?.groupId === Number(groupId);
                })} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
