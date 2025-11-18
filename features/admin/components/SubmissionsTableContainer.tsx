/**
 * Submissions Table Container
 * Client component that handles data fetching, real-time updates, and state management
 */

"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { SubmissionListItem } from "@/app/api/submissions/types";
import { Button } from "@/components/ui/button";
import {
  getSubmissions,
  updateSubmissionStatus,
} from "@/features/admin/api/submissions-client";
import { SubmissionDetailsDialog } from "@/features/admin/components/SubmissionDetailsDialog";
import { createColumns } from "@/features/admin/components/SubmissionsColumns";
import { SubmissionsDataTable } from "@/features/admin/components/SubmissionsDataTable";
import type { $Enums } from "@/lib/generated/prisma/client";
import { PUSHER_CHANNELS } from "@/lib/pusher/channels";
import { getPusherClient } from "@/lib/pusher/client";
import { PUSHER_EVENTS } from "@/lib/pusher/events";

interface SubmissionsTableContainerProps {
  initialData: SubmissionListItem[];
  initialPagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function SubmissionsTableContainer({
  initialData,
  initialPagination,
}: SubmissionsTableContainerProps) {
  const [data, setData] = useState<SubmissionListItem[]>(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionListItem | null>(null);
  const [hasNewSubmissions, setHasNewSubmissions] = useState(false);

  // Fetch submissions data
  const fetchSubmissions = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await getSubmissions({ page, pageSize: size });
      setData(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
      setPageSize(size);
      setHasNewSubmissions(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      fetchSubmissions(page, pageSize);
    },
    [fetchSubmissions, pageSize]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (size: number) => {
      // Reset to page 1 when changing page size
      fetchSubmissions(1, size);
    },
    [fetchSubmissions]
  );

  // Handle status update
  const handleUpdateStatus = useCallback(
    async (id: string, status: $Enums.SubmissionStatus) => {
      try {
        await updateSubmissionStatus(id, status);
        toast.success("Submission status updated");
        // Refresh current page
        fetchSubmissions(currentPage, pageSize);
      } catch (error) {
        console.error("Error updating submission:", error);
        toast.error("Failed to update submission status");
      }
    },
    [currentPage, pageSize, fetchSubmissions]
  );

  // Handle view details
  const handleViewDetails = useCallback((submission: SubmissionListItem) => {
    setSelectedSubmission(submission);
  }, []);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchSubmissions(currentPage, pageSize);
  }, [currentPage, pageSize, fetchSubmissions]);

  // Set up Pusher real-time updates
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNELS.SUBMISSIONS);

    // Listen for new submissions
    channel.bind(
      PUSHER_EVENTS.NEW_SUBMISSION,
      (data: { submissionId: string; timestamp: string }) => {
        console.log("New submission received:", data);
        setHasNewSubmissions(true);
        toast("New submission received!", {
          description: "Click refresh to see the latest submissions",
          action: {
            label: "Refresh",
            onClick: handleRefresh,
          },
        });
      }
    );

    // Listen for submission updates
    channel.bind(
      PUSHER_EVENTS.SUBMISSION_UPDATED,
      (data: { submissionId: string; status: string; timestamp: string }) => {
        console.log("Submission updated:", data);
        // If we're viewing the updated submission, refresh the data
        if (selectedSubmission?.id === data.submissionId) {
          fetchSubmissions(currentPage, pageSize);
        }
      }
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [
    handleRefresh,
    selectedSubmission,
    currentPage,
    pageSize,
    fetchSubmissions,
  ]);

  // Create table columns
  const columns = createColumns({
    onViewDetails: handleViewDetails,
    onUpdateStatus: handleUpdateStatus,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          variant={hasNewSubmissions ? "default" : "outline"}
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {hasNewSubmissions ? "New Submissions" : "Refresh"}
        </Button>
      </div>

      <SubmissionsDataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {selectedSubmission && (
        <SubmissionDetailsDialog
          submission={selectedSubmission}
          open={!!selectedSubmission}
          onOpenChange={(open: boolean) => !open && setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
