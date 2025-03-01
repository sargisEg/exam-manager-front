import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import * as testData from "@shared/test-data";
import { Exam, ExamResult, examResults } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function CourseDetails() {
  const userId = localStorage.getItem("userId");
  const { courseId } = useParams();
  const course = testData.TEST_COURSES[courseId || ""];
  const exams = Object.values(testData.TEST_EXAMS)
    .filter(exam => exam.courseId === course?.id)
    .filter(exam => exam.startDate >= new Date());
  const examsResults = Object.values(testData.TEST_EXAM_RESULTS)
    .filter(examResult => examResult.studentId === userId)
    .filter(examResult => examResult.studentId === userId);

  const pastExamColumns: ColumnDef<ExamResult>[] =[
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => testData.TEST_EXAMS[row.original.examId].title,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => testData.TEST_EXAMS[row.original.examId].type,
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(testData.TEST_EXAMS[row.original.examId].startDate), "PPP"),
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
      cell: ({ row }) => testData.TEST_EXAMS[row.original.examId].maxPoints,
    },
    {
      accessorKey: "point",
      header: "My Points",
    },
  ];
  
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
            <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
            <DataTable columns={examColumns} data={exams} initialSorting={[{ id: "startDate", desc: false }]}/>
          </CardContent>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Past Exams</h2>
            <DataTable columns={pastExamColumns} data={examsResults} initialSorting={[{ id: "startDate", desc: false }]}/>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
