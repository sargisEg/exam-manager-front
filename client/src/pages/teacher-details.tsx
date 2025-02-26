import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { User, UserRole, Course, Group, Subgroup } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";

// In a real app, we would have a teacherSubgroups table to track which subgroups a teacher teaches

export default function TeacherDetails() {
  const { teacherId } = useParams();
  const [, navigate] = useLocation();
  const teacher = testData.TEST_USERS[teacherId || ""];

  const groupColumns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startYear",
      header: "Start Year",
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
        const group = Object.values(testData.TEST_GROUPS).find(g => g.id === row.original.groupId);
        return group?.name || "-";
      },
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
        const group = Object.values(testData.TEST_GROUPS).find(g => g.id === row.original.groupId);
        return group?.name || "-";
      },
    },
  ];

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  // Get the teacher's subgroups
  const teacherSubgroupIds = testData.TEST_TEACHER_SUBGROUPS
    .filter(ts => ts.teacherId === teacherId)
    .map(ts => ts.subgroupId);

  // Get the groups that contain the teacher's subgroups
  const teacherGroupIds = Array.from(new Set(
    Object.values(testData.TEST_SUBGROUPS)
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
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{teacher.phone}</div>
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
                data={Object.values(testData.TEST_GROUPS).filter(g => teacherGroupIds.includes(g.id))} 
                initialSorting={[{ id: "name", desc: false }]}
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
                data={Object.values(testData.TEST_SUBGROUPS).filter(sg => teacherSubgroupIds.includes(sg.id))} 
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
                data={Object.values(testData.TEST_COURSES).filter(c => teacherGroupIds.includes(c.groupId))} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
