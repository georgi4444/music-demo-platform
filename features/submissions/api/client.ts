/**
 * Submissions API Client for Artists
 * Client-side functions for interacting with submissions API
 */

import type { CreateSubmissionResponse } from "@/app/api/submissions/types";
import type { SubmissionInput } from "@/lib/validations/submission";

/**
 * Create a new submission
 */
export async function createSubmission(
  data: SubmissionInput,
): Promise<CreateSubmissionResponse> {
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create submission: ${response.statusText}`);
  }

  return response.json();
}
