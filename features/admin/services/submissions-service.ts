/**
 * Submissions Service
 * Business logic for fetching and managing submissions
 * Shared between API routes and server components
 */

import type {
  SubmissionListItem,
  SubmissionListParams,
  SubmissionListResponse,
} from "@/app/api/submissions/types";
import type { Prisma } from "@/lib/generated/prisma/client";
import { SubmissionStatus } from "@/lib/generated/prisma/client";
import type { SortOrder } from "@/lib/generated/prisma/internal/prismaNamespace";
import prisma from "@/lib/prisma";

/**
 * Include clause for submission queries
 * Defines all related data to fetch with submissions
 */
export const submissionInclude = {
  artist: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      instagram: true,
      soundcloud: true,
      spotify: true,
      bio: true,
    },
  },
  tracks: {
    select: {
      id: true,
      title: true,
      genre: true,
      bpm: true,
      key: true,
      description: true,
      fileUrl: true,
      streamUrl: true,
      publicId: true,
      fileType: true,
      fileSize: true,
      duration: true,
      createdAt: true,
    },
  },
  reviews: {
    select: {
      id: true,
      grade: true,
      internalNotes: true,
      feedback: true,
      reviewedAt: true,
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
} as const;

/**
 * Build where clause for filtering submissions
 */
function buildWhereClause(
  params: SubmissionListParams,
): Prisma.SubmissionWhereInput {
  const where: Prisma.SubmissionWhereInput = {};

  // Status filter
  if (
    params.status &&
    Object.values(SubmissionStatus).includes(params.status)
  ) {
    where.status = params.status;
  }

  // Date range filter
  if (params.fromDate || params.toDate) {
    where.submittedAt = {};
    if (params.fromDate) {
      where.submittedAt.gte = new Date(params.fromDate);
    }
    if (params.toDate) {
      where.submittedAt.lte = new Date(params.toDate);
    }
  }

  // Search vs individual filters (mutually exclusive for cleaner logic)
  if (params.search) {
    // Global search across multiple fields
    const searchConditions: Prisma.SubmissionWhereInput[] = [
      {
        artist: {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      },
      {
        artist: {
          email: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      },
      {
        tracks: {
          some: {
            title: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        },
      },
    ];

    // Add genre to search if provided
    if (params.genre) {
      searchConditions.push({
        tracks: {
          some: {
            title: {
              contains: params.search,
              mode: "insensitive",
            },
            genre: {
              contains: params.genre,
              mode: "insensitive",
            },
          },
        },
      });
    }

    where.OR = searchConditions;
  } else {
    // Individual filters only when not searching
    if (params.artistName) {
      where.artist = {
        name: {
          contains: params.artistName,
          mode: "insensitive",
        },
      };
    }

    // Genre filter
    if (params.genre) {
      where.tracks = {
        some: {
          genre: {
            contains: params.genre,
            mode: "insensitive",
          },
        },
      };
    }
  }

  return where;
}

/**
 * Build orderBy clause for sorting submissions
 */
function buildOrderByClause(
  sortBy: string = "submittedAt",
  sortOrder: SortOrder = "desc",
): Prisma.SubmissionOrderByWithRelationInput {
  const orderBy: Prisma.SubmissionOrderByWithRelationInput = {};

  if (sortBy === "submittedAt") {
    orderBy.submittedAt = sortOrder;
  } else if (sortBy === "status") {
    orderBy.status = sortOrder;
  } else if (sortBy === "artistName") {
    orderBy.artist = { name: sortOrder };
  } else {
    orderBy.submittedAt = "desc"; // default fallback
  }

  return orderBy;
}

/**
 * Get submissions with filtering, sorting, and pagination
 * Core business logic shared between API routes and server components
 */
export async function getSubmissionsList(
  params: SubmissionListParams = {},
): Promise<SubmissionListResponse> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "submittedAt",
    sortOrder = "desc",
    ...filterParams
  } = params;

  const skip = (page - 1) * pageSize;

  // Build query clauses
  const where = buildWhereClause({ ...filterParams, sortBy, sortOrder });
  const orderBy = buildOrderByClause(sortBy, sortOrder as SortOrder);

  // Execute queries in parallel
  const [submissions, totalCount] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: submissionInclude,
    }),
    prisma.submission.count({ where }),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    success: true,
    data: submissions as SubmissionListItem[],
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
    filters: {
      status: filterParams.status,
      artistName: filterParams.artistName,
      genre: filterParams.genre,
      fromDate: filterParams.fromDate,
      toDate: filterParams.toDate,
      search: filterParams.search,
    },
    sorting: {
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    },
  };
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(
  id: string,
): Promise<SubmissionListItem | null> {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: submissionInclude,
  });

  return submission as SubmissionListItem | null;
}

/**
 * Update submission status
 */
export async function updateSubmissionStatusById(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionListItem> {
  const submission = await prisma.submission.update({
    where: { id },
    data: { status },
    include: submissionInclude,
  });

  return submission as SubmissionListItem;
}
