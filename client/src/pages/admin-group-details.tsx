import {useParams} from "wouter";
import {Navbar} from "@/components/navbar";
import {BackButton} from "@/components/ui/back-button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DynamicTable} from "@/components/data-table";
import {
    Page,
    GroupResponse,
    SubgroupResponse,
    CourseResponse, StudentResponse
} from "@shared/response-models.ts";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import {useLocation} from "wouter";
import {useToast} from "@/hooks/use-toast";
import useModal from "@/hooks/use-modal";
import {CreateSubgroupForm} from "@/components/create-subgroup-form";
import {CreateCourseForm} from "@/components/create-course-form";
import Modal from "@/components/ui/modal";
import {useEffect, useState} from "react";
import {CreateUserForm} from "@/components/create-user-form";
import {apiRequest} from "@/lib/queryClient.ts";
import {CreateCourseRequest, CreateStudentRequest, CreateSubgroupRequest} from "@shared/request-models.ts";
import NotFound from "@/pages/not-found.tsx";
import Loading from "@/pages/loading.tsx";

export default function AdminGroupDetails() {

    const {toast} = useToast();
    const [, navigate] = useLocation();
    const {isOpen, toggle} = useModal();
    const [modalContent, setModalContent] = useState<string | null>(null);

    const [resetSubgroups, setResetSubgroups] = useState(true);
    const [resetCourses, setResetCourses] = useState(true);
    const [resetStudents, setResetStudents] = useState(true);

    const {groupId} = useParams();
    const {departmentId} = useParams();

    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<GroupResponse>();

    const getGroup = async (): Promise<GroupResponse> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}`);
        return await response.json();
    };

    useEffect(() => {
        setLoading(true);
        const fetchGroup = async () => {
            try {
                setGroup(await getGroup());
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        fetchGroup().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!departmentId || !groupId || !group) {
        return <NotFound />;
    }

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
                    onClick={() => navigate(`${groupId}/admin-subgroup/${row.original.id}`)}
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
            accessorKey: "teacher",
            header: "Teacher",
            cell: ({row}) => {return row.original.teacher.fullName},
        }
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
                return row.original.subgroup.name || "-";
            },
        },
        {
            id: "actions",
            cell: ({row}) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/student/${row.original.id}`)}
                >
                    View Details <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            ),
        },
    ];


    const getSubgroups = async (page: number, size: number): Promise<Page<SubgroupResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups/page?page=${page}&size=${size}`);
        return await response.json();
    };
    const getCourses = async (page: number, size: number): Promise<Page<CourseResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/courses?page=${page}&size=${size}`);
        return await response.json();
    };
    const getStudents = async (page: number, size: number): Promise<Page<StudentResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/students/page?department=${departmentId}&group=${groupId}&page=${page}&size=${size}`);
        return await response.json();
    };

    const handleCreateSubgroup = async (data: CreateSubgroupRequest) => {
        const response = await apiRequest("POST", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups`, data);
        toggle();
        toast({
            title: "Success",
            description: "Subgroup created successfully",
        });
        setResetSubgroups(!resetSubgroups);
        return await response.json();
    };
    const handleCreateCourse = async (data: CreateCourseRequest) => {
        const response = await apiRequest("POST", `/api/core/v1/departments/${departmentId}/groups/${groupId}/courses`, data);
        toggle();
        setModalContent(null);
        toast({
            title: "Success",
            description: "Course created successfully",
        });
        setResetCourses(!resetCourses);
        return await response.json();
    };
    const handleCreateUser = async (data: CreateStudentRequest) => {
        const response = await apiRequest("POST", `/api/core/v1/students`, data);
        toggle();
        toast({
            title: "Success",
            description: "Student created successfully",
        });
        setResetStudents(!resetStudents);
        return await response.json();
    };
    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <BackButton/>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">{group?.name}</h1>
                    <p className="text-muted-foreground">
                        Academic Year: {group?.startYear} - {group?.endYear}
                    </p>
                </div>

                <Modal isOpen={isOpen} toggle={toggle}>
                    {modalContent === "subgroup" && (
                        <CreateSubgroupForm onSubmit={handleCreateSubgroup} departmentName={group?.department.name}
                                            groupName={group?.name}/>
                    )}
                    {modalContent === "course" && (
                        <CreateCourseForm onSubmit={handleCreateCourse} departmentName={group?.department.name}
                                          groupName={group?.name}/>
                    )}
                    {modalContent === "user" && (
                        <CreateUserForm onSubmit={handleCreateUser} departmentId={departmentId} groupId={groupId}
                                        subgroupId={undefined}/>
                    )}
                </Modal>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Subgroups</CardTitle>
                            <Button
                                onClick={() => {
                                    setModalContent("subgroup")
                                    toggle();
                                }}
                            >
                                Create Subgroup
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData = {getSubgroups}
                                columns = {subgroupColumns}
                                reset = {resetSubgroups}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Courses</CardTitle>
                            <Button
                                onClick={() => {
                                    setModalContent("course")
                                    toggle();
                                }}
                            >
                                Create Course
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData = {getCourses}
                                columns = {courseColumns}
                                reset = {resetCourses}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Students</CardTitle>
                            <Button
                                onClick={() => {
                                    setModalContent("user")
                                    toggle();
                                }}
                            >
                                Create Student
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DynamicTable
                                getData = {getStudents}
                                columns = {studentColumns}
                                reset = {resetStudents}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
