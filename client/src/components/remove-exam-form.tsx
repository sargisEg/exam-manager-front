
import {useForm} from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import {ExamResponse} from "@shared/response-models.ts";

interface RemoveExamFormProps {
  exam: ExamResponse;
  onSubmit: (data: string) => void;
}

export function RemoveExamForm({ exam, onSubmit }: RemoveExamFormProps) {
  const form = useForm({
    defaultValues: {
      examName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
          if (data.examName === exam.title) {
              onSubmit(exam.id);
          }
      })} className="space-y-4">
        <FormField
          control={form.control}
          name="examName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please enter exam name in order to remove it.</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Delete Exam</Button>
      </form>
    </Form>
  );
}
