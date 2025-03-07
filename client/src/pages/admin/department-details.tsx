import {useLocation, useParams} from "wouter";
import {Navbar} from "@/components/navbar.tsx";
import {BackButton} from "@/components/ui/back-button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DynamicTable} from "@/components/data-table.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {ChevronRight} from "lucide-react";
import {useToast} from "@/hooks/use-toast.ts";
import useModal from "@/hooks/use-modal.tsx";
import {CreateGroupForm} from "@/components/create-group-form.tsx";
import Modal from "@/components/ui/modal.tsx";
import {apiRequest} from "@/lib/queryClient.ts";
import {DepartmentResponse, GroupResponse, Page, StudentResponse} from "@shared/response-models.ts";
import {useEffect, useState} from "react";
import {CreateGroupRequest} from "@shared/request-models.ts";
import NotFound from "@/pages/not-found.tsx";
import Loading from "@/pages/loading.tsx";

export default function DepartmentDetails() {
  const [, navigate] = useLocation();
  const { isOpen, toggle } = useModal();
  const { toast } = useToast();
  const [resetGroups, setResetGroups] = useState(true);
  const [loading, setLoading] = useState(true);
  const { departmentId } = useParams();
  const [department, setDepartment] = useState<DepartmentResponse>();
  const getDepartment = async (): Promise<DepartmentResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}`);
    return await response.json();
  };
  useEffect(() => {
    setLoading(true);
    const fetchDepartment = async () => {
      try {
        setDepartment(await getDepartment());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchDepartment().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!departmentId || !department) {
    return <NotFound />;
  }

  const groupColumns: ColumnDef<GroupResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startYear",
      header: "Start Year",
    },
    {
      accessorKey: "endYear",
      header: "End Year",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/department/${departmentId}/admin-group/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
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
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        return row.original.subgroup.group.name || "-";
      },
    },
    {
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        return row.original.subgroup.name || "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/student/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const getGroups = async (page: number, size: number): Promise<Page<GroupResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups?page=${page}&size=${size}`);
    return await response.json();
  };
  const getStudents = async (page: number, size: number): Promise<Page<StudentResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/students/page?department=${departmentId}&page=${page}&size=${size}`);
    return await response.json();
  };

  const handleCreateGroup = async (data: any) : Promise<CreateGroupRequest> => {
    const depResponse = await apiRequest("POST", `/api/core/v1/departments/${departmentId}/groups`, data);
    toggle();
    toast({
      title: "Success",
      description: "Department created successfully",
    });
    setResetGroups(!resetGroups);
    return await depResponse.json();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{department?.name} Department</h1>
          <p className="text-muted-foreground">Department Code: {department?.nameShort}</p>
        </div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <CreateGroupForm onSubmit={handleCreateGroup} departmentName={department?.name}/>
        </Modal>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Groups</CardTitle>
              <Button onClick={toggle}>Create Group</Button>
            </CardHeader>
            <CardContent>
              <DynamicTable
                  getData = {getGroups}
                  columns = {groupColumns}
                  reset = {resetGroups}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicTable
                  getData = {getStudents}
                  columns = {studentColumns}
                  reset = {true}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
