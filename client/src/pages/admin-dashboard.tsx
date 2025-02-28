import {getTable} from "@/components/data-table";
import {Navbar} from "@/components/navbar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {DepartmentResponse, Page, UserResponse, UserRole} from "@shared/response-models.ts";
import {User} from "@shared/schema.ts";
import {ColumnDef} from "@tanstack/react-table";
import {useToast} from "@/hooks/use-toast";
import {useLocation} from "wouter";
import {Building2, ChevronRight, Users} from "lucide-react";
import * as testData from "@shared/test-data";
import useModal from "@/hooks/use-modal";
import Modal from "@/components/ui/modal";
import {CreateTeacherForm} from "@/components/create-teacher-form";
import {CreateDepartmentForm} from "@/components/create-department-form";
import {useState} from "react";
import {apiRequest} from "@/lib/queryClient.ts";
import {CreateDepartmentRequest, CreateTeacherRequest} from "@shared/request-models.ts";

const stats = [
    {
        title: "Total Users",
        value: Object.values(testData.TEST_USERS).length,
        icon: Users,
    },
    {
        title: "Teachers",
        value: Object.values(testData.TEST_USERS).filter(
            (u) => u.role === UserRole.TEACHER,
        ).length,
        icon: Users,
    },
    {
        title: "Students",
        value: Object.values(testData.TEST_USERS).filter(
            (u) => u.role === UserRole.STUDENT,
        ).length,
        icon: Users,
    },
    {
        title: "Departments",
        value: Object.values(testData.TEST_DEPARTMENTS).length,
        icon: Building2,
    },
];

export default function AdminDashboard() {
    const {toast} = useToast();
    const {isOpen, toggle} = useModal();
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [, navigate] = useLocation();
    const [resetDepartments, setResetDepartments] = useState(true);
    const [resetTeachers, setResetTeachers] = useState(true);

    const departmentColumns: ColumnDef<DepartmentResponse>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "nameShort",
            header: "Short Name",
        },
        {
            id: "groups",
            header: "",
            cell: ({row}) => {
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/department/${row.original.id}`)}
                        >
                            View Groups <ChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                );
            },
        },
    ];
    const teacherColumns: ColumnDef<UserResponse>[] = [
        {
            accessorKey: "fullName",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/teacher/${row.original.id}`)}
                >
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
    ];
    const studentColumns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({row}) => {
                const subgroup = Object.values(testData.TEST_SUBGROUPS).find(
                    (sg) => sg.id === row.original.subgroupId,
                );
                const group = subgroup
                    ? Object.values(testData.TEST_GROUPS).find(
                        (g) => g.id === subgroup.groupId,
                    )
                    : null;
                const department = group
                    ? Object.values(testData.TEST_DEPARTMENTS).find(
                        (d) => d.id === group.departmentId,
                    )
                    : null;
                return department?.name || "-";
            },
        },
        {
            id: "group",
            header: "Group",
            cell: ({row}) => {
                const subgroup = Object.values(testData.TEST_SUBGROUPS).find(
                    (sg) => sg.id === row.original.subgroupId,
                );
                const group = subgroup
                    ? Object.values(testData.TEST_GROUPS).find(
                        (g) => g.id === subgroup.groupId,
                    )
                    : null;
                return group?.name || "-";
            },
        },
        {
            id: "subgroup",
            header: "Subgroup",
            cell: ({row}) => {
                const subgroup = Object.values(testData.TEST_SUBGROUPS).find(
                    (sg) => sg.id === row.original.subgroupId,
                );
                return subgroup?.name || "-";
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

    const getDepartments = async (page: number, size: number): Promise<Page<DepartmentResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments?page=${page}&size=${size}`);
        return await response.json();
    };
    const getTeachers = async (page: number, size: number): Promise<Page<UserResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/teachers/page?page=${page}&size=${size}`);
        return await response.json();
    };
    const getStudents = async (page: number, size: number): Promise<Page<DepartmentResponse>> => {
        const response = await apiRequest("GET", `/api/core/v1/departments?page=${page}&size=${size}`);
        return await response.json();
    };

    const handleCreateTeacher = async (data: CreateTeacherRequest) => {
        const response = await apiRequest("POST", `/api/core/v1/teachers`, data);
        toggle();
        setModalContent(null);
        toast({
            title: "Success",
            description: "Teacehr created successfully",
        });
        setResetTeachers(!resetTeachers);
        return await response.json();
    };

    const handleCreateDepartment = async (data: CreateDepartmentRequest) => {
        const response = await apiRequest("POST", `/api/core/v1/departments`, data);
        toggle();
        setModalContent(null);
        toast({
            title: "Success",
            description: "Department created successfully",
        });
        setResetDepartments(!resetDepartments);
        return await response.json();
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <Modal isOpen={isOpen} toggle={toggle}>
                    {modalContent === "teacher" && (
                        <CreateTeacherForm onSubmit={handleCreateTeacher}/>
                    )}
                    {modalContent === "department" && (
                        <CreateDepartmentForm onSubmit={handleCreateDepartment}/>
                    )}
                </Modal>

                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Department Structure</CardTitle>
                            <Button
                                onClick={() => {
                                    setModalContent("department")
                                    toggle();
                                }}
                            >
                                Create Department
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {getTable(
                                getDepartments,
                                departmentColumns,
                                resetDepartments
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="teachers">
                        <TabsList>
                            <TabsTrigger value="teachers">Teachers</TabsTrigger>
                            <TabsTrigger value="students">Students</TabsTrigger>
                        </TabsList>

                        <TabsContent value="teachers">
                            <Card>
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle>Teachers</CardTitle>
                                    <Button
                                        onClick={() => {
                                            setModalContent("teacher");
                                            toggle();
                                        }}
                                    >
                                        Create Teacher
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {getTable(
                                        getTeachers,
                                        teacherColumns,
                                        resetTeachers
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/*<DataTable*/}
                                    {/*  columns={studentColumns}*/}
                                    {/*  data={Object.values(testData.TEST_USERS).filter(*/}
                                    {/*    (u) => u.role === UserRole.STUDENT,*/}
                                    {/*  )}*/}
                                    {/*  initialSorting={initialSorting}*/}
                                    {/*/>*/}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
