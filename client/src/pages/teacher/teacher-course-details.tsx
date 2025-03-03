import {useParams} from "wouter";
import {Navbar} from "@/components/navbar.tsx";
import {BackButton} from "@/components/ui/back-button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import {format} from "date-fns";
import {ColumnDef} from "@tanstack/react-table";
import {createExamColumns} from "@/lib/exam-columns.tsx";
import Modal from "@/components/ui/modal.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {EditExamForm} from "@/components/edit-exam-form.tsx";
import {useEffect, useState} from 'react'
import {
    CourseResponse,
    ExamResponse,
    ExamResultResponse, ExamStatus,
    Page,
} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";
import {EditExamRequest} from "@shared/request-models.ts";

export default function CourseDetails() {
    const {groupId} = useParams();
    const {departmentId} = useParams();
    const {courseId} = useParams();

    const [editingExam, setEditingExam] = useState<ExamResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const {toast} = useToast();
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

    if (!groupId || !departmentId || !courseId || !course) {
        return <NotFound/>;
    }


    const pastExamColumns: ColumnDef<ExamResultResponse>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({row}) => row.original.exam.title,
        },
        {
            accessorKey: "subgroupId",
            header: "Subgroup",
            cell: ({row}) => row.original.exam.subgroup.name,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => row.original.exam.type,
        },
        {
            accessorKey: "startDate",
            header: "Date",
            cell: ({row}) => format(new Date(row.original.exam.startDate), "Pp"),
        },
        {
            accessorKey: "maxPoints",
            header: "Max Points",
            cell: ({row}) => row.original.exam.maxPoints,
        }
    ];

    const handleEditExam = (exam: ExamResponse) => {
        setEditingExam(exam);
        setIsEditModalOpen(true);
    };

    const handleRemoveExam = (exam: ExamResponse) => {
        // Here you would typically make an API call to remove the exam
        console.log("Removing exam:", exam.id);
        toast({
            title: "Success",
            description: "Exam removed successfully",
        });
    };

    const handleSaveEdit = (data: Partial<EditExamRequest>) => {
        // Here you would typically make an API call to update the exam
        console.log("Saving exam changes:", {examId: editingExam?.id, ...data});
        setIsEditModalOpen(false);
        setEditingExam(null);
        toast({
            title: "Success",
            description: "Exam updated successfully",
        });
    };

    const examColumns = createExamColumns(handleEditExam, handleRemoveExam);

    const getExamResults = async (page: number, size: number): Promise<Page<ExamResultResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exam-results/courses/${courseId}?page=${page}&size=${size}`);
        return await response.json() as Page<ExamResultResponse>;
    };

    const getExams = async (page: number, size: number): Promise<Page<ExamResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/exams/courses/${courseId}?status=${ExamStatus.FINISHED}&page=${page}&size=${size}`);
        return await response.json() as Page<ExamResponse>;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <BackButton/>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">{course.name}</h1>
                    <p className="text-muted-foreground">
                        Group: {course.group.name}
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable getData={getExams} columns={examColumns} reset={true}/>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Past Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable getData={getExamResults} columns={pastExamColumns} reset={true}/>
                        </CardContent>
                    </Card>
                </div>

                <Modal
                    isOpen={isEditModalOpen}
                    toggle={() => setIsEditModalOpen(false)}
                    title="Edit Exam"
                >
                    {editingExam && (
                        <EditExamForm exam={editingExam} onSubmit={handleSaveEdit}/>
                    )}
                </Modal>
            </main>
        </div>
    );
}
