import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exam, ExamResult, ExamStatus, ExamType, Course } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

// Hardcoded test data
const TEST_EXAMS: Exam[] = [
  {
    id: 1,
    title: "Mathematics Midterm",
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
    title: "Physics Final",
    courseId: 2,
    subgroupId: 1,
    location: "Room 102",
    startDate: new Date("2025-03-15T14:00:00"),
    endDate: new Date("2025-03-15T16:00:00"),
    maxPoints: 100,
    status: ExamStatus.UPCOMING,
    type: ExamType.GENERAL,
  },
];

const TEST_COURSES: Course[] = [
  { id: 1, name: "Mathematics", groupId: 1 },
  { id: 2, name: "Physics", groupId: 1 },
  { id: 3, name: "Computer Science", groupId: 1 },
];

const TEST_RESULTS: (ExamResult & { exam: Exam })[] = [
  {
    id: 1,
    studentId: 1,
    examId: 1,
    points: 85,
    exam: TEST_EXAMS[0],
  },
];

export default function StudentDashboard() {
  const examColumns: ColumnDef<ExamResult & { exam: Exam }>[] = [
    {
      accessorKey: "exam.title",
      header: "Exam",
    },
    {
      accessorKey: "exam.type",
      header: "Type",
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

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Course Name",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ExamCalendar exams={TEST_EXAMS} />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={courseColumns} data={TEST_COURSES} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={examColumns} data={TEST_RESULTS} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}