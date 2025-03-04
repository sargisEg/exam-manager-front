import { useParams } from "wouter";
import { Navbar } from "@/components/navbar.tsx";
import { BackButton } from "@/components/ui/back-button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {CourseResponse, ExamResponse, ExamResultResponse, ExamStatus, Page} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import {useEffect, useState} from "react";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";

export default function CourseDetails() {
  const { departmentId, groupId, courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseResponse>();


  const getCourse = async (): Promise<CourseResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/courses/${courseId}`);
    return await response.json();
  };

  useEffect(() => {
    setLoading(true);
    const fetchCourse = async () => {
      try {
        setCourse(await getCourse());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchCourse().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (!courseId || !course) {
    return <NotFound/>;
  }

  const pastExamColumns: ColumnDef<ExamResultResponse>[] =[
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.exam.title,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.exam.type,
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.exam.startDate), "Pp"),
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.exam.maxPoints,
    },
    {
      accessorKey: "points",
      header: "My Points",
    },
  ];
  
  const examColumns: ColumnDef<ExamResponse>[] = [
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
      accessorKey: "maxPoints",
      header: "Max Points",
    },
  ];
  const getExamResults = async (page: number, size: number): Promise<Page<ExamResultResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exam-results/courses/${courseId}?page=${page}&size=${size}`);
    return await response.json() as Page<ExamResultResponse>;
  };

  const getExams = async (page: number, size: number): Promise<Page<ExamResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exams/courses/${courseId}?status=${ExamStatus.UPCOMING}&page=${page}&size=${size}`);
    return await response.json() as Page<ExamResponse>;
  };

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
            <DynamicTable getData={getExams} columns={examColumns} reset={true}/>
          </CardContent>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Past Exams</h2>
            <DynamicTable getData={getExamResults} columns={pastExamColumns} reset={true}/>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
