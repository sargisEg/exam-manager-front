import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Department, Group, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

// Test data
const TEST_DEPARTMENTS: Record<string, Department> = {
  "1": { id: 1, name: "Computer Science", nameShort: "CS", headOfDepartmentId: 2 },
  "2": { id: 2, name: "Mechanical Engineering", nameShort: "ME", headOfDepartmentId: 2 },
};

const TEST_GROUPS: Group[] = [
  { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
  { id: 2, name: "ME-2025", startYear: 2025, endYear: 2029 },
];

const TEST_USERS: User[] = [
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

export default function DepartmentDetails() {
  const { departmentId } = useParams();
  const [, navigate] = useLocation();
  const department = TEST_DEPARTMENTS[departmentId || ""];

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

  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{department.name} Department</h1>
          <p className="text-muted-foreground">Department Code: {department.nameShort}</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={groupColumns} 
                data={TEST_GROUPS.filter(g => true)} // In real app, filter by department
              />
            </CardContent>
          </Card>

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
        </div>
      </main>
    </div>
  );
}
