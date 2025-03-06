import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import {ExamResponse, ExamStatus} from "@shared/response-models.ts";
import {useEffect, useState} from "react";

interface NotGradedExamsProps {
  getExams: () => Promise<ExamResponse[]>;
  reset: boolean;
}

export function NotGradedExams({ getExams, reset }: NotGradedExamsProps) {
  const [, navigate] = useLocation();
  const [exams, setExams] = useState<ExamResponse[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const exams = await getExams();
        setExams(exams);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
      }
    };
    loadData();
  }, [reset]);

  if (exams && exams.some(e => e.status === ExamStatus.FINISHED && !e.isGraded)) {
    return (
        <Card className="cursor-pointer hover:bg-accent border-red-600" onClick={() => navigate('/ungraded-exams')}>
          <CardHeader>
            <CardTitle>Not Graded Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Click to view and grade finished exams
            </div>
          </CardContent>
        </Card>
    );
  }
  return null;
}
