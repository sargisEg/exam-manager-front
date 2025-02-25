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
  const pastExams = Object.values(testData.TEST_EXAMS)
    .filter(exam => exam.courseId === course?.id)
    .filter(exam => exam.startDate < new Date());

  const pastExamColumns: ColumnDef<Exam>[] =[
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "subgroupId",
      header: "Subgroup",
      cell: ({ row }) => testData.TEST_SUBGROUPS[row.original.subgroupId].name,
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
      accessorKey: "subgroupId",
      header: "Subgroup",
      cell: ({ row }) => testData.TEST_SUBGROUPS[row.original.subgroupId].name,
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
            <DataTable columns={pastExamColumns} data={pastExams} initialSorting={[{ id: "startDate", desc: false }]}/>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
