"use client";

import {
  createReel,
  deleteReel,
  getVideoUploadUrl,
  updateReel,
} from "@repo/actions";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@/lib/zod-resolver";

import type { TReel } from "@repo/db";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  redirect_url: z.string().min(1, "Redirect URL is required"),
  status: z.enum(["active", "inactive"]),
  title: z.string().min(1, "Title is required").max(255),
});

type FormValues = z.infer<typeof formSchema>;

type ReelsManagerProps = {
  initialReels: TReel[];
};

export default function ReelsManager({ initialReels }: ReelsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<null | TReel>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      description: "",
      redirect_url: "",
      status: "active",
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  const openAddDialog = () => {
    setEditingReel(null);
    setVideoFile(null);
    setUploadProgress(0);
    form.reset({
      description: "",
      redirect_url: "",
      status: "active",
      title: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (reel: TReel) => {
    setEditingReel(reel);
    setVideoFile(null);
    setUploadProgress(0);
    form.reset({
      description: reel.description,
      redirect_url: reel.redirect_url,
      status: reel.status,
      title: reel.title,
    });
    setDialogOpen(true);
  };

  const handleDelete = (reel: TReel) => {
    if (!confirm(`Are you sure you want to delete "${reel.title}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteReel(reel.id);
        toast.success("Reel deleted successfully");
        router.refresh();
      } catch {
        toast.error("Failed to delete reel");
      }
    });
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const { publicUrl, signedUrl } = await getVideoUploadUrl(
      file.name,
      file.type
    );

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    });

    return publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      if (editingReel) {
        await updateReel(editingReel.id, data);
        toast.success("Reel updated successfully!");
      } else {
        if (!videoFile) {
          toast.error("Please select a video file");
          return;
        }

        toast.info("Uploading video...");
        const videoUrl = await uploadVideo(videoFile);

        await createReel({ ...data, video_url: videoUrl });
        toast.success("Reel created successfully!");
      }

      setDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save reel";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reel
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Redirect URL
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialReels.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No reels found. Click &quot;Add Reel&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              initialReels.map((reel) => (
                <TableRow key={reel.id}>
                  <TableCell>
                    <div className="relative h-16 w-12 overflow-hidden rounded bg-black">
                      <video
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                        src={`${reel.video_url}#t=0.5`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{reel.title}</TableCell>
                  <TableCell className="hidden max-w-[300px] truncate text-muted-foreground md:table-cell">
                    {reel.description}
                  </TableCell>
                  <TableCell className="hidden max-w-[200px] truncate text-muted-foreground lg:table-cell">
                    {reel.redirect_url}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reel.status === "active" ? "default" : "secondary"
                      }
                    >
                      {reel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="h-8 w-8 p-0"
                          disabled={isPending}
                          variant="ghost"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(reel)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          disabled={isPending}
                          onClick={() => handleDelete(reel)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingReel ? "Edit Reel" : "Add Reel"}
            </DialogTitle>
            <DialogDescription>
              {editingReel
                ? "Update the reel details below. Video cannot be changed."
                : "Fill in the details to add a new reel."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reel title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reel description..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!editingReel && (
                <div className="space-y-2">
                  <FormLabel>Video</FormLabel>
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoFile(file);
                          setUploadProgress(0);
                        }
                      }}
                      ref={fileInputRef}
                      type="file"
                    />
                    {videoFile ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoFile(null);
                            setUploadProgress(0);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to select a video file
                        </p>
                      </div>
                    )}
                  </div>
                  {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} />
                      <p className="text-xs text-muted-foreground text-center">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="redirect_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/offers/some-offer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={isSubmitting}
                  onClick={() => setDialogOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingReel ? "Updating..." : "Creating..."}
                    </>
                  ) : editingReel ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
