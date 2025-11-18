"use client";

import { CheckCircle, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UploadedTrack } from "@/features/submissions/types";

interface TrackUploadCardProps {
  track: UploadedTrack;
  index: number;
  onUpdate: (index: number, updates: Partial<UploadedTrack>) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function TrackUploadCard({
  track,
  index,
  onUpdate,
  onRemove,
  disabled,
}: TrackUploadCardProps) {
  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        {/* Upload Status */}
        <div className="flex items-center gap-3 pr-8">
          {track.isUploading ? (
            <div className="relative">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium truncate">
                {track.originalFilename || "Uploaded file"}
              </p>
              {track.isUploading && (
                <span className="text-xs text-primary font-medium">
                  Uploading...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {track.format.toUpperCase()} • {formatFileSize(track.bytes)}
              {!track.isUploading && track.duration && (
                <> • {formatDuration(track.duration)}</>
              )}
            </p>
          </div>
        </div>

        {/* Track Metadata Form */}
        <div className="grid gap-3 pt-2 border-t">
          <div className="space-y-2">
            <Label htmlFor={`track-${index}-title`}>
              Track Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`track-${index}-title`}
              value={track.title}
              onChange={(e) => onUpdate(index, { title: e.target.value })}
              placeholder={
                track.isUploading
                  ? "You can start filling this in while uploading..."
                  : "Enter track title"
              }
              disabled={disabled}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`track-${index}-genre`}>Genre</Label>
              <Input
                id={`track-${index}-genre`}
                value={track.genre || ""}
                onChange={(e) => onUpdate(index, { genre: e.target.value })}
                placeholder="e.g., Electronic"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`track-${index}-bpm`}>BPM</Label>
              <Input
                id={`track-${index}-bpm`}
                type="number"
                min="1"
                max="300"
                value={track.bpm || ""}
                onChange={(e) =>
                  onUpdate(index, {
                    bpm: Number.parseInt(e.target.value, 10) || undefined,
                  })
                }
                placeholder="120"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`track-${index}-key`}>Key</Label>
            <Input
              id={`track-${index}-key`}
              value={track.key || ""}
              onChange={(e) => onUpdate(index, { key: e.target.value })}
              placeholder="e.g., C minor"
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`track-${index}-description`}>Description</Label>
            <Input
              id={`track-${index}-description`}
              value={track.description || ""}
              onChange={(e) => onUpdate(index, { description: e.target.value })}
              placeholder="Brief description of the track"
              disabled={disabled}
              maxLength={500}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
