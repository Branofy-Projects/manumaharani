import { getBlogById } from "@repo/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import BlogDetailsView from "@/features/blogs/components/blog-details-view";

export const metadata = {
  title: "Dashboard: Blog Details",
};

type PageProps = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogDetailsPage(props: PageProps) {
  const params = await props.params;
  const blogId = parseInt(params.blogId, 10);

  if (isNaN(blogId)) {
    notFound();
  }

  const blog = await getBlogById(blogId);

  if (!blog) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogDetailsView blog={blog as any} />
        </Suspense>
      </div>
    </PageContainer>
  );
}


