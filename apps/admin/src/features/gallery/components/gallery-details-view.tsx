"use client";

import Link from "next/link";
import { Edit, Calendar, Image as ImageIcon, Video, Tag, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TGallery } from "@repo/db";

interface GalleryDetailsViewProps {
  gallery: TGallery & {
    image?: any;
    videoThumbnail?: any;
  };
}

const categoryLabels: Record<string, string> = {
  rooms: "Rooms",
  dining: "Dining",
  spa: "Spa",
  activities: "Activities",
  facilities: "Facilities",
  events: "Events",
  surroundings: "Surroundings",
  general: "General",
};

export default function GalleryDetailsView({ gallery }: GalleryDetailsViewProps) {
  const categoryLabel = categoryLabels[gallery.category || "general"] || gallery.category || "General";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{gallery.title || "Untitled"}</h1>
            <Badge variant={gallery.type === "video" ? "default" : "outline"}>
              {gallery.type === "video" ? "Video" : "Image"}
            </Badge>
          </div>
          {gallery.description && (
            <p className="text-muted-foreground text-lg">{gallery.description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/gallery/${gallery.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Gallery Item
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {gallery.type === "video" ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <ImageIcon className="h-5 w-5" />
                )}
                {gallery.type === "video" ? "Video" : "Image"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gallery.type === "video" ? (
                <div className="space-y-4">
                  {gallery.videoThumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={gallery.videoThumbnail.large_url || gallery.videoThumbnail.original_url}
                        alt={gallery.videoThumbnail.alt_text || gallery.title || "Video thumbnail"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {gallery.video_url && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Video URL</label>
                      <a
                        href={gallery.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-blue-600 hover:underline break-all"
                      >
                        {gallery.video_url}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                gallery.image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={gallery.image.large_url || gallery.image.original_url}
                      alt={gallery.image.alt_text || gallery.title || "Gallery image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
              )}
              {gallery.image?.alt_text && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {gallery.image.alt_text}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Gallery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {categoryLabel}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {gallery.type === "video" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  Type
                </label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {gallery.type || "image"}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(gallery.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {gallery.updated_at && gallery.updated_at !== gallery.created_at && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(gallery.updated_at).toLocaleDateString("en-US", {
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


