import { getBlogs } from "@repo/actions/blogs.actions";

import { BlogCard } from "@/components/Blogs/BlogCard";

export const dynamic = 'force-dynamic';

export const metadata = {
  description: "Read the latest blog posts from ManuMaharani Jungle Resort.",
  title: "Blog Posts | ManuMaharani",
};

export default async function BlogsPage(props: PageProps<"/blogs">) {
  const searchParams = await props.searchParams;

  const page = Number(
    isNaN(Number(searchParams.page)) ? "1" : searchParams.page
  );
  const limit = Number(
    isNaN(Number(searchParams.limit)) ? "10" : searchParams.limit
  );

  const { blogs, total } = await getBlogs({ limit, page, status: "published" });

  const totalPages = Math.ceil(total / limit);

  const pagination = {
    currentPage: page,
    totalItems: total,
    totalPages,
  };

  return (
    <>
      {/* Blog Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2
            className={`text-2xl font-light tracking-wide text-gray-900 md:text-3xl`}
          >
            Latest Articles
          </h2>
          {/* <div className="flex gap-4">
            <button
              className={`rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
            >
              All Posts
            </button>
            <button
              className={`rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
            >
              Real Weddings
            </button>
            <button
              className={`rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
            >
              Planning Tips
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          {pagination.totalPages > 1 && (
            <>
              {Array.from({ length: pagination.totalPages }, (_, index) => (
                <button
                  className={`rounded-lg px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
                  key={index}
                >
                  {index + 1}
                </button>
              ))}
            </>
          )}
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className={`mb-4 text-3xl font-light tracking-wide text-gray-900`}
          >
            Subscribe to Our Newsletter
          </h2>
          <p className={`mb-8 text-lg text-gray-600`}>
            Get the latest wedding stories, planning tips, and exclusive offers
            delivered to your inbox.
          </p>
          <form className="mx-auto flex max-w-md gap-4">
            <input
              className={`flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900`}
              placeholder="Enter your email"
              type="email"
            />
            <button
              className={`rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-gray-800`}
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section> */}
    </>
  );
}
