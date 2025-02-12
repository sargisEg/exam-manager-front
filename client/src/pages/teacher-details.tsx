import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { User, UserRole, Course, Group, Subgroup } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

// Test data
const TEST_USERS: Record<string, User> = {
  "2": {
    id: 2,
    name: "Jane Smith",
    username: "jane",
    password: "test",
    email: "jane@example.com",
    phone: "1234567891",
    role: UserRole.TEACHER,
    subgroupId: null,
  },
};

const TEST_GROUPS: Group[] = [
  { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
];

const TEST_SUBGROUPS: Subgroup[] = [
  { id: 1, name: "CS-2025-A", groupId: 1 },
  { id: 2, name: "CS-2025-B", groupId: 1 },
];

const TEST_COURSES: Course[] = [
  { id: 1, name: "Mathematics", groupId: 1 },
  { id: 2, name: "Physics", groupId: 1 },
];

// In a real app, we would have a teacherSubgroups table to track which subgroups a teacher teaches
const TEST_TEACHER_SUBGROUPS = [
  { teacherId: 2, subgroupId: 1 },
  { teacherId: 2, subgroupId: 2 },
];

export default function TeacherDetails() {
  const { teacherId } = useParams();
  const [, navigate] = useLocation();
  const teacher = TEST_USERS[teacherId || ""];

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
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/group/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        const group = TEST_GROUPS.find(g => g.id === row.original.groupId);
        return group?.name || "-";
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
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        const group = TEST_GROUPS.find(g => g.id === row.original.groupId);
        return group?.name || "-";
      },
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

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  // Get the teacher's subgroups
  const teacherSubgroupIds = TEST_TEACHER_SUBGROUPS
    .filter(ts => ts.teacherId === Number(teacherId))
    .map(ts => ts.subgroupId);

  // Get the groups that contain the teacher's subgroups
  const teacherGroupIds = Array.from(new Set(
    TEST_SUBGROUPS
      .filter(sg => teacherSubgroupIds.includes(sg.id))
      .map(sg => sg.groupId)
  ));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{teacher.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{teacher.email}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={groupColumns} 
                data={TEST_GROUPS.filter(g => teacherGroupIds.includes(g.id))} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subgroups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={subgroupColumns} 
                data={TEST_SUBGROUPS.filter(sg => teacherSubgroupIds.includes(sg.id))} 
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
                data={TEST_COURSES.filter(c => teacherGroupIds.includes(c.groupId))} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
