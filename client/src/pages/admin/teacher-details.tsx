import {useParams} from "wouter";
import {Navbar} from "@/components/navbar.tsx";
import {BackButton} from "@/components/ui/back-button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {StaticTable} from "@/components/data-table.tsx";
import {ColumnDef} from "@tanstack/react-table";
import NotFound from "@/pages/not-found.tsx";
import {useEffect, useState} from "react";
import {CourseResponse, GroupResponse, TeacherResponse,} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import Loading from "@/pages/loading.tsx";

export default function TeacherDetails() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState<TeacherResponse>();
  const [loading, setLoading] = useState(true);

  const getTeacher = async (): Promise<TeacherResponse> => {
    const response = await apiRequest("GET", `/api/core/v1/teachers/${teacherId}`);
    return await response.json();
  };
  useEffect(() => {
    setLoading(true);
    const fetchTeacher = async () => {
      try {
        setTeacher(await getTeacher());
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchTeacher().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!teacherId || !teacher) {
    return <NotFound />;
  }

  const groupColumns: ColumnDef<GroupResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startYear",
      header: "Year",
      cell: ({row}) =>  {
        return row.original.startYear + "-" + row.original.endYear;
      },
    },
  ];

  // const subgroupColumns: ColumnDef<SubgroupResponse>[] = [
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //   },
  //   {
  //     id: "group",
  //     header: "Group",
  //     cell: ({ row }) => {
  //       return row.original.group.name;
  //     },
  //   },
  //
  // ];

  const courseColumns: ColumnDef<CourseResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "subgroup",
      header: "Subgroup",
      cell: ({ row }) => {
        return row.original.name;
      },
    },
    {
      id: "group",
      header: "Group",
      cell: ({ row }) => {
        return row.original.group.name;

      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{teacher.user.fullName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{teacher.user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{teacher.user.phone}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <StaticTable
                  data = {teacher.courses.map((c) => c.group).filter(
                      (group, index, self) => index === self.findIndex((g) => g.id === group.id)
                  )}
                  columns = {groupColumns}
              />
            </CardContent>
          </Card>

          {/*<Card>*/}
          {/*  <CardHeader>*/}
          {/*    <CardTitle>Subgroups</CardTitle>*/}
          {/*  </CardHeader>*/}
          {/*  <CardContent>*/}
          {/*    <StaticTable*/}
          {/*        data={teacher.subgroups}*/}
          {/*        columns={subgroupColumns}*/}
          {/*    />*/}
          {/*  </CardContent>*/}
          {/*</Card>*/}

          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <StaticTable
                  data={teacher.courses}
                  columns={courseColumns}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
