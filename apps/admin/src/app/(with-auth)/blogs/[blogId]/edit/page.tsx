import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import BlogForm from "@/features/blogs/components/blog-form";
import { getBlogById } from "@repo/actions";

export const metadata = {
  title: "Dashboard: Edit Blog Post",
};

type PageProps = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogEditPage(props: PageProps) {
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
          <BlogForm
            initialData={blog as any}
            pageTitle="Edit Blog Post"
            blogId={params.blogId}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}

