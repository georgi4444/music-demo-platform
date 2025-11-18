/**
 * Submissions API Types
 * Type definitions for the submissions API endpoints
 * Shared between server (route handlers) and client (API client)
 */

import type { $Enums, Prisma } from "@/lib/generated/prisma/client";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Submission list item type
 * Matches the shape returned by GET /api/submissions
 */
export type SubmissionListItem = Prisma.SubmissionGetPayload<{
  include: {
    artist: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
        instagram: true;
        soundcloud: true;
        spotify: true;
        bio: true;
      };
    };
    tracks: {
      select: {
        id: true;
        title: true;
        genre: true;
        bpm: true;
        key: true;
        description: true;
        fileUrl: true;
        streamUrl: true;
        publicId: true;
        fileType: true;
        fileSize: true;
        duration: true;
        createdAt: true;
      };
    };
    reviews: {
      select: {
        id: true;
        grade: true;
        internalNotes: true;
        feedback: true;
        reviewedAt: true;
        reviewer: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
  };
}>;

/**
 * Response for GET /api/submissions
 */
export interface SubmissionListResponse {
  success: boolean;
  data: SubmissionListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    status?: string | null;
    artistName?: string | null;
    genre?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    search?: string | null;
  };
  sorting: {
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

/**
 * Query parameters for GET /api/submissions
 */
export interface SubmissionListParams {
  page?: number;
  pageSize?: number;
  status?: $Enums.SubmissionStatus;
  artistName?: string;
  genre?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: "submittedAt" | "status" | "artistName";
  sortOrder?: "asc" | "desc";
}

/**
 * Response for POST /api/submissions
 */
export interface CreateSubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
}

/**
 * Response for PATCH /api/submissions/[id]/status
 */
export interface UpdateSubmissionStatusResponse {
  success: boolean;
  message: string;
}

/**
 * Request body for PATCH /api/submissions/[id]/status
 */
export interface UpdateSubmissionStatusRequest {
  status: $Enums.SubmissionStatus;
}
