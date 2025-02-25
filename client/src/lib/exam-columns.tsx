
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Exam } from "@shared/schema";
import { format, addDays, isBefore } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

export function createExamColumns(
  onEdit: (exam: Exam) => void,
  onRemove: (exam: Exam) => void,
): ColumnDef<Exam>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "maxPoints",
      header: "Max Points",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const exam = row.original;
        const tomorrow = addDays(new Date(), 1);
        const showActions = exam.status === "UPCOMING" && isBefore(tomorrow, new Date(exam.startDate));
        
        if (!showActions) return null;
        
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(exam)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(exam)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
