"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubmissionSuccessProps {
  onReset: () => void;
}

export function SubmissionSuccess({ onReset }: SubmissionSuccessProps) {
  return (
    <Card className="p-8 text-center max-w-2xl mx-auto">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Submission Successful!</h2>
      <p className="text-muted-foreground mb-6">
        Thank you for submitting your demo! Check your email for confirmation.
        Our A&R team will review your tracks and get back to you soon.
      </p>
      <Button onClick={onReset} variant="outline">
        Submit Another Demo
      </Button>
    </Card>
  );
}
