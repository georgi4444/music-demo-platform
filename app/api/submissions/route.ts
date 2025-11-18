import { NextResponse } from "next/server";
import type { CreateSubmissionResponse } from "@/app/api/submissions/types";
import { confirmTrackUploads } from "@/lib/cloudinary/client";
import { sendSubmissionConfirmationEmail } from "@/lib/email/client";
import prisma from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations/submission";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = submissionSchema.parse(body);
    const { tracks, ...artistInfo } = validatedData;

    const publicIds = tracks.map((track) => track.publicId);

    // Remove 'temp' tag from Cloudinary uploads BEFORE DB transaction
    // If this fails, we stop here and don't save to DB
    // If DB fails later, we have orphaned files (acceptable trade-off)
    // We can have a cleanup job for orphaned files if needed
    await confirmTrackUploads(publicIds);

    // Create artist, submission, and tracks in a transaction
    const submission = await prisma.$transaction(async (tx) => {
      // Check if artist exists by email
      let artist = await tx.artist.findUnique({
        where: { email: artistInfo.email },
      });

      // Create or update artist
      if (!artist) {
        artist = await tx.artist.create({
          data: artistInfo,
        });
      } else {
        // Update existing artist info
        artist = await tx.artist.update({
          where: { id: artist.id },
          data: artistInfo,
        });
      }

      // Create submission with tracks
      const newSubmission = await tx.submission.create({
        data: {
          artistId: artist.id,
          status: "PENDING",
          tracks: {
            create: tracks.map((track) => ({
              title: track.title,
              genre: track.genre,
              bpm: track.bpm,
              key: track.key,
              description: track.description,
              fileUrl: track.secureUrl,
              streamUrl: track.streamUrl,
              publicId: track.publicId,
              fileType: `audio/${track.format}`,
              fileSize: track.bytes,
              duration: track.duration,
            })),
          },
        },
        include: {
          tracks: true,
          artist: true,
        },
      });

      return newSubmission;
    });

    // Send confirmation email (don't await - let it happen async)
    sendSubmissionConfirmationEmail(submission).catch((error) => {
      console.error("Email send failed (non-blocking):", error);
    });

    return NextResponse.json<CreateSubmissionResponse>({
      success: true,
      submissionId: submission.id,
      message: "Submission received successfully",
    });
  } catch (error) {
    console.error("Submission error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid submission data", details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
