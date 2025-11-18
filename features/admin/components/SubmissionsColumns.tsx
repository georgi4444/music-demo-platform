/**
 * Submissions Data Table Columns
 * Column definitions for the submissions data table
 */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Music } from "lucide-react";
import type { SubmissionListItem } from "@/app/api/submissions/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { $Enums } from "@/lib/generated/prisma/client";

// Status badge colors
const statusColors: Record<$Enums.SubmissionStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  IN_REVIEW: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  APPROVED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

interface ColumnActionsProps {
  submission: SubmissionListItem;
  onViewDetails: (submission: SubmissionListItem) => void;
  onUpdateStatus: (
    id: string,
    status: $Enums.SubmissionStatus
  ) => Promise<void>;
}

function ColumnActions({
  submission,
  onViewDetails,
  onUpdateStatus,
}: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onViewDetails(submission)}>
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(submission.id, "IN_REVIEW")}
        >
          Mark as In Review
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(submission.id, "APPROVED")}
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(submission.id, "REJECTED")}
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createColumns({
  onViewDetails,
  onUpdateStatus,
}: {
  onViewDetails: (submission: SubmissionListItem) => void;
  onUpdateStatus: (
    id: string,
    status: $Enums.SubmissionStatus
  ) => Promise<void>;
}): ColumnDef<SubmissionListItem>[] {
  return [
    {
      accessorKey: "artist.name",
      header: "Artist",
      cell: ({ row }) => {
        const artist = row.original.artist;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{artist.name}</span>
            <span className="text-sm text-muted-foreground">
              {artist.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "tracks",
      header: "Tracks",
      cell: ({ row }) => {
        const tracks = row.original.tracks;
        return (
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{tracks.length}</span>
            {tracks.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {tracks[0].title}
                {tracks.length > 1 && ` +${tracks.length - 1}`}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ row }) => {
        const date = new Date(row.original.submittedAt);
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-sm text-muted-foreground">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ColumnActions
          submission={row.original}
          onViewDetails={onViewDetails}
          onUpdateStatus={onUpdateStatus}
        />
      ),
    },
  ];
}
