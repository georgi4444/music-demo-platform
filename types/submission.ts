/**
 * Submission domain types
 * Types related to music demo submissions and track uploads
 */

export interface UploadedTrack {
  // Cloudinary data
  publicId: string;
  secureUrl: string;
  streamUrl?: string; // MP3 version from eager transform
  format: string;
  bytes: number;
  duration?: number; // Extracted by Cloudinary
  originalFilename?: string; // Original file name from upload

  // Upload state
  isUploading?: boolean; // True while upload is in progress

  // User-provided metadata
  title: string;
  genre?: string;
  bpm?: number;
  key?: string;
  description?: string;
}
