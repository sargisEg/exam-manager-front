import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Department, Group, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";
import { useToast } from "@/hooks/use-toast";
import useModal from "@/hooks/use-modal";
import { CreateGroupForm } from "@/components/create-group-form";
import Modal from "@/components/ui/modal";

export default function DepartmentDetails() {
  const { departmentId } = useParams();
  const [, navigate] = useLocation();
  const department = testData.TEST_DEPARTMENTS[departmentId || ""];
  const { isOpen, toggle } = useModal();
  const { toast } = useToast();
  
  const groupColumns: ColumnDef<Group>[] = [
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
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(
          (sg) => sg.id === row.original.subgroupId,
        );
        return subgroup?.name || "-";
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

  const handleCreateGroup = async (data: any) => {
    // Here you would typically make an API call to create the exam
    console.log(data);
    toggle();
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };

  
  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{department.name} Department</h1>
          <p className="text-muted-foreground">Department Code: {department.nameShort}</p>
        </div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <CreateGroupForm onSubmit={handleCreateGroup} departmentId={departmentId}/>
        </Modal>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Groups</CardTitle>
              <Button onClick={toggle}>Create Group</Button>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={groupColumns} 
                data={Object.values(testData.TEST_GROUPS).filter(g => g.departmentId == departmentId)}
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={studentColumns} 
                data={Object.values(testData.TEST_USERS)
                .filter(u => u.role === UserRole.STUDENT)} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
