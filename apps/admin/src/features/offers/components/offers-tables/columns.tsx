"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TOffer } from "@repo/db/schema/types.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TOffer>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const offer = row.original;

      return (
        <div className="flex flex-col w-[300px]">
          <Link
            className="font-medium hover:underline cursor-pointer truncate line-clamp-1"
            href={`/offers/${offer.id}`}
          >
            {offer.name}
          </Link>
          <div className="text-sm text-muted-foreground truncate line-clamp-1">
            {offer.link || "—"}
          </div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TOffer, unknown> }) => (
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
    accessorKey: "active",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: "Status",
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      variant: "select",
    },
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
