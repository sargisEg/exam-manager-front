import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Department, Group, Subgroup, Course, User, UserRole } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Users, BookOpen, Building2, ChevronRight } from "lucide-react";
import * as testData from "@shared/test-data";
import { useState } from 'react';

// Placeholder components - Replace with actual form components
const CreateUserForm = () => <div>Create User Form Placeholder</div>;
const CreateDepartmentForm = () => <div>Create Department Form Placeholder</div>;
const CreateGroupForm = () => <div>Create Group Form Placeholder</div>;
const CreateSubgroupForm = () => <div>Create Subgroup Form Placeholder</div>;
const CreateCourseForm = () => <div>Create Course Form Placeholder</div>;
const Modal = ({ isOpen, toggle, title, children }) => (
  <div style={{ display: isOpen ? 'block' : 'none' }}>
    <div>
      <h2>{title}</h2>
      {children}
      <button onClick={toggle}>Close</button>
    </div>
  </div>
);


// Test data

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [modalContent, setModalContent] = useState(null);

  const teacherColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
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
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        const subgroup = Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
        const group = subgroup ? Object.values(testData.TEST_GROUPS).find(g => g.id === subgroup.groupId) : null;
        return group?.name || "-";
      },
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

  const departmentColumns: ColumnDef<Department>[] = [
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
      header: "Groups",
      cell: ({ row }) => {
        const groups = Object.values(testData.TEST_GROUPS).filter(g => true); // In real app, filter by department
        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {groups.length} groups
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/department/${row.original.id}`)}
            >
              View Groups <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: Object.values(testData.TEST_USERS).length,
      icon: Users,
    },
    {
      title: "Teachers",
      value: Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.TEACHER).length,
      icon: Users,
    },
    {
      title: "Students",
      value: Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.STUDENT).length,
      icon: Users,
    },
    {
      title: "Departments",
      value: Object.values(testData.TEST_DEPARTMENTS).length,
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => setModalContent("user")}>Create User</Button>
            <Button onClick={() => setModalContent("department")}>Create Department</Button>
            <Button onClick={() => setModalContent("group")}>Create Group</Button>
            <Button onClick={() => setModalContent("subgroup")}>Create Subgroup</Button>
            <Button onClick={() => setModalContent("course")}>Create Course</Button>
          </div>
        </div>

        <Modal
          isOpen={!!modalContent}
          toggle={() => setModalContent(null)}
          title={`Create ${modalContent ? modalContent.charAt(0).toUpperCase() + modalContent.slice(1) : ""}`}
        >
          {modalContent === "user" && (
            <CreateUserForm onSubmit={(data) => {
              console.log(data);
              toast({
                title: "Success",
                description: "User created successfully",
              });
              setModalContent(null);
            }} />
          )}
          {modalContent === "department" && (
            <CreateDepartmentForm onSubmit={(data) => {
              console.log(data);
              toast({
                title: "Success",
                description: "Department created successfully",
              });
              setModalContent(null);
            }} />
          )}
          {modalContent === "group" && (
            <CreateGroupForm onSubmit={(data) => {
              console.log(data);
              toast({
                title: "Success",
                description: "Group created successfully",
              });
              setModalContent(null);
            }} />
          )}
          {modalContent === "subgroup" && (
            <CreateSubgroupForm onSubmit={(data) => {
              console.log(data);
              toast({
                title: "Success",
                description: "Subgroup created successfully",
              });
              setModalContent(null);
            }} />
          )}
          {modalContent === "course" && (
            <CreateCourseForm onSubmit={(data) => {
              console.log(data);
              toast({
                title: "Success",
                description: "Course created successfully",
              });
              setModalContent(null);
            }} />
          )}
        </Modal>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={departmentColumns} data={Object.values(testData.TEST_DEPARTMENTS)} initialSorting={[{ id: "name", desc: false }]}/>
            </CardContent>
          </Card>

          <Tabs defaultValue="teachers">
            <TabsList>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="teachers">
              <Card>
                <CardHeader>
                  <CardTitle>Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={teacherColumns} 
                    data={Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.TEACHER)} 
                    initialSorting={[{ id: "name", desc: false }]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={studentColumns} 
                    data={Object.values(testData.TEST_USERS).filter(u => u.role === UserRole.STUDENT)} 
                    initialSorting={[{ id: "name", desc: false }]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}