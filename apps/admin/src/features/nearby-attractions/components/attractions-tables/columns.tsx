"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { CellAction } from "./cell-action";

import type { TAttraction } from "@repo/db";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TAttraction>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: "select",
  },
  {
    accessorKey: "image",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="relative h-10 w-10">
          <Image
            alt={row.getValue("title")}
            className="rounded-md object-cover"
            fill
            src={image?.small_url || image?.original_url || "/placeholder.jpg"}
          />
        </div>
      );
    },
    header: "Image",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subtitle",
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("subtitle")}</div>,
    header: "Subtitle",
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "active",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? (
            <Check className="mr-1 h-3 w-3" />
          ) : (
            <X className="mr-1 h-3 w-3" />
          )}
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    header: "Status",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
