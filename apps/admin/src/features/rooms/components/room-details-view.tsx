"use client";

import Link from "next/link";
import { Edit, Calendar, Building2, Hash, FileText, CheckCircle, XCircle, Wrench, Ban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TRoom } from "@repo/db";

interface RoomDetailsViewProps {
  room: TRoom & {
    roomType?: any;
    images?: Array<{ image: any; order: number }>;
  };
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
  available: { label: "Available", variant: "default", icon: CheckCircle },
  occupied: { label: "Occupied", variant: "secondary", icon: XCircle },
  maintenance: { label: "Maintenance", variant: "destructive", icon: Wrench },
  blocked: { label: "Blocked", variant: "outline", icon: Ban },
};

export default function RoomDetailsView({ room }: RoomDetailsViewProps) {
  const statusInfo = statusMap[room.status] || { label: room.status, variant: "secondary" as const, icon: CheckCircle };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-mono">{room.room_number}</h1>
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>
          {room.title && (
            <p className="text-muted-foreground text-lg">{room.title}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/rooms/${room.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Room
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {room.images && room.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Room Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.images.map((item, index) => (
                    <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={item.image.large_url || item.image.original_url}
                        alt={item.image.alt_text || `Room ${room.room_number} image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {room.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {room.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {room.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {room.notes}
                </p>
              </CardContent>
            </Card>
          )}
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
                  <Hash className="h-4 w-4" />
                  Room Number
                </label>
                <p className="mt-1 text-lg font-semibold font-mono">
                  {room.room_number}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Floor
                </label>
                <p className="mt-1 text-lg font-semibold">
                  Floor {room.floor || 0}
                </p>
              </div>

              <Separator />

              {room.roomType && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Room Type
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {room.roomType.name || "N/A"}
                    </p>
                    {room.roomType.max_occupancy && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Max {room.roomType.max_occupancy} guests
                      </p>
                    )}
                  </div>
                  <Separator />
                </>
              )}
            </CardContent>
          </Card>

          {/* Room Information */}
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(room.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {room.updated_at && room.updated_at !== room.created_at && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(room.updated_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
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



