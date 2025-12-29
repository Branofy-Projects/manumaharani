"use client";

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TBlog } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

const statusMap: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const columns: ColumnDef<TBlog>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="flex flex-col">
          <Link
            href={`/blogs/${blog.id}`}
            className="font-medium hover:underline cursor-pointer"
          >
            {blog.title}
          </Link>
          <div className="text-sm text-muted-foreground line-clamp-1">{blog.excerpt || "—"}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    id: "title",
    meta: {
      icon: null,
      label: "Title",
      placeholder: "Search by title...",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    cell: ({ cell }) => {
      const statusValue = cell.row.original.status;
      return (
        <Badge variant={statusValue === "published" ? "default" : "secondary"}>
          {statusMap[statusValue as string] || statusValue}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    id: "status",
    meta: {
      label: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "category",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.category || "—"}</div>;
    },
    header: "Category",
    id: "category",
  },
  {
    accessorKey: "view_count",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.view_count || 0} views</div>;
    },
    header: "Views",
    id: "views",
  },
  {
    accessorKey: "published_at",
    cell: ({ row }) => {
      const date = row.original.published_at;
      if (!date) return <div className="text-sm text-muted-foreground">—</div>;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
    header: ({ column }: { column: Column<TBlog, unknown> }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    id: "published_at",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

