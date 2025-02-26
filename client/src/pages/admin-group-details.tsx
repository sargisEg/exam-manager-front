import { useParams } from "wouter";
import { Navbar } from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import * as testData from "@shared/test-data";
import { useToast } from "@/hooks/use-toast";
import useModal from "@/hooks/use-modal";
import { CreateSubgroupForm } from "@/components/create-subgroup-form";
import { CreateCourseForm } from "@/components/create-course-form";
import Modal from "@/components/ui/modal";
import { ReactNode, useState } from "react";
import { CreateUserForm } from "@/components/create-user-form";

export default function AdminGroupDetails() {
  const { toast } = useToast();
  const { groupId } = useParams();
  const { departmentId } = useParams();
  const [, navigate] = useLocation();
  const group = testData.TEST_GROUPS[groupId || ""];
  const { isOpen, toggle } = useModal();
  const [modalContent, setModalContent] = useState<string | null>(null);

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = Object.values(testData.TEST_USERS).filter(
          u => u.role === UserRole.STUDENT && u.subgroupId === row.original.id
        );
        return students.length;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`${groupId}/admin-subgroup/${row.original.id}`)}
        >
          View Details <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
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

  if (!group) {
    return <div>Group not found</div>;
  }

  const handleCreateSubgroup = async (data: any) => {
    // Here you would typically make an API call to create the exam
    //console.log(data);
    toggle();
    setModalContent(null);
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };
  const handleCreateCourse = async (data: any) => {
    // Here you would typically make an API call to create the exam
    //console.log(data);
    toggle();
    setModalContent(null);
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };
  
  const handleCreateUser = async (data: any) => {
    // Here you would typically make an API call to create the exam
    console.log(data);
    toggle();
    setModalContent(null);
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">
            Academic Year: {group.startYear} - {group.endYear}
          </p>
        </div>

        <Modal isOpen={isOpen} toggle={toggle}>
          {modalContent === "subgroup" && (
            <CreateSubgroupForm onSubmit={handleCreateSubgroup} departmentId = {departmentId} groupId = {groupId} />
          )}
          {modalContent === "course" && (
            <CreateCourseForm onSubmit={handleCreateCourse} departmentId = {departmentId} groupId = {groupId} />
          )}
          {modalContent === "user" && (
            <CreateUserForm onSubmit={handleCreateUser} departmentId = {departmentId} groupId = {groupId} subgroupId={undefined} />
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
              <DataTable 
                columns={subgroupColumns} 
                data={Object.values(testData.TEST_SUBGROUPS).filter(sg => sg.groupId === groupId)} 
                initialSorting={[{ id: "name", desc: false }]}
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
              <DataTable 
                columns={courseColumns} 
                data={Object.values(testData.TEST_COURSES).filter(c => c.groupId === groupId)} 
                initialSorting={[{ id: "name", desc: false }]}
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
              <DataTable 
                columns={studentColumns} 
                data={Object.values(testData.TEST_USERS).filter(u => {
                  if (u.role !== UserRole.STUDENT) return false;
                  const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === u.subgroupId);
                  return subgroup?.groupId === groupId;
                })} 
                initialSorting={[{ id: "name", desc: false }]}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
