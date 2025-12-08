import BlogForm from "@/features/blogs/components/blog-form";

export const metadata = {
  title: "Dashboard: Create Blog Post",
};

export default function NewBlogPage() {
  return <BlogForm initialData={null} pageTitle="Create New Blog Post" />;
}
