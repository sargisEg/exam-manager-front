import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Exam } from "@shared/schema";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface ExamCalendarProps {
  exams: Record<string, Exam>;
}

export function ExamCalendar({ exams }: ExamCalendarProps) {
  const examDates = Object.values(exams).reduce((acc, exam) => {
    const date = format(new Date(exam.startDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {} as Record<string, Exam[]>);
  const [, navigate] = useLocation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div>
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
            />
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
              {Object.entries(examDates).map(([date, exams]) => (
                <div key={date} className="flex items-center gap-4 mb-1">
                  <Badge className="w-20 h-7">{format(new Date(date), "MMM d")}</Badge>
                  <div className="text-sm">
                    {exams.map((exam) => exam.title).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
