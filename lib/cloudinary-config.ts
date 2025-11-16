/**
 * Cloudinary upload configuration
 * This file can be safely imported in client components
 */
export const UPLOAD_CONFIG = {
  presetName: "music_demo",
  allowedFormats: ["mp3", "wav", "flac", "m4a"] as const,
  maxFileSize: 100000000, // 100MB in bytes
  maxFiles: 3,
  folder: "music-demos",
  tag: "temp",
  resourceType: "video", // Cloudinary stores audio as 'video' type
} as const;
