import type { UploadedTrack } from "@/types/submission";

/**
 * Serializes track data for API submission
 * Extracts only the necessary fields and removes client-side state
 */
export function serializeTracks(tracks: UploadedTrack[]) {
  return tracks.map(
    ({
      publicId,
      secureUrl,
      streamUrl,
      format,
      bytes,
      duration,
      title,
      genre,
      bpm,
      key,
      description,
    }) => ({
      publicId,
      secureUrl,
      streamUrl,
      format,
      bytes,
      duration,
      title,
      genre,
      bpm,
      key,
      description,
    }),
  );
}
