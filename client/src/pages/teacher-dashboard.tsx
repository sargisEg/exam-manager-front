import { useQuery } from "@tanstack/react-query";
import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as testData from "@shared/test-data";
import { Exam, Course, Subgroup, Group, ExamStatus, ExamType } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Users, BookOpen, ChevronRight } from "lucide-react";

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
        const subgroups = Object.values(testData.TEST_SUBGROUPS).filter(sg => sg.groupId === row.original.id);
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
        const group = Object.values(testData.TEST_GROUPS).find(g => g.id === row.original.groupId);
        return group?.name || "-";
      },
    },
    {
      id: "subgroups",
      header: "Subgroups",
      cell: ({ row }) => {
        const subgroups = Object.values(testData.TEST_SUBGROUPS).filter(sg => sg.groupId === row.original.groupId);
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
      value: Object.values(testData.TEST_GROUPS).length,
      icon: Users,
    },
    {
      title: "Total Courses",
      value: Object.values(testData.TEST_COURSES).length,
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
          <Button onClick={() => toast({ title: "Coming soon", description: "Exam creation will be available soon" })}>
            Create Exam
          </Button>
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
          <ExamCalendar exams={testData.TEST_EXAMS} />

          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={groupColumns} data={Object.values(testData.TEST_GROUPS)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={courseColumns} 
                data={Object.values(testData.TEST_COURSES).map(course => ({
                  ...course,
                  group: Object.values(testData.TEST_GROUPS).find(g => g.id === course.groupId),
                }))} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}