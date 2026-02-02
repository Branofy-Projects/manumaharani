"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import { CellAction } from "./cell-action";

import type { TOffer } from "@repo/db/schema/types.schema";
import type { Column, ColumnDef } from "@tanstack/react-table";

const CATEGORY_COLORS: Record<string, string> = {
  adventure: "bg-orange-100 text-orange-800",
  cultural: "bg-purple-100 text-purple-800",
  dining: "bg-yellow-100 text-yellow-800",
  experience: "bg-blue-100 text-blue-800",
  family: "bg-green-100 text-green-800",
  package: "bg-indigo-100 text-indigo-800",
  romantic: "bg-pink-100 text-pink-800",
  spa: "bg-teal-100 text-teal-800",
};

export const columns: ColumnDef<TOffer>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const offer = row.original;

      return (
        <div className="flex items-center gap-3 min-w-[300px]">
          {offer.image && (
            <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded">
              <Image
                alt={offer.name}
                className="object-cover"
                fill
                src={offer.image.small_url || offer.image.original_url}
              />
            </div>
          )}
          <div className="flex flex-col">
            <Link
              className="font-medium hover:underline cursor-pointer line-clamp-1"
              href={`/offers/${offer.id}`}
            >
              {offer.name}
            </Link>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {offer.slug ? `/${offer.slug}` : "—"}
            </div>
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
    accessorKey: "category",
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) return <span className="text-muted-foreground">—</span>;

      return (
        <Badge
          className={CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800"}
          variant="outline"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    header: "Category",
    id: "category",
    meta: {
      label: "Category",
      options: [
        { label: "Experience", value: "experience" },
        { label: "Package", value: "package" },
        { label: "Dining", value: "dining" },
        { label: "Spa", value: "spa" },
        { label: "Adventure", value: "adventure" },
        { label: "Cultural", value: "cultural" },
        { label: "Romantic", value: "romantic" },
        { label: "Family", value: "family" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "pricing",
    cell: ({ row }) => {
      const offer = row.original;
      const hasDiscount =
        offer.original_price &&
        offer.discounted_price &&
        Number(offer.original_price) > Number(offer.discounted_price);

      if (!offer.discounted_price && !offer.original_price) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            ₹{Number(offer.discounted_price || offer.original_price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{Number(offer.original_price).toLocaleString()}
            </span>
          )}
          {offer.price_per && (
            <span className="text-xs text-muted-foreground">
              per {offer.price_per}
            </span>
          )}
        </div>
      );
    },
    header: "Price",
    id: "pricing",
  },
  {
    accessorKey: "duration",
    cell: ({ row }) => {
      return (
        <span className="text-sm">
          {row.original.duration || "—"}
        </span>
      );
    },
    header: "Duration",
    id: "duration",
  },
  {
    accessorKey: "active",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={offer.active ? "default" : "secondary"}>
            {offer.active ? "Active" : "Inactive"}
          </Badge>
          {offer.status && offer.status !== "active" && (
            <Badge variant="outline" className="text-xs">
              {offer.status}
            </Badge>
          )}
        </div>
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
