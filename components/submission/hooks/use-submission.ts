import { useState, useTransition } from "react";
import { z } from "zod";
import { serializeTracks } from "@/components/submission/utils/serialization";
import {
  type ArtistInfoInput,
  submissionSchema,
} from "@/lib/validations/submission";
import type { UploadedTrack } from "@/types/submission";

interface UseSubmissionProps {
  tracks: UploadedTrack[];
  isUploading: boolean;
}

/**
 * Hook for managing demo submission flow
 * Uses React's useTransition for better async state handling
 */
export function useSubmission({ tracks, isUploading }: UseSubmissionProps) {
  const [isPending, startTransition] = useTransition();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = tracks.length > 0 && !isPending && !isUploading;

  const submitDemo = async (artistData: ArtistInfoInput) => {
    setSubmitError(null);

    // Use startTransition for better React concurrent features support
    startTransition(async () => {
      try {
        // Validate entire submission with Zod schema
        const validatedData = submissionSchema.parse({
          ...artistData,
          tracks: serializeTracks(tracks),
        });

        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Submission failed");
        }

        const data = await response.json();
        setSubmitSuccess(true);
      } catch (error) {
        console.error("Submission error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
          // Get the first validation error message
          const firstError = error.issues[0];
          if (firstError) {
            setSubmitError(firstError.message);
          } else {
            setSubmitError("Validation failed. Please check your input.");
          }
        } else if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Failed to submit. Please try again.");
        }
      }
    });
  };

  const resetSubmission = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  return {
    isSubmitting: isPending,
    submitSuccess,
    submitError,
    canSubmit,
    submitDemo,
    resetSubmission,
  };
}
