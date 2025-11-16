import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { UPLOAD_CONFIG } from "@/lib/cloudinary-config";

config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function createIncomingAudioPreset() {
  try {
    // Delete existing preset if it exists
    try {
      const deletedPreset = await cloudinary.api.delete_upload_preset(
        UPLOAD_CONFIG.presetName,
      );
      console.log("Deleted existing preset:", deletedPreset);
    } catch (deleteErr) {
      const error = deleteErr as {
        error?: { http_code?: number; message?: string };
      };
      if (error?.error?.http_code !== 404) {
        console.error(
          "Error deleting preset:",
          error?.error?.message || deleteErr,
        );
      } else {
        console.log("Preset doesn't exist yet, creating new one...");
      }
    }

    const res = await cloudinary.api.create_upload_preset({
      name: UPLOAD_CONFIG.presetName,
      unsigned: false,
      folder: UPLOAD_CONFIG.folder,
      resource_type: UPLOAD_CONFIG.resourceType,
      allowed_formats: UPLOAD_CONFIG.allowedFormats,
      eager: [
        {
          format: "mp3",
          audio_codec: "mp3",
          bit_rate: "128k",
        },
      ],
      media_metadata: true,
      tags: [UPLOAD_CONFIG.tag],
    });
    return res;
  } catch (err) {
    console.error("Error creating upload preset:", err);
    throw err;
  }
}

(async () => {
  try {
    const res = await createIncomingAudioPreset();
    console.log("Created upload preset:", res);
  } catch (err) {
    console.error("Failed to create upload preset:", err);
  }
})();
