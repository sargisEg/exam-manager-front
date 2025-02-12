import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Exam, ExamStatus, ExamType, Course } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Test data
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

const TEST_USER_INFO = {
  department: "Computer Science",
  group: "CS-2025",
  subgroup: "CS-2025-A",
};

export default function StudentDashboard() {
  const [, navigate] = useLocation();

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/course/${row.original.id}`)}
          >
            View Course <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <ExamCalendar exams={TEST_EXAMS} />

            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={courseColumns} data={TEST_COURSES} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Department</div>
                  <div>{TEST_USER_INFO.department}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Group</div>
                  <div>{TEST_USER_INFO.group}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Subgroup</div>
                  <div>{TEST_USER_INFO.subgroup}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}