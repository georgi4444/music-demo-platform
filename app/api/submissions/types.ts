/**
 * Submissions API Types
 * Type definitions for the submissions API endpoints
 * Shared between server (route handlers) and client (API client)
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Response for POST /api/submissions
 */
export interface CreateSubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
}
