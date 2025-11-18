"use client";

import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Error message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Oops!</h1>
          <p className="text-xl text-muted-foreground">
            Something went off-key 🎵
          </p>
        </div>

        {/* Error details */}
        <Alert variant="destructive">
          <AlertDescription>
            <p className="text-sm font-medium mb-2">Error Details:</p>
            <p className="text-sm opacity-90">
              {error.message ||
                "An unexpected error occurred while processing your request."}
            </p>
            {error.digest && (
              <p className="text-xs opacity-75 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </AlertDescription>
        </Alert>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full" size="lg">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </Button>

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Back Home
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground">
          If this problem persists, please contact support
        </p>
      </div>
    </div>
  );
}
