import {useParams} from "wouter";
import {Navbar} from "@/components/navbar.tsx";
import {BackButton} from "@/components/ui/back-button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {ChevronRight} from "lucide-react";
import {useLocation} from "wouter";
import {useEffect, useState} from "react";
import {
    CourseResponse,
    GroupResponse,
    Page,
    StudentResponse,
    SubgroupResponse,
    TeacherResponse
} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";
import NotFound from "@/pages/not-found.tsx";

export default function TeacherGroupDetails() {
    const {groupId} = useParams();
    const {departmentId} = useParams();
    const [, navigate] = useLocation();
    const [group, setGroup] = useState<GroupResponse>();
    const [teacher, setTeacher] = useState<TeacherResponse>();
    const [loading, setLoading] = useState(true);

    const getGroup = async (): Promise<GroupResponse> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}`);
        return await response.json();
    };

    const getTeacher = async (): Promise<TeacherResponse> => {
        const response = await apiRequest("GET", `/api/core/v1/teachers/me`);
        return await response.json();
    };

    useEffect(() => {
        setLoading(true);
        const fetchGroup = async () => {
            try {
                setTeacher(await getTeacher());
                setGroup(await getGroup());
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        fetchGroup().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loading/>;
    }

    if (!groupId || !departmentId || !group || !teacher) {
        return <NotFound/>;
    }

    const course = teacher.courses.find(course => course.group.id === groupId);

    const subgroupColumns: ColumnDef<SubgroupResponse>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            cell: ({row}) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/department/${departmentId}/teacher-group/${groupId}/teacher-subgroup/${row.original.id}`)}
                >
                    View Details <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            ),
        },
    ];

    const courseColumns: ColumnDef<CourseResponse>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            cell: ({row}) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/department/${departmentId}/teacher-group/${groupId}/teacher-course/${row.original.id}`)}
                >
                    View Details <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            ),
        },
    ];

    const studentColumns: ColumnDef<StudentResponse>[] = [
        {
            accessorKey: "fullName",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            id: "subgroup",
            header: "Subgroup",
            cell: ({row}) => {
                return row.original.subgroup.name;
            },
        },
    ];

    const getSubgroups = async (page: number, size: number): Promise<Page<SubgroupResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups/page?page=${page}&size=${size}`);
        return await response.json();
    };

    const getStudents = async (page: number, size: number): Promise<Page<StudentResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/students/page?department=${departmentId}&group=${groupId}&page=${page}&size=${size}`);
        return await response.json();
    };

    const getCourses = async (page: number, size: number): Promise<Page<CourseResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/courses?page=${page}&size=${size}`);
        return await response.json();
    };


    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <BackButton/>
                <div className="mb-8">
                    <h1><span className="text-3xl font-bold">Group: </span> <span className="text-2xl">{group.name}</span></h1>
                    <h1><span className="text-3xl font-bold">Course: </span> <span className="text-2xl">{course?.name}</span></h1>
                    <p className="text-muted-foreground">
                        Academic Year: {group.startYear} - {group.endYear}
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subgroups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData={getSubgroups}
                                columns={subgroupColumns}
                                reset={true}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData={getCourses}
                                columns={courseColumns}
                                reset={true}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData={getStudents}
                                columns={studentColumns}
                                reset={true}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
