"use client";

import { Upload } from "lucide-react";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { UPLOAD_CONFIG } from "@/lib/cloudinary-config";
import type { CloudinaryFileAdded } from "@/types/cloudinary";

interface UploadWidgetProps {
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
  onQueuesStart?: () => void;
  onQueuesEnd?: () => void;
  onUploadAdded?: (info: CloudinaryFileAdded) => void;
  disabled?: boolean;
}

// Cloudinary widget theme matching our design system (globals.css)
const WIDGET_THEME = {
  palette: {
    window: "#161616", // --color-surface
    windowBorder: "#3F3F46", // --color-border-emphasis
    tabIcon: "#8B5CF6", // --color-primary
    menuIcons: "#8B5CF6", // --color-primary
    textDark: "#FFFFFF", // --color-text-primary
    textLight: "#FFFFFF", // --color-text-primary
    link: "#8B5CF6", // --color-primary
    action: "#8B5CF6", // --color-primary
    inactiveTabIcon: "#71717A", // --color-text-tertiary
    error: "#EF4444", // --color-error
    inProgress: "#8B5CF6", // --color-primary
    complete: "#10B981", // --color-success
    sourceBg: "#1F1F1F", // --color-surface-elevated
  },
  frame: {
    background: "rgba(10, 10, 10, 0.85)", // --color-background with opacity
  },
} as const;

export function UploadWidget({
  onUploadSuccess,
  onQueuesStart,
  onQueuesEnd,
  onUploadAdded,
  disabled,
}: UploadWidgetProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign-upload"
      uploadPreset={UPLOAD_CONFIG.presetName}
      options={{
        clientAllowedFormats: [...UPLOAD_CONFIG.allowedFormats],
        maxFileSize: UPLOAD_CONFIG.maxFileSize,
        tags: [UPLOAD_CONFIG.tag],
        folder: UPLOAD_CONFIG.folder,
        resourceType: UPLOAD_CONFIG.resourceType,
        multiple: false, // Allow one file at a time to better control max files
        sources: ["local", "url", "dropbox", "google_drive"],
        styles: WIDGET_THEME,
        autoMinimize: true,
      }}
      onSuccess={(result) => {
        onUploadSuccess(result);
      }}
      onQueuesStart={() => {
        onQueuesStart?.();
      }}
      onQueuesEnd={() => {
        onQueuesEnd?.();
      }}
      onUploadAdded={(result) => {
        if (result.info && typeof result.info !== "string") {
          onUploadAdded?.(result.info as unknown as CloudinaryFileAdded);
        }
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
          disabled={disabled}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Tracks (
          {UPLOAD_CONFIG.allowedFormats.map((f) => f.toUpperCase()).join(", ")})
        </Button>
      )}
    </CldUploadWidget>
  );
}
