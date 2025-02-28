
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
import {CreateSubgroupRequest} from "@shared/request-models.ts";

export function CreateSubgroupForm({ onSubmit, departmentName, groupName } : {
  onSubmit: (data: CreateSubgroupRequest) => void;
  departmentName: string | undefined;
  groupName: string | undefined;
})  {
  const form = useForm({
    defaultValues: {
      name: "",
      departmentName: departmentName,
      groupName: groupName,
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
          name="departmentName"
          render={() => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Input disabled value={departmentName} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupName"
          render={() => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Input disabled value={groupName} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Subgroup</Button>
      </form>
    </Form>
  );
}
