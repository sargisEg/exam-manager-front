import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [, navigate] = useLocation();
  const group = testData.TEST_GROUPS[groupId || ""];

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = Object.values(testData.TEST_USERS).filter(
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
          onClick={() => navigate(`/group/${groupId}/subgroup/${row.original.id}`)}
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
          onClick={() => navigate(`/course-teacher/${row.original.id}`)}
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
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
        return subgroup?.name || "-";
      },
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
                data={Object.values(testData.TEST_SUBGROUPS).filter(sg => sg.groupId === groupId)} 
                initialSorting={[{ id: "name", desc: false }]}
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
                data={Object.values(testData.TEST_COURSES).filter(c => c.groupId === groupId)} 
                initialSorting={[{ id: "name", desc: false }]}
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
                data={Object.values(testData.TEST_USERS).filter(u => {
                  if (u.role !== UserRole.STUDENT) return false;
                  const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === u.subgroupId);
                  return subgroup?.groupId === groupId;
                })} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
