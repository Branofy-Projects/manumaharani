"use client";

import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useRoleCheck } from "@/components/auth/role-guard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { compressImage } from "@/lib/compress-image";
import { cn } from "@/lib/utils";

import type { DateRange } from "react-day-picker";

const PAGE_SIZE_OPTIONS = [20, 40, 60, 100];

interface StaticImage {
  name: string;
  size: number;
  updated: string;
  url: string;
}

export default function StaticImagesManager() {
  const [images, setImages] = useState<StaticImage[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<null | string>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<null | StaticImage>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & filter state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSuperAdmin } = useRoleCheck();

  const paginationRange = useMemo(() => {
    const range: ("ellipsis" | number)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (page > 3) range.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (page < totalPages - 2) range.push("ellipsis");
      range.push(totalPages);
    }
    return range;
  }, [page, totalPages]);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
        sort,
      });
      if (dateRange?.from) {
        params.set("dateFrom", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.set("dateTo", dateRange.to.toISOString());
      }

      const res = await fetch(`/api/v1/static-images?${params}`);
      const json = await res.json();
      if (json.success) {
        setImages(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      } else {
        toast.error(json.error || "Failed to load images");
      }
    } catch {
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, sort, dateRange]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileCount = files.length;
    let completed = 0;
    let failed = 0;

    for (const file of files) {
      try {
        // 1. Compress client-side (converts to WebP, caps at 4096px)
        const compressed = await compressImage(file);
        const webpName = compressed.name.replace(/\.[^.]+$/, ".webp");

        // 2. Get signed URL from backend
        const urlRes = await fetch("/api/v1/static-images", {
          body: JSON.stringify({
            contentType: "image/webp",
            fileName: webpName,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const urlJson = await urlRes.json();

        if (!urlJson.success) {
          throw new Error(urlJson.error || "Failed to get upload URL");
        }

        // 3. Upload directly to GCS via signed URL
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", urlJson.signedUrl);
          xhr.setRequestHeader("Content-Type", "image/webp");

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const fileProgress = e.loaded / e.total;
              const overall =
                ((completed + fileProgress) / fileCount) * 100;
              setUploadProgress(Math.round(overall));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(compressed);
        });

        completed++;
        setUploadProgress(Math.round((completed / fileCount) * 100));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        toast.error(`Failed to upload ${file.name}: ${message}`);
        failed++;
        completed++;
      }
    }

    setIsUploading(false);
    setUploadProgress(0);

    const succeeded = fileCount - failed;
    if (succeeded > 0) {
      toast.success(
        succeeded === 1
          ? "Image uploaded successfully"
          : `${succeeded} images uploaded successfully`
      );
    }

    // Refresh from API to get correct server state
    setPage(1);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) {
      toast.error("Please drop image files only");
      return;
    }
    uploadFiles(files);
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/v1/static-images", {
        body: JSON.stringify({ fileName: deleteTarget.name }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Image deleted");
        fetchImages();
      } else {
        toast.error(json.error || "Failed to delete image");
      }
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const hasDateFilter = dateRange?.from || dateRange?.to;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary"
          }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
      >
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleFileSelect}
          ref={fileInputRef}
          type="file"
        />
        <IconUpload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Click or drag images here to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Images will be compressed and converted to WebP
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} />
          <p className="text-center text-xs text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <Button
          className="h-8 gap-1.5"
          onClick={() => {
            setSort((s) => (s === "desc" ? "asc" : "desc"));
            setPage(1);
          }}
          size="sm"
          variant="outline"
        >
          {sort === "desc" ? (
            <IconArrowDown className="h-3.5 w-3.5" />
          ) : (
            <IconArrowUp className="h-3.5 w-3.5" />
          )}
          Date {sort === "desc" ? "Newest" : "Oldest"}
        </Button>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "h-8 gap-1.5 justify-start text-left font-normal",
                !hasDateFilter && "text-muted-foreground"
              )}
              size="sm"
              variant="outline"
            >
              <IconCalendar className="h-3.5 w-3.5" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d, yyyy")} –{" "}
                    {format(dateRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM d, yyyy")
                )
              ) : (
                "Filter by date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              defaultMonth={dateRange?.from}
              mode="range"
              numberOfMonths={2}
              onSelect={(range) => {
                setDateRange(range);
                setPage(1);
              }}
              selected={dateRange}
            />
          </PopoverContent>
        </Popover>

        {hasDateFilter && (
          <Button
            className="h-8 gap-1"
            onClick={() => {
              setDateRange(undefined);
              setPage(1);
            }}
            size="sm"
            variant="ghost"
          >
            <IconX className="h-3.5 w-3.5" />
            Clear dates
          </Button>
        )}

        {/* Per Page (pushed to right) */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page</span>
          <Select
            onValueChange={(val) => {
              setPerPage(Number(val));
              setPage(1);
            }}
            value={String(perPage)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: Math.min(perPage, 10) }).map((_, i) => (
            <div className="space-y-2" key={i}>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <IconPhoto className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {hasDateFilter ? "No images found for selected dates" : "No static images found"}
          </p>
          <p className="text-xs text-muted-foreground">
            {hasDateFilter ? "Try adjusting the date filter" : "Upload images to get started"}
          </p>
        </div>
      )}

      {/* Image Grid */}
      {!isLoading && images.length > 0 && (
        <>
          {/* Results info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, total)} of {total} images
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image) => (
              <Card className="group overflow-hidden pt-0" key={image.url}>
                <div className="relative aspect-square">
                  <Image
                    alt={image.name}
                    className="h-full w-full object-cover"
                    fill
                    loading="lazy"
                    src={image.url}
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <Button
                      onClick={() => copyUrl(image.url)}
                      size="sm"
                      variant="secondary"
                    >
                      {copiedUrl === image.url ? (
                        <IconCheck className="mr-1.5 h-4 w-4" />
                      ) : (
                        <IconCopy className="mr-1.5 h-4 w-4" />
                      )}
                      Copy URL
                    </Button>
                    {isSuperAdmin() && (
                      <Button
                        onClick={() => setDeleteTarget(image)}
                        size="sm"
                        variant="destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="truncate text-sm font-medium">{image.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.size)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(image.updated), "MMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  {paginationRange.map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          className="cursor-pointer"
                          isActive={page === item}
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        open={!!deleteTarget}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{deleteTarget?.name}</span> from the
              storage bucket. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
