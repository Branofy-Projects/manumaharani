"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { TAttraction } from "@repo/db";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<TAttraction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="relative h-10 w-10">
          <Image
            src={image?.small_url || image?.original_url || "/placeholder.jpg"}
            alt={row.getValue("title")}
            fill
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("subtitle")}</div>,
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "active",
    header: "Status",
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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
