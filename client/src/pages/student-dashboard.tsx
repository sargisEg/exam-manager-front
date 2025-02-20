import { ExamCalendar } from "@/components/exam-calendar";
import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Exam, ExamStatus, ExamType, Course } from "@shared/schema";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Test data
const TEST_EXAMS: Record<string, Exam> = {
  "a5a7c45b-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "a5a7c45b-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "ICS Midterm Exam",
    courseId: "d1b7a8e9-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "9c8b6d7e-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 101",
    startDate: new Date("2025-02-10T09:00:00.000Z"),
    endDate: new Date("2025-02-10T11:00:00.000Z"),
    maxPoints: 100,
    status: "UPCOMING",
    type: "MIDTERM",
  },
  "b2c8d56a-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "b2c8d56a-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Calculus General Exam",
    courseId: "de9c01f2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "1a2b3c4d-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 202",
    startDate: new Date("2025-02-25T14:30:00.000Z"),
    endDate: new Date("2025-02-25T16:30:00.000Z"),
    maxPoints: 150,
    status: "UPCOMING",
    type: "GENERAL",
  },
  "c9d0e17b-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "c9d0e17b-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "DSA Midterm",
    courseId: "e5a6b7c8-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "a9b0c1d2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 102",
    startDate: new Date("2025-03-15T11:00:00.000Z"),
    endDate: new Date("2025-03-15T13:00:00.000Z"),
    maxPoints: 120,
    status: "UPCOMING",
    type: "MIDTERM",
  },
  "d6e1f28c-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "d6e1f28c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Biology General Exam",
    courseId: "f2b3c4d5-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "c1d2e3f4-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Lab 1",
    startDate: new Date("2025-03-28T09:30:00.000Z"),
    endDate: new Date("2025-03-28T11:30:00.000Z"),
    maxPoints: 100,
    status: "UPCOMING",
    type: "GENERAL",
  },
  "e3f40a9d-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "e3f40a9d-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Calculus 1 Repeat Exam",
    courseId: "de9c01f2-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "1a2b3c4d-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 202",
    startDate: new Date("2025-04-10T13:00:00.000Z"),
    endDate: new Date("2025-04-10T15:00:00.000Z"),
    maxPoints: 100,
    status: "FINISHED",
    type: "REPEAT",
  },
  "f0a1b2c3-8f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "f0a1b2c3-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Engineering Midterm",
    courseId: "fe3a4b5c-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "d8e9f0a1-8f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Hall A",
    startDate: new Date("2025-04-22T10:30:00.000Z"),
    endDate: new Date("2025-04-22T12:30:00.000Z"),
    maxPoints: 130,
    status: "IN_PROGRESS",
    type: "MIDTERM",
  },
  "1b2c3d4e-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "1b2c3d4e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "History General Exam",
    courseId: "0b4c5d6e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "e5f60a1b-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Library",
    startDate: new Date("2025-05-05T15:00:00.000Z"),
    endDate: new Date("2025-05-05T17:00:00.000Z"),
    maxPoints: 110,
    status: "UPCOMING",
    type: "GENERAL",
  },
  "2c3d4e5f-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "2c3d4e5f-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "European History Midterm",
    courseId: "0b4c5d6e-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "f20a1b2c-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Archive Room",
    startDate: new Date("2025-05-18T11:30:00.000Z"),
    endDate: new Date("2025-05-18T13:30:00.000Z"),
    maxPoints: 100,
    status: "FINISHED",
    type: "MIDTERM",
  },
  "3d4e5f0a-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "3d4e5f0a-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "OS General Exam",
    courseId: "fa7b8c9d-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "b6c7d8e9-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 103",
    startDate: new Date("2025-06-02T10:00:00.000Z"),
    endDate: new Date("2025-06-02T12:00:00.000Z"),
    maxPoints: 150,
    status: "UPCOMING",
    type: "GENERAL",
  },
  "4e5f0a1b-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "4e5f0a1b-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "DBMS Midterm",
    courseId: "01b2c3d4-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "c3d4e5f6-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 104",
    startDate: new Date("2025-06-15T14:30:00.000Z"),
    endDate: new Date("2025-06-15T16:30:00.000Z"),
    maxPoints: 100,
    status: "UPCOMING",
    type: "MIDTERM",
  },
  "5f0a1b2c-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "5f0a1b2c-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Linear Algebra Midterm",
    courseId: "08c9d0e1-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "a0b1c2d3-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Room 203",
    startDate: new Date("2025-06-30T11:00:00.000Z"),
    endDate: new Date("2025-06-30T13:00:00.000Z"),
    maxPoints: 120,
    status: "UPCOMING",
    type: "MIDTERM",
  },
  "6a1b2c3d-9f5f-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "6a1b2c3d-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Genetics Midterm",
    courseId: "19c0d1e2-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "b3c4d5e6-9f5f-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Lab 2",
    startDate: new Date("2025-07-15T09:30:00.000Z"),
    endDate: new Date("2025-07-15T11:30:00.000Z"),
    maxPoints: 110,
    status: "UPCOMING",
    type: "MIDTERM",
  },
  "7b2c3d4e-0a60-4b3a-a5e9-b9f1a3c1a0a1": {
    id: "7b2c3d4e-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    title: "Thermodynamics General Exam",
    courseId: "20c1d2e3-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    subgroupId: "d9e0f1a2-0a60-4b3a-a5e9-b9f1a3c1a0a1",
    location: "Hall B",
    startDate: new Date("2025-07-28T13:00:00.000Z"),
    endDate: new Date("2025-07-28T15:00:00.000Z"),
    maxPoints: 140,
    status: "UPCOMING",
    type: "GENERAL",
  },
};

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

export default function StudentDashboard() {
  const [, navigate] = useLocation();

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/course/${row.original.id}`)}
          >
            View Course <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div>
          <div className="space-y-6">
            <ExamCalendar exams={TEST_EXAMS} />

            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={courseColumns}
                  data={Object.values(TEST_COURSES)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
