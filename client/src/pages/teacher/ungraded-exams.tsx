import {StaticTable} from "@/components/data-table.tsx";
import {Navbar} from "@/components/navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {ColumnDef} from "@tanstack/react-table";
import {BackButton} from "@/components/ui/back-button.tsx";
import {ExamResponse, ExamStatus, StudentResponse} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";

export default function UngradedExams() {
    const {toast} = useToast();
    const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<StudentResponse[]>([]);
    const [grades, setGrades] = useState<Record<string, number>>({});
    const [ungradedExams, setUngradedExams] = useState<ExamResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const getFinishedExams = async (): Promise<ExamResponse[]> => {
        const response = await apiRequest("GET", `/api/core/v1/exams/me?status=${ExamStatus.FINISHED}`);
        return await response.json() as ExamResponse[];
    };
    const getStudents = async (exam: ExamResponse): Promise<StudentResponse[]> => {
            const subgroupId = exam.subgroup.id;
            const departmentId = exam.subgroup.group.department.id
            const groupId = exam.subgroup.group.id
            const response = await apiRequest("GET", `/api/core/v1/students?department=${departmentId}&group=${groupId}&subgroup=${subgroupId}`);
            return await response.json() as StudentResponse[];
    };

    useEffect(() => {
        setLoading(true);
        const fetchExams = async () => {
            try {
                const result = await getFinishedExams();
                setUngradedExams(result.filter(e => !e.isGraded));
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        const fetchStudents = async (exam: ExamResponse) => {
            try {
                setSelectedStudents(await getStudents(exam));
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        if (selectedExam) {
            fetchStudents(selectedExam).then(() => setLoading(false));
        } else {
            fetchExams().then(() => setLoading(false));
        }
    }, [selectedExam]);

    if (loading) {
        return <Loading />
    }

    const examColumns: ColumnDef<ExamResponse>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "startDate",
            header: "Date",
            cell: ({row}) => format(new Date(row.original.startDate), "PPP"),
        },
        {
            id: "actions",
            cell: ({row}) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSelectedExam(row.original);
                    }}
                >
                    Grade Exam
                </Button>
            ),
        },
    ];

    const handleGradeChange = (studentId: string, value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= selectedExam?.maxPoints!) {
            setGrades(prev => ({...prev, [studentId]: numValue}));
        }
    };

    const handleSaveGrades = async () => {
        if (Object.keys(grades).length != selectedStudents.length) {
            toast({
                title: "Failed",
                description: "Please grade all students",
            });
            return;
        }

        await apiRequest(
            "PUT",
            `/api/core/v1/departments/${selectedExam?.course.group.department.id}/groups/${selectedExam?.course.group.id}/exams/${selectedExam?.id}/grade`,
            {grades: grades});

        toast({
            title: "Success",
            description: "Grades saved successfully",
        });
        setSelectedExam(null);
        setGrades({});
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <BackButton/>
                {!selectedExam ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ungraded Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StaticTable
                                data={ungradedExams}
                                columns={examColumns}
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
                                {selectedStudents
                                    .map(student => (
                                        <div key={student.id} className="flex items-center gap-4">
                                            <div className="flex-1">{student.fullName}</div>
                                            <Input
                                                required={true}
                                                type="number"
                                                min={0}
                                                max={selectedExam.maxPoints}
                                                value={grades[student.id] || undefined}
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
