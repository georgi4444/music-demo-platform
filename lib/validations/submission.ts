import { z } from "zod";

export const artistInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  instagram: z.url().optional().or(z.literal("")),
  soundcloud: z.url().optional().or(z.literal("")),
  spotify: z.url().optional().or(z.literal("")),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
});

export const trackMetadataSchema = z.object({
  title: z.string().min(1, "Track title is required").trim(),
  genre: z.string().optional(),
  bpm: z.number().int().min(1).max(300).optional(),
  key: z.string().optional(),
  description: z.string().max(500).optional(),
});

export const uploadedTrackSchema = z
  .object({
    publicId: z.string().min(1, "Track public ID is required"),
    secureUrl: z.url("Invalid track URL"),
    streamUrl: z.url("Invalid stream URL").optional(),
    format: z.string().min(1, "Track format is required"),
    bytes: z.number().positive("Invalid file size"),
    duration: z.number().positive().optional(),
  })
  .merge(trackMetadataSchema);

export const submissionSchema = artistInfoSchema.extend({
  tracks: z
    .array(uploadedTrackSchema)
    .min(1, "Please upload at least one track"),
});

export type ArtistInfoInput = z.infer<typeof artistInfoSchema>;
export type TrackMetadataInput = z.infer<typeof trackMetadataSchema>;
export type UploadedTrackInput = z.infer<typeof uploadedTrackSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
