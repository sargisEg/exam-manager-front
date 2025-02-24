
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
import { ExamType } from "@shared/schema";
import * as testData from "@shared/test-data";
import { useState } from "react";

export function ExamForm({ onSubmit }) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      maxPoints: "",
      type: ExamType.GENERAL,
      groupId: "",
      subgroupId: "",
      courseId: "",
    },
  });

  const filteredSubgroups = selectedGroupId
    ? Object.values(testData.TEST_SUBGROUPS).filter(
        (sg) => sg.groupId === selectedGroupId
      )
    : [];

  const filteredCourses = selectedGroupId
    ? Object.values(testData.TEST_COURSES).filter(
        (c) => c.groupId === selectedGroupId
      )
    : [];

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedGroupId(value);
                  setSelectedSubgroupId(null);
                  form.setValue("subgroupId", "");
                  form.setValue("courseId", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(testData.TEST_GROUPS).map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
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
          name="subgroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subgroup</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedSubgroupId(value);
                  form.setValue("courseId", "");
                }}
                value={field.value}
                disabled={!selectedGroupId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subgroup" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedSubgroupId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Points</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ExamType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Exam</Button>
      </form>
    </Form>
  );
}
