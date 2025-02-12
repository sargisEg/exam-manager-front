
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "./button";

export function BackButton() {
  const [, navigate] = useLocation();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate(-1)}
      className="mb-4"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  );
}
