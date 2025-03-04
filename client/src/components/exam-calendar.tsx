import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {ExamResponse} from "@shared/response-models.ts";
import {useEffect, useState} from "react";

interface ExamCalendarProps {
  getExams: () => Promise<ExamResponse[]>;
  reset: boolean;
}

export function ExamCalendar({ getExams, reset }: ExamCalendarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<ExamResponse[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const exams = await getExams();
        setExams(exams);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [reset]);

  if (isLoading) return <div>Loading ... </div>;


  const examDates = exams.reduce((acc, exam) => {
    const date = format(new Date(exam.startDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {} as Record<string, ExamResponse[]>);

  const now = new Date();
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
                upcomingExam: (date) => {
                  if (date > now) {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    return !!examDates[formattedDate];
                  }
                  return false;
                },
                pastExam: (date) => {
                  if (date < now) {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    return !!examDates[formattedDate];
                  }
                  return false;
                },
                now: (date) => {
                  return format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
                }
              }}
              modifiersStyles={{
                upcomingExam: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "white",
                },
                pastExam: {
                  backgroundColor: "grey",
                  color: "white",
                },
                now: {
                  borderColor: "black",
                  borderWidth: 1,
                }
              }}
            />
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
              {Object.entries(examDates).filter(([date]) => {
                  return date >= format(now, "yyyy-MM-dd");
                }).map(([date, exams]) => (
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
