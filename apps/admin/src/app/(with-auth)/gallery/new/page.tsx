import GalleryForm from "@/features/gallery/components/gallery-form";

export const metadata = {
  title: "Dashboard: Create Gallery Item",
};

export default function NewGalleryPage() {
  return <GalleryForm initialData={null} pageTitle="Create New Gallery Item" />;
}

