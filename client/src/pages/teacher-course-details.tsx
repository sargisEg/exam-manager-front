import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import * as testData from "@shared/test-data";
import { Exam, ExamResult, examResults } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {createExamColumns} from "@/lib/exam-columns";
import useModal from "@/hooks/use-modal";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { EditExamForm } from "@/components/edit-exam-form";
import { useState } from 'react'

export default function CourseDetails() {
  const userId = localStorage.getItem("userId");
  const { courseId } = useParams();
  const course = testData.TEST_COURSES[courseId || ""];
  const exams = Object.values(testData.TEST_EXAMS)
    .filter(exam => exam.courseId === course?.id)
    .filter(exam => exam.startDate >= new Date());
  const pastExams = Object.values(testData.TEST_EXAMS)
    .filter(exam => exam.courseId === course?.id)
    .filter(exam => exam.startDate < new Date());

  const pastExamColumns: ColumnDef<Exam>[] =[
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "subgroupId",
      header: "Subgroup",
      cell: ({ row }) => testData.TEST_SUBGROUPS[row.original.subgroupId].name,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.type,
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
      cell: ({ row }) => row.original.maxPoints,
    }
  ];
  
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setIsEditModalOpen(true);
  };

  const handleRemoveExam = (exam: Exam) => {
    // Here you would typically make an API call to remove the exam
    console.log("Removing exam:", exam.id);
    toast({
      title: "Success",
      description: "Exam removed successfully",
    });
  };

  const handleSaveEdit = (data: Partial<Exam>) => {
    // Here you would typically make an API call to update the exam
    console.log("Saving exam changes:", { examId: editingExam?.id, ...data });
    setIsEditModalOpen(false);
    setEditingExam(null);
    toast({
      title: "Success",
      description: "Exam updated successfully",
    });
  };

  const examColumns = createExamColumns(handleEditExam, handleRemoveExam);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground">
            Group: {testData.TEST_GROUPS[course.groupId].name}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={examColumns}
                data={exams}
                initialSorting={[{ id: "startDate", desc: false }]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={pastExamColumns}
                data={pastExams}
                initialSorting={[{ id: "startDate", desc: true }]}
              />
            </CardContent>
          </Card>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          toggle={() => setIsEditModalOpen(false)}
          title="Edit Exam"
        >
          {editingExam && (
            <EditExamForm exam={editingExam} onSubmit={handleSaveEdit} />
          )}
        </Modal>
      </main>
    </div>
  );
}
