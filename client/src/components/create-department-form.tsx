
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

export function CreateDepartmentForm({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      name: "",
      nameShort: "",
      headOfDepartment: "",
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
          name="nameShort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headOfDepartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head of Department</FormLabel>
              <Select required onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select head of department" />
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

        <Button type="submit" className="w-full">Create Department</Button>
      </form>
    </Form>
  );
}
