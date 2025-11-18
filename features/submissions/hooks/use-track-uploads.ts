import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useState } from "react";
import type { UploadedTrack } from "@/features/submissions/types";
import type {
  CloudinaryFileAdded,
  CloudinaryUploadResult,
} from "@/types/cloudinary";

/**
 * Hook for managing track uploads with Cloudinary
 * Handles upload state, queue management, and track CRUD operations
 */
export function useTrackUploads() {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Simple event handlers - no need for useCallback as they're not passed to memoized components
  const handleQueuesStart = () => {
    setIsUploading(true);
    setUploadError(null);
  };

  const handleQueuesEnd = () => {
    setIsUploading(false);
  };

  const handleUploadAdded = (info: CloudinaryFileAdded) => {
    // Add track to UI immediately with temporary ID
    const tempId = `${info.batchId}-${info.id}`;
    const tempTrack: UploadedTrack = {
      publicId: tempId,
      secureUrl: "",
      format: info.file.name.split(".").pop() || "unknown",
      bytes: info.file.size,
      duration: undefined,
      originalFilename: info.file.name.split(".")[0],
      isUploading: true,
      title: "",
    };
    setTracks((prev) => [...prev, tempTrack]);
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info;
    if (!info || typeof info === "string") return;

    const upload = info as CloudinaryUploadResult;
    const tempId = `${upload.batchId}-${upload.id}`;
    const streamUrl = upload.eager?.[0]?.secure_url;

    setTracks((prev) =>
      prev.map((track) =>
        track.publicId === tempId && track.isUploading
          ? {
              ...track,
              publicId: upload.public_id,
              secureUrl: upload.secure_url,
              streamUrl,
              format: upload.format,
              bytes: upload.bytes,
              duration: upload.duration,
              isUploading: false,
            }
          : track,
      ),
    );
  };

  const updateTrack = (index: number, updates: Partial<UploadedTrack>) => {
    setTracks((prev) =>
      prev.map((track, i) => (i === index ? { ...track, ...updates } : track)),
    );
  };

  const removeTrack = (index: number) => {
    setTracks((prev) => {
      // const trackToRemove = prev[index];
      // Cloudinary will delete files with temp tag after 24 hours
      // Optionally, handle deletion from Cloudinary explicitly here using trackToRemove.publicId
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetTracks = () => {
    setTracks([]);
    setUploadError(null);
  };

  return {
    tracks,
    isUploading,
    uploadError,
    handleQueuesStart,
    handleQueuesEnd,
    handleUploadAdded,
    handleUploadSuccess,
    updateTrack,
    removeTrack,
    resetTracks,
  };
}
