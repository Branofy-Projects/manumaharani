"use client";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createExperience,
  deleteExperience,
  reorderExperiences,
  updateExperience,
} from "@repo/actions";
import { Edit, GripVertical, Loader2, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@/lib/zod-resolver";

import type { DragEndEvent } from "@dnd-kit/core";
import type { TExperience } from "@repo/db";

const MAX_EXPERIENCES = 4;

const formSchema = z.object({
  image: ImagesArraySchema(1, 1),
  name: z.string().min(1, "Name is required").max(255),
  url: z.string().min(1, "URL is required"),
});

type ExperiencesManagerProps = {
  initialExperiences: TExperience[];
};

type FormValues = z.infer<typeof formSchema>;

export default function ExperiencesManager({
  initialExperiences,
}: ExperiencesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<null | TExperience>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [experiences, setExperiences] = useState(initialExperiences);

  const canAdd = experiences.length < MAX_EXPERIENCES;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const form = useForm<FormValues>({
    defaultValues: {
      image: [],
      name: "",
      url: "",
    },
    resolver: zodResolver(formSchema),
  });

  const imageValue = form.watch("image");
  const hasValidImage = hasValidImages(
    (imageValue || []) as FileUploaderFormImage[]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = experiences.findIndex((e) => e.id === active.id);
      const newIndex = experiences.findIndex((e) => e.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(experiences, oldIndex, newIndex);
      setExperiences(reordered);

      startTransition(async () => {
        try {
          await reorderExperiences(reordered.map((e) => e.id));
          toast.success("Order updated");
          router.refresh();
        } catch {
          setExperiences(experiences);
          toast.error("Failed to update order");
        }
      });
    },
    [experiences, router, startTransition]
  );

  const openAddDialog = () => {
    setEditingExperience(null);
    form.reset({ image: [], name: "", url: "" });
    setHasAttemptedSubmit(false);
    setDialogOpen(true);
  };

  const openEditDialog = (experience: TExperience) => {
    setEditingExperience(experience);
    form.reset({
      image: experience.image
        ? [
          {
            _type: "existing" as const,
            alt_text: experience.name,
            image_id: 0,
            large_url: experience.image,
            medium_url: experience.image,
            order: 0,
            original_url: experience.image,
            small_url: experience.image,
          },
        ]
        : [],
      name: experience.name,
      url: experience.url,
    });
    setHasAttemptedSubmit(false);
    setDialogOpen(true);
  };

  const handleDelete = (experience: TExperience) => {
    if (
      !confirm(
        `Are you sure you want to delete "${experience.name}"?`
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteExperience(experience.id);
        setExperiences((prev) => prev.filter((e) => e.id !== experience.id));
        toast.success("Experience deleted successfully");
        router.refresh();
      } catch {
        toast.error("Failed to delete experience");
      }
    });
  };

  const onSubmit = async (data: FormValues) => {
    setHasAttemptedSubmit(true);

    if (!hasValidImage) {
      toast.error("Please add alt text to the image");
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl: string;
      const img = data.image[0];

      if (img && img._type === "new") {
        setIsImageUploading(true);

        const uploadResult = await uploadFilesWithProgress(
          [img.file],
          (progressMap: Record<string, number>) => {
            setProgresses(progressMap);
          },
          "/api/v1/upload-image"
        );

        imageUrl = uploadResult[0]!.image.original_url;
        setIsImageUploading(false);
      } else if (img && img._type === "existing") {
        imageUrl = img.original_url;
      } else {
        toast.error("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      if (editingExperience) {
        await updateExperience(editingExperience.id, {
          image: imageUrl,
          name: data.name,
          url: data.url,
        });
        toast.success("Experience updated successfully!");
      } else {
        await createExperience({
          image: imageUrl,
          name: data.name,
          url: data.url,
        });
        toast.success("Experience created successfully!");
      }

      setDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to save experience";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
    }
  };

  const sortableIds = experiences.map((e) => e.id);

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((experience) => (
              <SortableExperienceCard
                experience={experience}
                isPending={isPending}
                key={experience.id}
                onDelete={handleDelete}
                onEdit={openEditDialog}
              />
            ))}

            {canAdd && (
              <Card
                className="flex cursor-pointer items-center justify-center border-dashed aspect-[4/3] hover:bg-muted/50 transition-colors"
                onClick={openAddDialog}
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Plus className="h-8 w-8" />
                  <span className="text-sm font-medium">Add Experience</span>
                  <span className="text-xs">
                    {experiences.length}/{MAX_EXPERIENCES}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {experiences.length === 0 && !canAdd && (
        <div className="text-center text-muted-foreground py-12">
          No experiences found.
        </div>
      )}

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? "Update the experience details below."
                : "Fill in the details to add a new experience."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter experience name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter URL..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        disabled={isImageUploading || isSubmitting}
                        id="experience-image"
                        maxFiles={1}
                        onValueChange={field.onChange}
                        progresses={progresses}
                        showValidation={hasAttemptedSubmit}
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={isSubmitting || isImageUploading}
                  onClick={() => setDialogOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSubmitting || isImageUploading}
                  type="submit"
                >
                  {isSubmitting || isImageUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isImageUploading
                        ? "Uploading..."
                        : editingExperience
                          ? "Updating..."
                          : "Creating..."}
                    </>
                  ) : editingExperience ? (
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

function SortableExperienceCard({
  experience,
  isPending,
  onDelete,
  onEdit,
}: {
  experience: TExperience;
  isPending: boolean;
  onDelete: (experience: TExperience) => void;
  onEdit: (experience: TExperience) => void;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: experience.id });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      className="overflow-hidden pt-0"
      ref={setNodeRef}
      style={style}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          alt={experience.name}
          className="object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          src={experience.image}
        />
        <button
          className="absolute top-2 left-2 rounded bg-black/50 p-1.5 text-white cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{experience.name}</h3>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {experience.url}
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            disabled={isPending}
            onClick={() => onEdit(experience)}
            size="sm"
            variant="outline"
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            disabled={isPending}
            onClick={() => onDelete(experience)}
            size="sm"
            variant="destructive"
          >
            <Trash className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
