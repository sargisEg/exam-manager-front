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
import {CreateStudentRequest} from "@shared/request-models.ts";
import {DepartmentResponse, GroupResponse, SubgroupResponse} from "@shared/response-models.ts";
import {apiRequest} from "@/lib/queryClient.ts";
import {useEffect, useState} from "react";

export function CreateUserForm({onSubmit, departmentId, groupId, subgroupId}: {
    onSubmit: (data: CreateStudentRequest) => void;
    subgroupId: string | undefined;
    groupId: string | undefined;
    departmentId: string | undefined;
}) {

    const [subgroups, setSubgroups] = useState<SubgroupResponse[]>();
    const [department, setDepartment] = useState<DepartmentResponse>();
    const [group, setGroups] = useState<GroupResponse>();
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            subgroupId: subgroupId,
            groupId: groupId,
            departmentId: departmentId,
        },
    });

    const getSubgroups = async (): Promise<SubgroupResponse[]> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}/subgroups`);
        return await response.json();
    };
    const getGroup = async (): Promise<GroupResponse> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}/groups/${groupId}`);
        return await response.json();
    };
    const getDepartment = async (): Promise<DepartmentResponse> => {
        const response = await apiRequest("GET", `/api/core/v1/departments/${departmentId}`);
        return await response.json();
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setDepartment(await getDepartment());
                setGroups(await getGroup());
                setSubgroups(await getSubgroups());
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };
        fetchData();
    }, []);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                if (!data.subgroupId) {
                    return;
                }
                const createStudentData: CreateStudentRequest = {
                    fullName: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                    subgroupId: data.subgroupId,
                }
                onSubmit(createStudentData);
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
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input required type="email" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input required type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input required type="tel" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={() => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Input disabled value={department?.name}/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="groupId"
                    render={() => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Input disabled value={group?.name}/>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {(subgroupId) ?
                    <FormField
                        control={form.control}
                        name="subgroupId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Subgroup</FormLabel>
                                <Input disabled value={subgroups?.find((s) => s.id === subgroupId)?.name}/>
                                <FormMessage/>
                            </FormItem>
                        )}
                    /> :
                    <FormField
                        control={form.control}
                        name="subgroupId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={form.formState.errors.subgroupId ? "text-black" : "text-black"}>
                                    Subgroup</FormLabel>
                                <Select required onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Subgroup"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subgroups?.map((subgroup) => (
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
                }

                <Button type="submit" className="w-full">Create Teacher</Button>
            </form>
        </Form>
    );
}
