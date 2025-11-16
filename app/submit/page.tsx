import { SubmissionForm } from "@/components/submission/SubmissionForm";

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 bg-linear-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
          Submit Your Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Share your music with us. We're excited to hear what you've created!
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Upload your tracks, provide details, and our A&R team will review your
          submission.
        </p>
      </div>

      <SubmissionForm />
    </div>
  );
}
