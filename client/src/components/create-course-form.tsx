
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { UserRole } from "@shared/schema";
import * as testData from "@shared/test-data";

export function CreateCourseForm({ onSubmit, departmentId, groupId } : {
  onSubmit: (data: any) => void;
  departmentId: string | undefined;
  groupId: string | undefined;
})  {
  
  const form = useForm({
    defaultValues: {
      name: "",
      teacherId: undefined,
      groupId: groupId,
      departmentId: departmentId,
    },
  });

  const teachers = Object.values(testData.TEST_USERS).filter(
    (user) => user.role === UserRole.TEACHER
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={form.formState.errors.teacherId ? "text-black" : "text-black"}>
                Teacher</FormLabel>
              <Select required onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Input disabled value={Object.values(testData.TEST_DEPARTMENTS).find(d => d.id === field.value)?.name} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Input disabled value={Object.values(testData.TEST_GROUPS).find(g => g.id === field.value)?.name} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Course</Button>
      </form>
    </Form>
  );
}
