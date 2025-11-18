/**
 * Submission Details Dialog
 * Dialog component for viewing detailed submission information
 */

"use client";

import { Instagram, Mail, Music, Phone } from "lucide-react";
import type { SubmissionListItem } from "@/app/api/submissions/types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { $Enums } from "@/lib/generated/prisma/client";

interface SubmissionDetailsDialogProps {
  submission: SubmissionListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<$Enums.SubmissionStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  IN_REVIEW: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  APPROVED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export function SubmissionDetailsDialog({
  submission,
  open,
  onOpenChange,
}: SubmissionDetailsDialogProps) {
  const { artist, tracks, status, submittedAt } = submission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{artist.name}</DialogTitle>
              <DialogDescription>
                Submitted on{" "}
                {new Date(submittedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={statusColors[status]}>
              {status.replace("_", " ")}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Artist Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Artist Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${artist.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {artist.email}
                </a>
              </div>
              {artist.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${artist.phone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {artist.phone}
                  </a>
                </div>
              )}
              {artist.instagram && (
                <div className="flex items-center gap-2 text-sm">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram
                  </a>
                </div>
              )}
              {artist.bio && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Bio:</p>
                  <p className="text-sm mt-1">{artist.bio}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tracks */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Tracks ({tracks.length})
            </h3>
            <div className="space-y-4">
              {tracks.map((track) => (
                <div key={track.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {track.genre && <span>{track.genre}</span>}
                          {track.bpm && (
                            <>
                              <span>•</span>
                              <span>{track.bpm} BPM</span>
                            </>
                          )}
                          {track.key && (
                            <>
                              <span>•</span>
                              <span>{track.key}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {track.description && (
                    <p className="text-sm text-muted-foreground">
                      {track.description}
                    </p>
                  )}

                  {track.streamUrl && (
                    <audio
                      controls
                      className="w-full mt-2"
                      src={track.streamUrl}
                      preload="metadata"
                      aria-label={`Audio player for ${track.title}`}
                    >
                      <track kind="captions" />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{track.fileType?.toUpperCase()}</span>
                    {track.fileSize && (
                      <span>
                        {(track.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                    {track.duration && (
                      <span>
                        {Math.floor(track.duration / 60)}:
                        {String(track.duration % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {submission.reviews && submission.reviews.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Reviews</h3>
                <div className="space-y-3">
                  {submission.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.reviewer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.reviewedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {review.grade && (
                          <Badge variant="outline">{review.grade}/10</Badge>
                        )}
                      </div>
                      {review.feedback && (
                        <p className="text-sm mt-2">{review.feedback}</p>
                      )}
                      {review.internalNotes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Internal: {review.internalNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
