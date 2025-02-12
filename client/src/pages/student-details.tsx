import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { User, UserRole, Exam, ExamResult, Subgroup, Group, ExamStatus, ExamType } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// Test data
const TEST_USERS: Record<string, User> = {
  "1": {
    id: 1,
    name: "John Doe",
    username: "john",
    password: "test",
    email: "john@example.com",
    phone: "1234567890",
    role: UserRole.STUDENT,
    subgroupId: 1,
  },
};

const TEST_GROUPS: Group[] = [
  { id: 1, name: "CS-2025", startYear: 2025, endYear: 2029 },
];

const TEST_SUBGROUPS: Subgroup[] = [
  { id: 1, name: "CS-2025-A", groupId: 1 },
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

const TEST_RESULTS: ExamResult[] = [
  {
    id: 1,
    studentId: 1,
    examId: 1,
    points: 85,
  },
];

export default function StudentDetails() {
  const { studentId } = useParams();
  const student = TEST_USERS[studentId || ""];

  const examColumns: ColumnDef<Exam>[] = [
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
      accessorKey: "status",
      header: "Status",
    },
  ];

  const resultColumns: ColumnDef<ExamResult & { exam?: Exam }>[] = [
    {
      accessorKey: "exam.title",
      header: "Exam",
      cell: ({ row }) => row.original.exam?.title || "-",
    },
    {
      accessorKey: "exam.type",
      header: "Type",
      cell: ({ row }) => row.original.exam?.type || "-",
    },
    {
      accessorKey: "points",
      header: "Points",
    },
    {
      accessorKey: "exam.maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.exam?.maxPoints || "-",
    },
  ];

  if (!student) {
    return <div>Student not found</div>;
  }

  const subgroup = TEST_SUBGROUPS.find(sg => sg.id === student.subgroupId);
  const group = subgroup ? TEST_GROUPS.find(g => g.id === subgroup.groupId) : null;

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
                <div>{student.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{student.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Group</div>
                <div>{group?.name || "-"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Subgroup</div>
                <div>{subgroup?.name || "-"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={examColumns} 
                data={TEST_EXAMS.filter(e => 
                  e.status === ExamStatus.UPCOMING && 
                  e.subgroupId === student.subgroupId
                )} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={resultColumns} 
                data={TEST_RESULTS
                  .filter(r => r.studentId === Number(studentId))
                  .map(result => ({
                    ...result,
                    exam: TEST_EXAMS.find(e => e.id === result.examId),
                  }))} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
