import { useQuery } from "@tanstack/react-query";
import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Exam, ExamResult } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function StudentDashboard() {
  const { data: exams } = useQuery<Exam[]>({
    queryKey: ["/api/student/exams"],
  });

  const { data: results } = useQuery<ExamResult[]>({
    queryKey: ["/api/student/results"],
  });

  const columns: ColumnDef<ExamResult>[] = [
    {
      accessorKey: "exam.title",
      header: "Exam",
    },
    {
      accessorKey: "exam.course.name",
      header: "Course",
    },
    {
      accessorKey: "exam.startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.exam.startDate), "PPP"),
    },
    {
      accessorKey: "points",
      header: "Points",
    },
    {
      accessorKey: "exam.maxPoints",
      header: "Max Points",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <ExamCalendar exams={exams || []} />
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={results || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
