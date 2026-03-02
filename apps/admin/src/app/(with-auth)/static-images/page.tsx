import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import StaticImagesManager from "@/features/static-images/components/static-images-manager";

export const metadata = {
  title: "Dashboard: Static Images",
};

export default function StaticImagesPage() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <Heading
          description="Upload and manage static images. Images are compressed and converted to WebP."
          title="Static Images"
        />
        <Separator />
        <StaticImagesManager />
      </div>
    </PageContainer>
  );
}
