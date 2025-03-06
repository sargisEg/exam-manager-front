import { ExamCalendar } from "@/components/exam-calendar.tsx";
import {StaticTable} from "@/components/data-table.tsx";
import { Navbar } from "@/components/navbar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast.ts";
import { useLocation } from "wouter";
import { Users, BookOpen, ChevronRight } from "lucide-react";
import useModal from "@/hooks/use-modal.tsx";
import Modal from "@/components/ui/modal.tsx";
import { ExamForm } from "@/components/exam-form.tsx";
import {useEffect, useState} from "react";
import {
  CourseResponse,
  ExamResponse,
  GroupResponse,
  TeacherResponse
} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";
import {NotGradedExams} from "@/components/not-graded-exams.tsx";
import {CreateExamRequest} from "@shared/request-models.ts";

export default function TeacherDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const teacherId = localStorage.getItem("userId");
  const { isOpen, toggle } = useModal();
  const [teacher, setTeacher] = useState<TeacherResponse>();
  const [loading, setLoading] = useState(true);
  const [resetExams, setResetExams] = useState(true);

  const getTeacher = async (): Promise<TeacherResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/teachers/me`);
    return await response.json();
  };
  useEffect(() => {
    setLoading(true);
    const fetchTeacher = async () => {
      try {
        setTeacher(await getTeacher());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchTeacher().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!teacherId || !teacher) {
    return <NotFound />;
  }

  const groups = teacher.courses.map((s) => s.group).filter(
      (group, index, self) => index === self.findIndex((g) => g.id === group.id)
  );

  const groupColumns: ColumnDef<GroupResponse>[] = [
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
        return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/department/${row.original.department.id}/teacher-group/${row.original.id}`)}
            >
              View Details <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        );
      },
    },
  ];

  const courseColumns: ColumnDef<CourseResponse>[] = [
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        return row.original.group.name;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/department/${row.original.group.department.id}/teacher-group/${row.original.group.id}/teacher-course/${row.original.id}`)}
        >
          View Course <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Groups",
      value: groups.length,
      icon: Users,
    },
    {
      title: "Total Courses",
      value: teacher.courses.length,
      icon: BookOpen,
    },
  ];

  const handleCreateExam = async ( body: CreateExamRequest, departmentId: string, groupId: string ) => {
    const response = await apiRequest("POST", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exams`, body);
    toggle();
    toast({
      title: "Success",
      description: "Exam created successfully",
    });
    setResetExams(!resetExams);
    return await response.json();
  };

  const getExams = async (): Promise<ExamResponse[]> => {
    const response = await apiRequest("GET", `/api/core/v1/exams/me`);
    return await response.json() as ExamResponse[];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Button onClick={toggle}>Create Exam</Button>
        </div>
        <Modal isOpen={isOpen} toggle={toggle} title="Create New Exam">
          <ExamForm onSubmit={handleCreateExam} courses={teacher.courses} />
        </Modal>

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
          <ExamCalendar getExams={getExams} reset={resetExams} />
          <NotGradedExams getExams={getExams} reset={true} />
          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <StaticTable
                  data = {groups}
                  columns = {groupColumns}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <StaticTable
                  data = {teacher.courses}
                  columns = {courseColumns}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
