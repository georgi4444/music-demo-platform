import { NextResponse } from "next/server";
import type {
  CreateSubmissionResponse,
  SubmissionListParams,
} from "@/app/api/submissions/types";
import { getSubmissionsList } from "@/features/admin/services/submissions-service";
import { requireAuth } from "@/lib/auth/session";
import { confirmTrackUploads } from "@/lib/cloudinary/client";
import { sendSubmissionConfirmationEmail } from "@/lib/email/client";
import type { SubmissionStatus } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { triggerNewSubmission } from "@/lib/pusher/server";
import { submissionSchema } from "@/lib/validations/submission";

/**
 * GET /api/submissions
 * List all submissions with filtering, searching, sorting, and pagination
 * Admin only - requires authentication
 */
export async function GET(request: Request) {
  try {
    // Require authentication for admin access
    await requireAuth();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: SubmissionListParams = {
      page: Number.parseInt(searchParams.get("page") || "1", 10),
      pageSize: Number.parseInt(searchParams.get("pageSize") || "10", 10),
      status: searchParams.get("status") as SubmissionStatus | undefined,
      artistName: searchParams.get("artistName") || undefined,
      genre: searchParams.get("genre") || undefined,
      fromDate: searchParams.get("fromDate") || undefined,
      toDate: searchParams.get("toDate") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") || "submittedAt") as
        | "submittedAt"
        | "status"
        | "artistName",
      sortOrder: (searchParams.get("sortOrder") || "desc") as "asc" | "desc",
    };

    // Use service to get submissions
    const response = await getSubmissionsList(params);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get submissions error:", error);

    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

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

    // Trigger Pusher event for real-time notification (don't await)
    triggerNewSubmission(submission.id).catch((error) => {
      console.error("Pusher event failed (non-blocking):", error);
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
