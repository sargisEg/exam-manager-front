import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Exam } from "@shared/schema";
import { format } from "date-fns";

interface ExamCalendarProps {
  exams: Exam[];
}

export function ExamCalendar({ exams }: ExamCalendarProps) {
  const examDates = exams.reduce((acc, exam) => {
    const date = format(new Date(exam.startDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {} as Record<string, Exam[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          modifiers={{
            hasExam: (date) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              return !!examDates[formattedDate];
            },
          }}
          modifiersStyles={{
            hasExam: {
              backgroundColor: "hsl(var(--primary))",
              color: "white",
            },
          }}
          footer={
            <div className="mt-4 space-y-2">
              {Object.entries(examDates).map(([date, exams]) => (
                <div key={date} className="flex items-center gap-2">
                  <Badge>{format(new Date(date), "MMM d")}</Badge>
                  <div className="text-sm">
                    {exams.map((exam) => exam.title).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
