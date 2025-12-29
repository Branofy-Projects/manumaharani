"use client";

import Link from "next/link";

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

import { CellAction } from './cell-action';

import type { TFaq } from "@repo/db";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TFaq>[] = [
  {
    accessorKey: "question",
    cell: ({ row }) => {
      const faq = row.original;
      return (
        <Link href={`/faqs/${faq.id}`} className="hover:underline">
          <div className="font-medium">{faq.question}</div>
        </Link>
      );
    },
    enableColumnFilter: true,
    header: ({ column }: { column: Column<TFaq, unknown> }) => (
      <DataTableColumnHeader column={column} title="Question" />
    ),
    id: "question",
    meta: {
      icon: null,
      label: "Question",
      placeholder: "Search by question...",
      variant: "text",
    },
  },
  {
    accessorKey: "answer",
    cell: ({ row }) => {
      const answer = row.original.answer;
      return (
        <div className="max-w-[500px] truncate text-sm text-muted-foreground">
          {answer || "—"}
        </div>
      );
    },
    header: "Answer",
    id: "answer",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];

