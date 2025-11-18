/**
 * Cloudinary Client & Operations
 * Server-side Cloudinary operations (requires API secret)
 */

import { v2 as cloudinary } from "cloudinary";
import { UPLOAD_CONFIG } from "@/lib/cloudinary/config";

// Configure Cloudinary client
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Removes the 'temp' tag from submitted tracks
 * This ensures they won't be auto-deleted by Cloudinary's cleanup policy
 *
 * @throws Error if tag removal fails
 */
export async function confirmTrackUploads(publicIds: string[]): Promise<void> {
  await Promise.all(
    publicIds.map((publicId) =>
      cloudinary.uploader.remove_tag(UPLOAD_CONFIG.tag, [publicId], {
        resource_type: UPLOAD_CONFIG.resourceType,
      }),
    ),
  );
}
