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
import {CreateCourseRequest} from "@shared/request-models.ts";
import {useEffect, useState} from "react";
import {UserResponse} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";

export function CreateCourseForm({onSubmit, departmentName, groupName}: {
    onSubmit: (data: CreateCourseRequest) => void;
    departmentName: string | undefined;
    groupName: string | undefined;
}) {

    const [teachers, setTeachers] = useState<UserResponse[]>();

    const form = useForm({
        defaultValues: {
            name: "",
            teacherId: undefined,
            groupName: groupName,
            departmentName: departmentName,
        },
    });
    const getTeachers = async (): Promise<UserResponse[]> => {
        const response = await apiRequest("GET", `/api/core/v1/teachers`);
        return await response.json();
    };

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                setTeachers(await getTeachers());
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        fetchDepartment();
    }, []);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                if (!data.teacherId) {
                    console.error("Department ID is required");
                    return;
                }
                const createCourseData: CreateCourseRequest = {
                    name: data.name,
                    teacherId: data.teacherId,
                }
                onSubmit(createCourseData);
            })} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="teacherId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={form.formState.errors.teacherId ? "text-black" : "text-black"}>
                                Teacher</FormLabel>
                            <Select required onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select teacher"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {teachers?.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.fullName}
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
                    name="departmentName"
                    render={() => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Input disabled value={departmentName}/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groupName"
                    render={() => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Input disabled value={groupName}/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Create Course</Button>
            </form>
        </Form>
    );
}
