"use client";

import { Calendar, Edit, Eye, FileText, Tag, User } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { TBlog } from "@repo/db";

interface BlogDetailsViewProps {
  blog: {
    author?: any;
    featuredImage?: any;
    images?: Array<{ image: any; order: number }>;
  } & TBlog;
}

const statusMap: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  archived: { label: "Archived", variant: "outline" },
  draft: { label: "Draft", variant: "secondary" },
  published: { label: "Published", variant: "default" },
};

export default function BlogDetailsView({ blog }: BlogDetailsViewProps) {
  const statusInfo = statusMap[blog.status] || { label: blog.status, variant: "secondary" as const };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{blog.title}</h1>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {blog.excerpt && (
            <p className="text-muted-foreground text-lg">{blog.excerpt}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`/blogs/${blog.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Blog
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {blog.featuredImage && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    alt={blog.featuredImage.alt_text || blog.title}
                    className="h-full w-full object-cover"
                    src={blog.featuredImage.large_url || blog.featuredImage.original_url}
                  />
                </div>
                {blog.featuredImage.alt_text && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {blog.featuredImage.alt_text}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Blog Information */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {blog.category || "General"}
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Views
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {blog.view_count || 0}
                </p>
              </div>

              <Separator />

              {blog.published_at && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Published Date
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {new Date(blog.published_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {blog.updated_at && blog.updated_at !== blog.created_at && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(blog.updated_at).toLocaleDateString("en-US", {
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

          {/* Author Information */}
          {blog.author && (
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {blog.author.name || blog.author.email || "Unknown"}
                    </p>
                    {blog.author.email && (
                      <p className="text-sm text-muted-foreground">
                        {blog.author.email}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Slug */}
          <Card>
            <CardHeader>
              <CardTitle>URL Slug</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block rounded bg-muted px-2 py-1 text-sm">
                /blogs/{blog.slug}
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



