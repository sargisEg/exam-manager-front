
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
import { Input } from "@/components/ui/input";
import * as testData from "@shared/test-data";

export function CreateGroupForm({ onSubmit, departmentId } : {
  onSubmit: (data: any) => void;
  departmentId: string | undefined;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
      departmentId: departmentId,
    },
  });

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
          name="startYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Year</FormLabel>
              <FormControl>
                <Input 
                  required 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Year</FormLabel>
              <FormControl>
                <Input 
                  required 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
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

        <Button type="submit" className="w-full">Create Group</Button>
      </form>
    </Form>
  );
}
