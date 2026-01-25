"use client";

import Link from "next/link";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TEvent } from "@repo/db/schema/types.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TEvent>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="flex flex-col w-[300px]">
          <Link
            className="font-medium hover:underline cursor-pointer truncate line-clamp-1"
            href={`/events/${event.id}`}
          >
            {event.name}
          </Link>
          <div className="text-sm text-muted-foreground truncate line-clamp-1">
            {event.location || "—"}
          </div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TEvent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    id: "name",
    meta: {
      icon: null,
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
    },
  },
  {
    accessorKey: "startDate",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      const endDate = row.original.endDate;
      
      if (!startDate) return <div className="text-sm text-muted-foreground">—</div>;
      
      const formattedStart = new Date(startDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (endDate) {
        const formattedEnd = new Date(endDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return (
          <div className="text-sm text-muted-foreground">
            {formattedStart} - {formattedEnd}
          </div>
        );
      }

      return (
        <div className="text-sm text-muted-foreground">
          {formattedStart}
        </div>
      );
    },
    header: ({ column }: { column: Column<TEvent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    id: "date",
  },
  {
    accessorKey: "excerpt",
    cell: ({ row }) => {
      return (
        <div className="text-sm truncate max-w-[400px]">
          {row.original.excerpt || "—"}
        </div>
      );
    },
    header: "Excerpt",
    id: "excerpt",
  },
  {
    accessorKey: "startTime",
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      return (
        <div className="text-sm">
          {startTime} - {endTime}
        </div>
      );
    },
    header: "Time",
    id: "time",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
