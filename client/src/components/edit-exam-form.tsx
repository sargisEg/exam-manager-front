import {useForm} from "react-hook-form";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel} from "./ui/form";
import {ExamResponse} from "@shared/response-models.ts";
import {EditExamRequest} from "@shared/request-models.ts";

interface EditExamFormProps {
    exam: ExamResponse;
    onSubmit: (examId: string, data: EditExamRequest) => void;
}

export function EditExamForm({exam, onSubmit}: EditExamFormProps) {
    const form = useForm({
        defaultValues: {
            title: exam.title,
            startDate: new Date(exam.startDate).getTime(),
            endDate: new Date(exam.endDate).getTime(),
            location: exam.location,
            maxPoints: exam.maxPoints,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                const editExamRequest: EditExamRequest = {
                    title: data.title,
                    location: data.location,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    maxPoints: data.maxPoints,
                }
                onSubmit(exam.id, editExamRequest);
            })} className="space-y-4">

                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
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
                                <Input type="datetime-local" {...field} />
                            </FormControl>
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
                                <Input type="datetime-local" {...field} />
                            </FormControl>
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
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maxPoints"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Maximum Points</FormLabel>
                            <FormControl>
                                <Input type="number" {...field}
                                       onChange={e => field.onChange(parseInt(e.target.value))}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </Form>
    );
}
