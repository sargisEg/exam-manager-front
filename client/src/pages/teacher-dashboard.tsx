import { useQuery } from "@tanstack/react-query";
import { ExamCalendar } from "@/components/exam-calendar";
import { ExamForm } from "@/components/exam-form";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exam, Course, Subgroup, Group, ExamStatus, ExamType } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";

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
];

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

export default function TeacherDashboard() {
  const { toast } = useToast();

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
      accessorKey: "endYear",
      header: "End Year",
    },
  ];

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "groupId",
      header: "Group ID",
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

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="subgroups">Subgroups</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <ExamCalendar exams={TEST_EXAMS} />
          </TabsContent>

          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>All Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={examColumns} data={TEST_EXAMS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>My Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={groupColumns} data={TEST_GROUPS} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subgroups">
            <Card>
              <CardHeader>
                <CardTitle>My Subgroups</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={subgroupColumns} data={TEST_SUBGROUPS} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}