import { SubmissionsTableContainer } from "@/features/admin/components/SubmissionsTableContainer";
import { getSubmissionsList } from "@/features/admin/services/submissions-service";

export default async function SubmissionsPage() {
  // Fetch initial submissions data using the service
  const response = await getSubmissionsList({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">
          Review and manage artist demo submissions
        </p>
      </div>

      <SubmissionsTableContainer
        initialData={response.data}
        initialPagination={response.pagination}
      />
    </div>
  );
}
