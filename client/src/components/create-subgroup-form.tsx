
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
import * as testData from "@shared/test-data";

export function CreateSubgroupForm({ onSubmit, departmentId, groupId } : {
  onSubmit: (data: any) => void;
  departmentId: string | undefined;
  groupId: string | undefined;
})  {
  const form = useForm({
    defaultValues: {
      name: "",
      departmentId: departmentId,
      groupId: groupId,
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

        <Button type="submit" className="w-full">Create Subgroup</Button>
      </form>
    </Form>
  );
}
