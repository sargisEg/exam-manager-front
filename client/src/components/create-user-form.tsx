
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

export function CreateUserForm({ onSubmit, departmentId, groupId, subgroupId } : {
  onSubmit: (data: any) => void;
  departmentId: string | undefined;
  groupId: string | undefined;
  subgroupId: string | undefined;
})  {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      groupId: groupId,
      subgroupId: subgroupId,
      departmentId: departmentId,
    },
  });

  const subgroups = Object.values(testData.TEST_SUBGROUPS).filter(
    (subgroup) => subgroup.groupId === groupId
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input required type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input required type="tel" {...field} />
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
        
        {subgroupId ? 
          <FormField
          control={form.control}
          name="subgroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subgroup</FormLabel>
              <Input disabled value={Object.values(testData.TEST_SUBGROUPS).find(sg => sg.id === field.value)?.name} />
              <FormMessage />
            </FormItem>
          )}
        /> : 
        <FormField
          control={form.control}
          name="subgroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={form.formState.errors.subgroupId ? "text-black" : "text-black"}>
              Subgroup</FormLabel>
              <Select required onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subgroup" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subgroups.map((subgroup) => (
                    <SelectItem key={subgroup.id} value={subgroup.id}>
                      {subgroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        }
        
        <Button type="submit" className="w-full">Create Teacher</Button>
      </form>
    </Form>
  );
}
