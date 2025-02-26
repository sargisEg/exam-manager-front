import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Exam, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import * as testData from "@shared/test-data";
import { CreateUserForm } from "@/components/create-user-form";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal";

export default function AdminSubgroupDetails() {
  const { toast } = useToast();
  const { departmentId } = useParams();
  const { groupId } = useParams();
  const { subgroupId } = useParams();
  const sub = subgroupId;
  const group = testData.TEST_GROUPS[groupId || ""];
  const subgroup = testData.TEST_SUBGROUPS[sub || ""];
  const { isOpen, toggle } = useModal();

  const studentColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ];

  const handleCreateUser = async (data: any) => {
    // Here you would typically make an API call to create the exam
    console.log(data);
    toggle();
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{subgroup.name}</h1>
          <p className="text-muted-foreground">
            Academic Year: {group.startYear} - {group.endYear}
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
              <DataTable 
                columns={studentColumns} 
                data={Object.values(testData.TEST_USERS).filter(u => subgroupId === u.subgroupId)} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
