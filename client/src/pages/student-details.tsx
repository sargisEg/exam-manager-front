import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { User, UserRole, Exam, ExamResult, Subgroup, Group, ExamStatus, ExamType } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import * as testData from "@shared/test-data";


export default function StudentDetails() {
  const { studentId } = useParams();
  const student = testData.TEST_USERS[studentId || ""];

  const examColumns: ColumnDef<Exam>[] = [
    {
      accessorKey: "title",
      header: "Title",
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
      accessorKey: "status",
      header: "Status",
    },
  ];

  const resultColumns: ColumnDef<ExamResult & { exam?: Exam }>[] = [
    {
      accessorKey: "exam.title",
      header: "Exam",
      cell: ({ row }) => row.original.exam?.title || "-",
    },
    {
      accessorKey: "exam.type",
      header: "Type",
      cell: ({ row }) => row.original.exam?.type || "-",
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(testData.TEST_EXAMS[row.original.examId].startDate), "PPP"),
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => row.original.point || "-",
    },
    {
      accessorKey: "exam.maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.exam?.maxPoints || "-",
    },
  ];

  if (!student) {
    return <div>Student not found</div>;
  }

  const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === student.subgroupId);
  const group = subgroup ? Object.values(testData.TEST_GROUPS).find(g => g.id === subgroup.groupId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{student.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{student.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Group</div>
                <div>{group?.name || "-"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Subgroup</div>
                <div>{subgroup?.name || "-"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={examColumns} 
                data={Object.values(testData.TEST_EXAMS).filter(e => 
                  e.status === ExamStatus.UPCOMING && 
                  e.subgroupId === student.subgroupId
                )} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={resultColumns} 
                data={Object.values(testData.TEST_EXAM_RESULTS)
                  .filter(r => r.studentId === studentId)
                  .map(result => ({
                    ...result,
                    exam: Object.values(testData.TEST_EXAMS).find(e => e.id === result.examId),
                  }))} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
