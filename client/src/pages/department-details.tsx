import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Department, Group, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";

// Test data

export default function DepartmentDetails() {
  const { departmentId } = useParams();
  const [, navigate] = useLocation();
  const department = testData.TEST_DEPARTMENTS[departmentId || ""];

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
        <BackButton />
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
                data={Object.values(testData.TEST_GROUPS).filter(g => g.departmentId == departmentId)}
                initialSorting={[{ id: "name", desc: false }]}
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
                data={Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.TEACHER)} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
