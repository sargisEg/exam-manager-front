import { useQuery } from "@tanstack/react-query";
import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Exam, Course, Subgroup, Group, ExamStatus, ExamType } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ChevronRight, Users, BookOpen } from "lucide-react";

// Test data
const TEST_COURSES: Course[] = [
  { id: 1, name: "Mathematics", groupId: 1 },
  { id: 2, name: "Physics", groupId: 1 },
];

const TEST_GROUPS: Group[] = [
  { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
  { id: 2, name: "ME-2025", startYear: 2025, endYear: 2029 },
];

const TEST_SUBGROUPS: Subgroup[] = [
  { id: 1, name: "CS-2025-A", groupId: 1 },
  { id: 2, name: "CS-2025-B", groupId: 1 },
];

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
];

export default function TeacherDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const groupColumns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startYear",
      header: "Start Year",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const subgroups = TEST_SUBGROUPS.filter(sg => sg.groupId === row.original.id);
        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {subgroups.length} subgroups
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/group/${row.original.id}`)}
            >
              View Details <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const courseColumns: ColumnDef<Course & { group?: Group; subgroup?: Subgroup }>[] = [
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        const group = TEST_GROUPS.find(g => g.id === row.original.groupId);
        return group?.name || "-";
      },
    },
    {
      id: "subgroups",
      header: "Subgroups",
      cell: ({ row }) => {
        const subgroups = TEST_SUBGROUPS.filter(sg => sg.groupId === row.original.groupId);
        return subgroups.map(sg => sg.name).join(", ") || "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/course/${row.original.id}`)}
        >
          View Course <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const examColumns: ColumnDef<Exam>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
  ];

  const stats = [
    {
      title: "Total Groups",
      value: TEST_GROUPS.length,
      icon: Users,
    },
    {
      title: "Total Courses",
      value: TEST_COURSES.length,
      icon: BookOpen,
    },
  ];

  const handleCreateExam = async (data: Partial<Exam>) => {
    toast({
      title: "Success",
      description: "Exam created successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Exam</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
              </DialogHeader>
              <ExamForm
                onSubmit={handleCreateExam}
                courses={TEST_COURSES}
                subgroups={TEST_SUBGROUPS}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6">
          <ExamCalendar exams={TEST_EXAMS} />

          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={groupColumns} data={TEST_GROUPS} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={courseColumns} 
                data={TEST_COURSES.map(course => ({
                  ...course,
                  group: TEST_GROUPS.find(g => g.id === course.groupId),
                }))} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}