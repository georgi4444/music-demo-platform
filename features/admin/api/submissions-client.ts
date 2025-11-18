/**
 * Submissions API Client for Admin
 * Client-side functions for interacting with submissions API
 */

import type {
  SubmissionListItem,
  SubmissionListParams,
  SubmissionListResponse,
  UpdateSubmissionStatusResponse,
} from "@/app/api/submissions/types";
import type { $Enums } from "@/lib/generated/prisma/client";

/**
 * Build URL search params for submissions API
 */
function buildQueryString(params: SubmissionListParams): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.artistName) searchParams.set("artistName", params.artistName);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  return searchParams.toString();
}

/**
 * Get list of submissions with filtering, sorting, and pagination
 */
export async function getSubmissions(
  params: SubmissionListParams = {},
): Promise<SubmissionListResponse> {
  const queryString = buildQueryString(params);
  const url = `/api/submissions${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch submissions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(id: string): Promise<SubmissionListItem> {
  const response = await fetch(`/api/submissions/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch submission: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
  id: string,
  status: $Enums.SubmissionStatus,
): Promise<UpdateSubmissionStatusResponse> {
  const response = await fetch(`/api/submissions/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update submission: ${response.statusText}`);
  }

  return response.json();
}
