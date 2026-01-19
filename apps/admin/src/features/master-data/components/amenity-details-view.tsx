"use client";

import Link from "next/link";
import { Edit, Calendar, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TAmenity } from "@repo/db";

interface AmenityDetailsViewProps {
  amenity: TAmenity;
}

export default function AmenityDetailsView({ amenity }: AmenityDetailsViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{amenity.label}</h1>
        </div>
        <Button asChild>
          <Link href={`/amenities/${amenity.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Amenity
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Icon</label>
                <p className="mt-1 text-lg font-semibold">{amenity.icon || "—"}</p>
              </div>
              {amenity.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {amenity.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Amenity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  ID
                </label>
                <p className="mt-1 text-lg font-semibold">{amenity.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


