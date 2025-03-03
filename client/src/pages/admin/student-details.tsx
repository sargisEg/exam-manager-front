import {useParams} from "wouter";
import {Navbar} from "@/components/navbar.tsx";
import {BackButton} from "@/components/ui/back-button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import {ExamResponse, ExamResultResponse, Page, StudentResponse} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";

export default function StudentDetails() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<StudentResponse>();
  const [loading, setLoading] = useState(true);

  const getStudent = async (): Promise<StudentResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/students/${studentId}`);
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

  const groupId = student.subgroup.group.id;
  const departmentId = student.subgroup.group.department.id;


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
      cell: ({ row }) => format(new Date(row.original.startDate), "Pp"),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  const resultColumns: ColumnDef<ExamResultResponse>[] = [
    {
      accessorKey: "exam.title",
      header: "Exam",
      cell: ({ row }) => row.original.exam?.title || "-",
    },
    {
      accessorKey: "exam.type",
      header: "Type",
      cell: ({ row }) => row.original.exam.type || "-",
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.exam.startDate), "Pp"),
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => row.original.points || "-",
    },
    {
      accessorKey: "exam.maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.exam.maxPoints || "-",
    },
  ];

  const getExams = async (page: number, size: number): Promise<Page<ExamResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exams/students/${studentId}?page=${page}&size=${size}`);
    return await response.json() as Page<ExamResponse>;
  };

  const getExamResults = async (page: number, size: number): Promise<Page<ExamResultResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exam-results/students/${studentId}?page=${page}&size=${size}`);
    return await response.json() as Page<ExamResultResponse>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{student.fullName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{student.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Group</div>
                <div>{student.subgroup.group.name || "-"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Subgroup</div>
                <div>{student.subgroup.name || "-"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicTable
                getData={getExams}
                columns={examColumns}
                reset={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicTable
                  getData={getExamResults}
                  columns={resultColumns}
                  reset={true}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
