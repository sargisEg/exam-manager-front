import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {CourseResponse, ExamType, SubgroupResponse} from "@shared/response-models.ts";
import {useEffect, useState} from "react";
import {CreateExamRequest} from "@shared/request-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";


export function ExamForm({onSubmit, courses}: {
    onSubmit: (
        body: CreateExamRequest,
        departmentId: string,
        groupId: string
    ) => void;
    courses: CourseResponse[];
}) {
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [selectedSubgroupId, setSelectedSubgroupId] = useState<string | null>(null);
    const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupResponse[]>([]);

    useEffect(() => {
        if (selectedDepartmentId && selectedGroupId) {
            getSubgroups(selectedDepartmentId, selectedGroupId).then(res => setFilteredSubgroups(res));
        }
    }, [selectedDepartmentId, selectedGroupId]);

    const form = useForm({
        defaultValues: {
            title: "",
            location: "",
            startDate: "",
            endDate: "",
            maxPoints: 0,
            type: ExamType.MIDTERM,
            departmentId: undefined,
            groupId: undefined,
            subgroupId: undefined,
            courseId: undefined,
        },
    });

    const getSubgroups = async (departmentId: string, groupId: string): Promise<SubgroupResponse[]> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups`);
        return await response.json();
    };

    const departments = courses.map(course => {
        return course.group.department;
    }).filter((obj, index, self) =>
        index === self.findIndex((t) => t.id === obj.id)
    );
    const groups = courses.map(course => {
        return course.group;
    }).filter((obj, index, self) =>
        index === self.findIndex((t) => t.id === obj.id)
    );


    const filteredGroups = selectedDepartmentId
        ? groups.filter(
            (g) => g.department.id === selectedDepartmentId
        )
        : [];

    const filteredCourses = selectedGroupId
        ? courses.filter(
            (c) => c.group.id === selectedGroupId
        )
        : [];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                const createExamRequest: CreateExamRequest = {
                    title: data.title,
                    courseId: data.courseId ? data.courseId : "",
                    subgroupId: data.subgroupId ? data.subgroupId : "",
                    location: data.location,
                    startDate: new Date(data.startDate).getTime(),
                    endDate: new Date(data.endDate).getTime(),
                    maxPoints: data.maxPoints,
                    type: data.type,
                }
                onSubmit(
                    createExamRequest,
                    data.departmentId ? data.departmentId : "",
                    data.groupId ? data.groupId : "",
                );
            })} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select required
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedDepartmentId(value);
                                        setSelectedGroupId(null);
                                        setSelectedSubgroupId(null);
                                        form.setValue("groupId", undefined);
                                        form.setValue("subgroupId", undefined);
                                        form.setValue("courseId", undefined);
                                    }}
                                    value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department.id} value={department.id}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groupId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select required
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedGroupId(value);
                                        setSelectedSubgroupId(null);
                                        form.setValue("subgroupId", undefined);
                                        form.setValue("courseId", undefined);
                                    }}
                                    value={field.value}
                                    disabled={!selectedDepartmentId}

                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a group"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subgroupId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Subgroup</FormLabel>
                            <Select required
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedSubgroupId(value);
                                        form.setValue("courseId", undefined);
                                    }}
                                    value={field.value}
                                    disabled={!selectedGroupId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subgroup"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredSubgroups.map((subgroup) => (
                                        <SelectItem key={subgroup.id} value={subgroup.id}>
                                            {subgroup.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="courseId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course</FormLabel>
                            <Select required
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!selectedSubgroupId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a course"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredCourses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input required type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input required type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="maxPoints"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Max Points</FormLabel>
                            <FormControl>
                                <Input required type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select required onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(ExamType).map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Create Exam</Button>
            </form>
        </Form>
    );
}
