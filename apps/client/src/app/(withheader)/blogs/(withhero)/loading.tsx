import { BlogCardLoading } from "@/components/Blogs/BlogCardLoading";

const BlogLoading = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2
          className={`text-2xl font-light tracking-wide text-gray-900 md:text-3xl`}
        >
          Latest Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <BlogCardLoading key={index} />
        ))}
      </div>
    </section>
  );
};

export default BlogLoading;
