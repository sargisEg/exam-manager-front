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

// Test data
const TEST_COURSES: Record<string, Course> = {
  "d1b7a8e9-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "d1b7a8e9-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Introduction to Computer Science",
    groupId: "5b6c7d8e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "e5a6b7c8-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "e5a6b7c8-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Data Structures and Algorithms",
    groupId: "5b6c7d8e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "fa7b8c9d-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "fa7b8c9d-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Operating Systems",
    groupId: "5b6c7d8e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "01b2c3d4-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "01b2c3d4-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Database Management Systems",
    groupId: "5b6c7d8e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "de9c01f2-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "de9c01f2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Calculus 1",
    groupId: "6c7d8e9f-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "19c0d1e2-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "19c0d1e2-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Calculus 2",
    groupId: "6c7d8e9f-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "08c9d0e1-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "08c9d0e1-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Linear Algebra",
    groupId: "6c7d8e9f-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "2a3b4c5d-0a60-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "2a3b4c5d-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Differential Equations",
    groupId: "6c7d8e9f-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "f2b3c4d5-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "f2b3c4d5-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Introduction to Biology",
    groupId: "7d8e9f0a-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "1dcdfb48-5a18-4aea-a957-1320e689faf1": {
    id: "1dcdfb48-5a18-4aea-a957-1320e689faf1",
    name: "Genetics",
    groupId: "7d8e9f0a-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "fe3a4b5c-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "fe3a4b5c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Engineering Mechanics",
    groupId: "8e9f0a1b-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "20c1d2e3-0a60-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "20c1d2e3-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    name: "Thermodynamics",
    groupId: "8e9f0a1b-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "0b4c5d6e-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "0b4c5d6e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    name: "World History 101",
    groupId: "9f0a1b2c-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
  "3c5d6e7f-0a60-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "3c5d6e7f-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    name: "European History 19th Century",
    groupId: "9f0a1b2c-0a60-4b3a-a5e9-b9f1a3c1a0a1",
  },
};

const TEST_GROUPS: Record<string, Group> = {
  "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    "id": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    "name": "CS Group 1",
    "startYear": 2021,
    "endYear": 2025,
    "departmentId": "95b8a7c6-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
  },
  "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    "id": "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    "name": "Math Group 1",
    "startYear": 2022,
    "endYear": 2026,
    "departmentId": "a2c9b8d7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
  },
  "c5d6e7f8-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    "id": "c5d6e7f8-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    "name": "Bio Group 1",
    "startYear": 2023,
    "endYear": 2027,
    "departmentId": "afdae10a-0a60-4b3a-a5e9-b9f1a3c1a0a1"
  },
  "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    "id": "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    "name": "Eng Group 1",
    "startYear": 2024,
    "endYear": 2028,
    "departmentId": "bca1f2b3-0a60-4b3a-a5e9-b9f1a3c1a0a1"
  },
  "e9f0a1b2-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    "id": "e9f0a1b2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    "name": "Hist Group 1",
    "startYear": 2022,
    "endYear": 2026,
    "departmentId": "c8d5e6f7-0a60-4b3a-a5e9-b9f1a3c1a0a1"
  }
};

const TEST_SUBGROUPS: Record<string, Subgroup> = {
    "9c8b6d7e-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "9c8b6d7e-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "CS Subgroup 1A",
      "groupId": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "a9b0c1d2-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "a9b0c1d2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "CS Subgroup 1B",
      "groupId": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "b6c7d8e9-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "b6c7d8e9-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "CS Subgroup 1C",
      "groupId": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "c3d4e5f6-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "c3d4e5f6-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "CS Subgroup 1D",
      "groupId": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "d0e1f20a-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "d0e1f20a-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "CS Subgroup 1E",
      "groupId": "b0c9d8e7-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "1a2b3c4d-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "1a2b3c4d-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Math Subgroup 1A",
      "groupId": "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "a0b1c2d3-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "a0b1c2d3-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Math Subgroup 1B",
      "groupId": "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "b3c4d5e6-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "b3c4d5e6-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Math Subgroup 1C",
      "groupId": "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "c0d1e2f3-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "c0d1e2f3-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Math Subgroup 1D",
      "groupId": "be1a2b3c-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "c1d2e3f4-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "c1d2e3f4-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Bio Subgroup 1A",
      "groupId": "c5d6e7f8-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "d4e5f60a-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "d4e5f60a-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Bio Subgroup 1B",
      "groupId": "c5d6e7f8-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "e1f20a1b-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "e1f20a1b-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Bio Subgroup 1C",
      "groupId": "c5d6e7f8-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "d8e9f0a1-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "d8e9f0a1-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Eng Subgroup 1A",
      "groupId": "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "e5f60a1b-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "e5f60a1b-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Eng Subgroup 1B",
      "groupId": "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "f20a1b2c-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "f20a1b2c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Eng Subgroup 1C",
      "groupId": "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "fe3a4b5c-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "fe3a4b5c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Eng Subgroup 1D",
      "groupId": "d2e3f40a-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "f20a1b2c-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "f20a1b2c-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Hist Subgroup 1A",
      "groupId": "e9f0a1b2-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "01b2c3d4-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "01b2c3d4-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Hist Subgroup 1B",
      "groupId": "e9f0a1b2-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    },
    "08c9d0e1-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
      "id": "08c9d0e1-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
      "name": "Hist Subgroup 1C",
      "groupId": "e9f0a1b2-8f5f-4b3a-a5e9-b9f1a3c1a0a1"
    }
  }

const TEST_USERS: User[] = [
  {
    id: 1,
    name: "John Doe",
    username: "john",
    password: "test",
    email: "john@example.com",
    phone: "1234567890",
    role: UserRole.STUDENT,
    subgroupId: "1",
  },
];

export default function GroupDetails() {
  const { groupId } = useParams();
  const [, navigate] = useLocation();
  const group = TEST_GROUPS[groupId || ""];

  const subgroupColumns: ColumnDef<Subgroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = TEST_USERS.filter(
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
          onClick={() => navigate(`/subgroup/${row.original.id}`)}
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
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/course/${row.original.id}`)}
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
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        const subgroup = Object.values(TEST_SUBGROUPS).find(sg => sg.id === row.original.subgroupId);
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

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subgroups</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={subgroupColumns} 
                data={Object.values(TEST_SUBGROUPS).filter(sg => sg.groupId === groupId)} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={courseColumns} 
                data={Object.values(TEST_COURSES).filter(c => c.groupId === groupId)} 
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
                data={TEST_USERS.filter(u => {
                  if (u.role !== UserRole.STUDENT) return false;
                  const subgroup = Object.values(TEST_SUBGROUPS).find(sg => sg.id === u.subgroupId);
                  return subgroup?.groupId === groupId;
                })} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
