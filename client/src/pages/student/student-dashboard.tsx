import { ExamCalendar } from "@/components/exam-calendar.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import { Navbar } from "@/components/navbar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button.tsx";
import { ChevronRight } from "lucide-react";
import {useEffect, useState} from "react";
import {CourseResponse, ExamResponse, Page, StudentResponse} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const studentId = localStorage.getItem("userId");
  const [student, setStudent] = useState<StudentResponse>();
  const [loading, setLoading] = useState(true);

  const getStudent = async (): Promise<StudentResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/students/me`);
    return await response.json();
  };
  useEffect(() => {
    setLoading(true);
    const fetchStudent = async () => {
      try {
        setStudent(await getStudent());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchStudent().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!studentId || !student) {
    return <NotFound />;
  }


  const courseColumns: ColumnDef<CourseResponse>[] = [
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
            onClick={() => navigate(`/department/${row.original.group.department.id}/student-group/${row.original.group.id}/student-course/${row.original.id}`)}
          >
            View Course <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const getCourses = async (page: number, size: number): Promise<Page<CourseResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${student.subgroup.group.department.id}/groups/${student.subgroup.group.id}/courses?page=${page}&size=${size}`);
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
        <div>
          <div className="space-y-6">
            <ExamCalendar getExams={getExams} reset={true} />
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicTable
                  getData={getCourses}
                  columns={courseColumns}
                  reset={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
