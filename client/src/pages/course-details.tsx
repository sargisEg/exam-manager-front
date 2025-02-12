import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Course, Exam, ExamStatus, ExamType } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

// Test data
const TEST_COURSES: Record<string, Course> = {
  "1": { id: 1, name: "Mathematics", groupId: 1 },
  "2": { id: 2, name: "Physics", groupId: 1 },
};

const TEST_EXAMS: Exam[] = [
  {
    id: 1,
    title: "Midterm Exam",
    courseId: 1,
    subgroupId: 1,
    location: "Room 101",
    startDate: new Date("2025-02-20T10:00:00"),
    endDate: new Date("2025-02-20T12:00:00"),
    maxPoints: 100,
    status: ExamStatus.UPCOMING,
    type: ExamType.MIDTERM,
  },
  {
    id: 2,
    title: "Final Exam",
    courseId: 1,
    subgroupId: 1,
    location: "Room 102",
    startDate: new Date("2025-03-20T14:00:00"),
    endDate: new Date("2025-03-20T16:00:00"),
    maxPoints: 100,
    status: ExamStatus.UPCOMING,
    type: ExamType.GENERAL,
  },
];

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = TEST_COURSES[courseId || ""];
  const courseExams = TEST_EXAMS.filter(exam => exam.courseId === course?.id);

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
        <Card>
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Exams</h2>
            <DataTable columns={examColumns} data={courseExams} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
