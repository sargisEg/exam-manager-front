import { useQuery } from "@tanstack/react-query";
import { ExamCalendar } from "@/components/exam-calendar";
import { ExamForm } from "@/components/exam-form";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exam, Course, Subgroup } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function TeacherDashboard() {
  const { toast } = useToast();

  const { data: exams } = useQuery<Exam[]>({
    queryKey: ["/api/teacher/exams"],
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/teacher/courses"],
  });

  const { data: subgroups } = useQuery<Subgroup[]>({
    queryKey: ["/api/teacher/subgroups"],
  });

  const columns: ColumnDef<Exam>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "course.name",
      header: "Course",
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

  const handleCreateExam = async (data: Partial<Exam>) => {
    try {
      await apiRequest("POST", "/api/teacher/exams", data);
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/exams"] });
      toast({
        title: "Success",
        description: "Exam created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
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
                courses={courses || []}
                subgroups={subgroups || []}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">Exam List</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <ExamCalendar exams={exams || []} />
          </TabsContent>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>All Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={exams || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
