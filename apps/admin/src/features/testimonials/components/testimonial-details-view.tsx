"use client";

import { Calendar, CheckCircle, Clock, Edit, FileText, Mail, MapPin, Star, User, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TTestimonial } from "@repo/db";

interface TestimonialDetailsViewProps {
  testimonial: {
    guestAvatar?: any;
  } & TTestimonial;
}

const statusMap: Record<string, { icon: any; label: string; variant: "default" | "destructive" | "outline" | "secondary"; }> = {
  approved: { icon: CheckCircle, label: "Approved", variant: "default" },
  pending: { icon: Clock, label: "Pending", variant: "secondary" },
  rejected: { icon: XCircle, label: "Rejected", variant: "destructive" },
};

export default function TestimonialDetailsView({ testimonial }: TestimonialDetailsViewProps) {
  const statusInfo = statusMap[testimonial.status] || { icon: Clock, label: testimonial.status, variant: "secondary" as const };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{testimonial.guest_name}</h1>
            <Badge className="flex items-center gap-1" variant={statusInfo.variant}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>
          {testimonial.title && (
            <p className="text-muted-foreground text-lg">{testimonial.title}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/testimonials/${testimonial.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Testimonial
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Avatar */}
          {testimonial.guestAvatar && (
            <Card>
              <CardHeader>
                <CardTitle>Guest Avatar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full">
                    <img
                      alt={testimonial.guestAvatar.alt_text || testimonial.guest_name}
                      className="h-full w-full object-cover"
                      src={testimonial.guestAvatar.large_url || testimonial.guestAvatar.original_url}
                    />
                  </div>
                  {testimonial.guestAvatar.alt_text && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.guestAvatar.alt_text}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Review Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        className={`h-5 w-5 ${i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                          }`}
                        key={i}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold">({testimonial.rating}/5)</span>
                  </div>
                </div>
                <Separator />
                {/* Content */}
                <div>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {testimonial.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          {testimonial.admin_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {testimonial.admin_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {testimonial.guest_name}
                </p>
              </div>

              {testimonial.guest_email && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <a
                      className="mt-1 block text-blue-600 hover:underline"
                      href={`mailto:${testimonial.guest_email}`}
                    >
                      {testimonial.guest_email}
                    </a>
                  </div>
                </>
              )}

              {testimonial.guest_location && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {testimonial.guest_location}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Testimonial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Platform</label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {testimonial.platform || "Website"}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {testimonial.updated_at && testimonial.updated_at !== testimonial.created_at && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(testimonial.updated_at).toLocaleDateString("en-US", {
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



