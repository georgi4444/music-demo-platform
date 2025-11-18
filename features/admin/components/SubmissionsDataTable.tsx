/**
 * Submissions Data Table
 * Client component for displaying submissions in a data table
 */

"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function SubmissionsDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalCount
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalCount}</span>{" "}
              submissions
            </div>

            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page
                </span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={String(pagination.pageSize)} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={String(pageSize)}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
