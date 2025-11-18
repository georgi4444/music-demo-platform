import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* Animated 404 with vinyl record */}
        <div className="relative inline-block">
          <div className="text-[120px] font-bold leading-none bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </div>

          {/* Spinning vinyl record */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 animate-spin-slow flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-background" />
            </div>
          </div>
        </div>

        {/* Creative messages */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            This Track Doesn't Exist
          </h1>
          <p className="text-lg text-muted-foreground">
            Looks like this page hit a wrong note 🎵
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The page you're looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Main action button */}
        <div className="pt-4">
          <Button
            asChild
            size="lg"
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Homepage
            </Link>
          </Button>
        </div>

        {/* Easter egg */}
        <p className="text-xs text-muted-foreground/60 italic">
          "In music, there are no wrong notes, only opportunities..." — but this
          is definitely a wrong page 😅
        </p>
      </div>
    </div>
  );
}
