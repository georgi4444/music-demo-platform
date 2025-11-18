import { useState, useTransition } from "react";
import { z } from "zod";
import { createSubmission } from "@/features/submissions/api/client";
import type { UploadedTrack } from "@/features/submissions/types";
import { serializeTracks } from "@/features/submissions/utils/serialization";
import {
  type ArtistInfoInput,
  submissionSchema,
} from "@/lib/validations/submission";

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

        // Use the API client instead of direct fetch
        await createSubmission(validatedData);
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
