/**
 * Cloudinary integration types
 * Types for Cloudinary upload widget interactions and responses
 */

// Extended Cloudinary upload info with all properties we use
export interface CloudinaryUploadResult {
  public_id: string;
  batchId: string;
  id: string;
  secure_url: string;
  format: string;
  bytes: number;
  duration?: number;
  original_filename?: string;
  eager?: Array<{
    secure_url: string;
    transformation: string;
  }>;
}

// File info when added to upload queue
export interface CloudinaryFileAdded {
  file: File;
  batchId: string;
  id: string;
}
