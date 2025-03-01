import {useLocation, useParams} from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { CreateUserForm } from "@/components/create-user-form";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal";
import {Page, StudentResponse, SubgroupResponse} from "@shared/response-models.ts";
import NotFound from "@/pages/not-found.tsx";
import {apiRequest} from "@/lib/queryClient.ts";
import {useEffect, useState} from "react";
import {DynamicTable} from "@/components/data-table.tsx";
import {CreateStudentRequest} from "@shared/request-models.ts";
import Loading from "@/pages/loading.tsx";
import {ChevronRight} from "lucide-react";

export default function AdminSubgroupDetails() {
  const { departmentId } = useParams();
  const { groupId } = useParams();
  const { subgroupId } = useParams();
  const [subgroup, setSubgroup] = useState<SubgroupResponse>();
  const { toast } = useToast();
  const { isOpen, toggle } = useModal();
  const [resetStudents, setResetStudents] = useState(true);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const getSubgroup = async (): Promise<SubgroupResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups/${subgroupId}`);
    return await response.json();
  };

  useEffect(() => {
    setLoading(true);
    const fetchSubgroup = async () => {
      try {
        setSubgroup(await getSubgroup());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchSubgroup().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!departmentId || !groupId || !subgroupId || !subgroup) {
    return <NotFound />;
  }

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

  const getStudents = async (page: number, size: number): Promise<Page<StudentResponse>> => {
    const response = await apiRequest("GET", `/api/core/v1/students/page?department=${departmentId}&group=${groupId}&subgroup=${subgroupId}&page=${page}&size=${size}`);
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
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{subgroup?.name}</h1>
          <p className="text-muted-foreground">
            Academic Year: {subgroup?.group.startYear} - {subgroup?.group.endYear}
          </p>
        </div>

        <Modal isOpen={isOpen} toggle={toggle}>
          <CreateUserForm onSubmit={handleCreateUser} departmentId={departmentId} groupId={groupId} subgroupId={subgroupId}/>
        </Modal>

        <div className="grid gap-6">

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Students</CardTitle>
              <Button onClick={toggle}>
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
