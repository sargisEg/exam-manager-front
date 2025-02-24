
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import * as testData from "@shared/test-data";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Exam, ExamStatus } from "@shared/schema";
import { BackButton } from "@/components/back-button";

export default function UngradedExams() {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [grades, setGrades] = useState<Record<string, number>>({});

  const examColumns: ColumnDef<Exam>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedExam(row.original)}
        >
          Grade Exam
        </Button>
      ),
    },
  ];

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= selectedExam?.maxPoints!) {
      setGrades(prev => ({ ...prev, [studentId]: numValue }));
    }
  };

  const handleSaveGrades = async () => {
    // Here you would typically make an API call to save the grades
    console.log("Saving grades:", { examId: selectedExam?.id, grades });
    toast({
      title: "Success",
      description: "Grades saved successfully",
    });
    setSelectedExam(null);
    setGrades({});
  };

  const ungradedExams = Object.values(testData.TEST_EXAMS).filter(
    exam => exam.status === ExamStatus.FINISHED && !exam.isGraded
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        {!selectedExam ? (
          <Card>
            <CardHeader>
              <CardTitle>Ungraded Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={examColumns}
                data={ungradedExams}
                initialSorting={[{ id: "startDate", desc: true }]}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Grade {selectedExam.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(testData.TEST_STUDENTS)
                  .filter(student => student.subgroupId === selectedExam.subgroupId)
                  .map(student => (
                    <div key={student.id} className="flex items-center gap-4">
                      <div className="flex-1">{student.name}</div>
                      <Input
                        type="number"
                        min={0}
                        max={selectedExam.maxPoints}
                        value={grades[student.id] || ""}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        className="w-24"
                      />
                      <div className="w-20 text-sm text-muted-foreground">
                        / {selectedExam.maxPoints}
                      </div>
                    </div>
                  ))}
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setSelectedExam(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGrades}>Save Grades</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
