"use client";

import Link from "next/link";
import { Edit, Tag, MapPin } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import type { TAttraction } from "@repo/db";

interface AttractionDetailsViewProps {
  attraction: TAttraction;
}

export default function AttractionDetailsView({ attraction }: AttractionDetailsViewProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{attraction.title}</h1>
            <Badge variant={attraction.active ? "default" : "secondary"}>
              {attraction.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-1">
             <MapPin className="h-4 w-4" /> Nearby Attraction
          </p>
        </div>
        <Button asChild>
          <Link href={`/nearby-attractions/${attraction.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Attraction
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {attraction.image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={attraction.image.large_url || attraction.image.original_url}
                    alt={attraction.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subtitle / Description</label>
                <p className="mt-1 whitespace-pre-wrap">{attraction.subtitle}</p>
              </div>

              {attraction.link && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">External Link</label>
                  <p className="mt-1">
                    <a href={attraction.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {attraction.link}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  ID
                </label>
                <p className="mt-1 text-sm font-mono">{attraction.id}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Order</label>
                <p className="mt-1 font-semibold">{attraction.order}</p>
              </div>
              {attraction.distance != null && attraction.distance !== "" && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Distance</label>
                    <p className="mt-1 font-semibold">{attraction.distance}</p>
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
