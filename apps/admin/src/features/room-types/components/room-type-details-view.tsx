"use client";

import { Bed, Calendar, CheckCircle, DollarSign, Edit, FileText, Ruler, Tag, Users, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TRoomType } from "@repo/db";

interface RoomTypeDetailsViewProps {
  roomType: {
    amenities?: Array<{ amenity: any; order: number }>;
    faqs?: Array<{ faq: any; order: number }>;
    images?: Array<{ image: any; order: number }>;
    policies?: Array<{ order: number; policy: any; }>;
  } & TRoomType;
}

const bedTypeLabels: Record<string, string> = {
  double: "Double",
  king: "King",
  queen: "Queen",
  single: "Single",
  twin: "Twin",
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" }> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
};

export default function RoomTypeDetailsView({ roomType }: RoomTypeDetailsViewProps) {
  const statusInfo = statusMap[roomType.status] || { label: roomType.status, variant: "secondary" as const };
  const bedTypeLabel = bedTypeLabels[roomType.bed_type || "double"] || roomType.bed_type || "Double";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{roomType.name}</h1>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {roomType.description && (
            <p className="text-muted-foreground text-lg">{roomType.description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/room-types/${roomType.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Room Type
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {roomType.images && roomType.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {roomType.images.map((item, index) => (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg" key={index}>
                      <img
                        alt={item.image.alt_text || roomType.name}
                        className="h-full w-full object-cover"
                        src={item.image.large_url || item.image.original_url}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {roomType.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Bed Type
                </label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {bedTypeLabel}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Number of Beds
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {roomType.number_of_beds || 1}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Max Occupancy
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {roomType.max_occupancy || 2} guests
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Room Size
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {roomType.size_sqft || 0} sq ft
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Base Price
                </label>
                <p className="mt-1 text-lg font-semibold">
                  ₹{Number(roomType.base_price || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Room Type Information */}
          <Card>
            <CardHeader>
              <CardTitle>Room Type Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Slug
                </label>
                <code className="mt-1 block rounded bg-muted px-2 py-1 text-sm">
                  {roomType.slug}
                </code>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(roomType.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {roomType.updated_at && roomType.updated_at !== roomType.created_at && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(roomType.updated_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


