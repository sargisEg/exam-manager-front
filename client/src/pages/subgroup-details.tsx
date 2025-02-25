import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Exam, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";
import { format } from "date-fns";

export default function SubgroupDetails() {
  const { groupId } = useParams();
  const { subgroupId } = useParams();
  const sub = subgroupId;
  const [, navigate] = useLocation();
  const group = testData.TEST_GROUPS[groupId || ""];
  const subgroup = testData.TEST_SUBGROUPS[sub || ""];

  const pastExamColumns: ColumnDef<Exam>[] =[
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "subgroupName",
      header: "Subgroup",
      cell: () => subgroup.name,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.type,
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.maxPoints,
    }
  ];

  const examColumns: ColumnDef<Exam>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "subgroupName",
      header: "Subgroup",
      cell: () => subgroup.name,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
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
          <h1 className="text-3xl font-bold">{subgroup.name}</h1>
          <p className="text-muted-foreground">
            Academic Year: {group.startYear} - {group.endYear}
          </p>
        </div>

        <div className="grid gap-6">

          <Card>
            <CardHeader>
              <CardTitle>Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={examColumns} 
                data={Object.values(testData.TEST_EXAMS)
                .filter(e => e.subgroupId === subgroupId)
                .filter(e => e.startDate >= new Date())} 
                initialSorting={[{ id: "startDate", desc: false }]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Past Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={pastExamColumns} 
                data={Object.values(testData.TEST_EXAMS)
                .filter(e => e.subgroupId === subgroupId)
                .filter(e => e.startDate < new Date())} 
                initialSorting={[{ id: "startDate", desc: false }]}
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
                data={Object.values(testData.TEST_USERS).filter(u => subgroupId === u.subgroupId)} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
