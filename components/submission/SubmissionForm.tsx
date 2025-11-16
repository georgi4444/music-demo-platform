"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ArtistInformationSection } from "@/components/submission/ArtistInformationSection";
import { useSubmission } from "@/components/submission/hooks/use-submission";
import { useTrackUploads } from "@/components/submission/hooks/use-track-uploads";
import { SubmissionSuccess } from "@/components/submission/SubmissionSuccess";
import { TrackUploadsSection } from "@/components/submission/TrackUploadsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  type ArtistInfoInput,
  artistInfoSchema,
} from "@/lib/validations/submission";

export function SubmissionForm() {
  const {
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
  } = useTrackUploads();

  const {
    isSubmitting,
    submitSuccess,
    submitError,
    canSubmit,
    submitDemo,
    resetSubmission,
  } = useSubmission({ tracks, isUploading });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArtistInfoInput>({
    resolver: zodResolver(artistInfoSchema),
  });

  const handleReset = () => {
    reset();
    resetTracks();
    resetSubmission();
  };

  if (submitSuccess) {
    return <SubmissionSuccess onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit(submitDemo)} className="space-y-8">
      <ArtistInformationSection register={register} errors={errors} />

      <TrackUploadsSection
        tracks={tracks}
        isUploading={isUploading}
        isSubmitting={isSubmitting}
        uploadError={uploadError}
        onUploadSuccess={handleUploadSuccess}
        onQueuesStart={handleQueuesStart}
        onQueuesEnd={handleQueuesEnd}
        onUploadAdded={handleUploadAdded}
        onUpdateTrack={updateTrack}
        onRemoveTrack={removeTrack}
      />

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting Your Demo...
          </>
        ) : (
          "Submit Demo"
        )}
      </Button>
    </form>
  );
}
