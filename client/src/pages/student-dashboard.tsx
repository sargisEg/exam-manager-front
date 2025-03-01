import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@shared/schema";
import * as testData from "@shared/test-data";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function StudentDashboard() {
  const [, navigate] = useLocation();

  const userId = localStorage.getItem("userId");
  const subgroupId = localStorage.getItem("subgroupId");
  const groupId = (subgroupId !== null) ? testData.TEST_SUBGROUPS[subgroupId].groupId : "";
  console.log(groupId);
  
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
            onClick={() => navigate(`/course-student/${row.original.id}`)}
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
        <div>
          <div className="space-y-6">
            <ExamCalendar
              exams={Object.values(testData.TEST_EXAMS).filter(
                (exam) => exam.subgroupId === subgroupId,
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={courseColumns}
                  data={Object.values(testData.TEST_COURSES).filter(
                    (course) => course.groupId === groupId,
                  )}
                  initialSorting={[{ id: "name", desc: false }]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
