"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { TrackUploadCard } from "@/components/submission/TrackUploadCard";
import { UploadWidget } from "@/components/submission/UploadWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { UPLOAD_CONFIG } from "@/lib/cloudinary-config";
import type { CloudinaryFileAdded } from "@/types/cloudinary";
import type { UploadedTrack } from "@/types/submission";

interface TrackUploadsSectionProps {
  tracks: UploadedTrack[];
  isUploading: boolean;
  isSubmitting: boolean;
  uploadError: string | null;
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
  onQueuesStart: () => void;
  onQueuesEnd: () => void;
  onUploadAdded: (info: CloudinaryFileAdded) => void;
  onUpdateTrack: (index: number, updates: Partial<UploadedTrack>) => void;
  onRemoveTrack: (index: number) => void;
}

export function TrackUploadsSection({
  tracks,
  isUploading,
  isSubmitting,
  uploadError,
  onUploadSuccess,
  onQueuesStart,
  onQueuesEnd,
  onUploadAdded,
  onUpdateTrack,
  onRemoveTrack,
}: TrackUploadsSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-2">Your Tracks</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Upload your demo tracks. You can fill in their details while they're
        uploading.
      </p>

      <div className="space-y-4">
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <UploadWidget
          onUploadSuccess={onUploadSuccess}
          onQueuesStart={onQueuesStart}
          onQueuesEnd={onQueuesEnd}
          onUploadAdded={onUploadAdded}
          disabled={
            isSubmitting ||
            isUploading ||
            tracks.length >= UPLOAD_CONFIG.maxFiles
          }
        />

        {isUploading && (
          <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <p className="text-sm text-muted-foreground">
              Upload in progress... You can fill in track details below while
              waiting.
            </p>
          </div>
        )}

        {tracks.length === 0 && !isUploading && (
          <p className="text-sm text-center text-muted-foreground py-2">
            Please upload at least one track to submit your demo
          </p>
        )}

        {tracks.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-sm font-medium">
              {tracks.length} track{tracks.length !== 1 ? "s" : ""} uploaded
            </p>
            {tracks.map((track, index) => (
              <TrackUploadCard
                key={track.publicId}
                track={track}
                index={index}
                onUpdate={onUpdateTrack}
                onRemove={onRemoveTrack}
                disabled={isSubmitting}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
