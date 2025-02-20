import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import * as testData from "@shared/test-data";
import { Exam } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = testData.TEST_COURSES[courseId || ""];
  const courseExams = Object.values(testData.TEST_EXAMS).filter(exam => exam.courseId === course?.id);

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
    {
      accessorKey: "maxPoints",
      header: "Max Points",
    },
  ];

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Exams</h2>
            <DataTable columns={examColumns} data={courseExams}/>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
