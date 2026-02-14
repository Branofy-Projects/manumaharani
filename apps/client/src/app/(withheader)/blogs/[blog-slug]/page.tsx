import { getBlogBySlug, getBlogs } from "@repo/actions/blogs.actions";
import Image from "next/image";
import Link from "next/link";

import { LexicalRenderer } from "@/components/lexical-renderer";
import { getBlogBySlugCache } from "@/lib/cache/blogs.cache";
import { calculateReadTime } from "@/lib/utils";

import { RelatedPostsSuspense } from "./components/RelatesPosts";

export default async function BlogPost({
    params,
}: PageProps<"/blogs/[blog-slug]">) {
    const { "blog-slug": blogSlug } = await params;
    const post = await getBlogBySlugCache(blogSlug);

    if (!post) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className={`mb-4 text-4xl font-light text-gray-900`}>
                        Blog Post Not Found
                    </h1>
                    <Link
                        className={`text-lg text-gray-600 underline hover:text-gray-900`}
                        href="/blogs"
                    >
                        Back to Blogs
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full overflow-x-hidden pt-[72px] md:pt-[88px]">
            {/* Hero Image */}
            <div className="relative aspect-[16/9] max-h-[500px] w-full overflow-hidden">
                <Image
                    alt={post.title}
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="100vw"
                    src={post.featuredImage.original_url}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* Article Content */}
            <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                {/* <nav className={`mb-8 flex items-center gap-2 text-sm text-gray-500`}>
                    <Link className="hover:text-gray-900" href="/">
                        Home
                    </Link>
                    <span>/</span>
                    <Link className="hover:text-gray-900" href="/blogs">
                        Blogs
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">{post.category}</span>
                </nav> */}

                {/* Category Badge */}
                <div className="mb-4">
                    <span
                        className={`inline-block rounded-full bg-gray-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900`}
                    >
                        {post.category}
                    </span>
                </div>

                {/* Title */}
                <h1
                    className={`mb-6 text-4xl  leading-tight text-gray-900 md:text-5xl lg:text-6xl`}
                >
                    {post.title}
                </h1>

                {/* Meta Info */}
                <div
                    className={`mb-12 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 text-sm text-gray-600`}
                >
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">By</span>
                        <span>Manumaharani Team</span>
                    </div>
                    <span>•</span>
                    <span>
                        {new Date(post.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                    <span>•</span>
                    <span>{calculateReadTime(post.content)} min read</span>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <LexicalRenderer content={post.content} />
                </div>

                {/* Share Section */}
                {/* <div className="mt-16 border-t border-gray-200 pt-8">
                    <h3 className={`mb-4 text-xl font-light text-gray-900`}>
                        Share this article
                    </h3>
                    <div className="flex gap-4">
                        <button
                            className={`rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
                        >
                            Facebook
                        </button>
                        <button
                            className={`rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
                        >
                            Twitter
                        </button>
                        <button
                            className={`rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
                        >
                            Pinterest
                        </button>
                        <button
                            className={`rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
                        >
                            Email
                        </button>
                    </div>
                </div> */}

                {/* CTA Section */}
                <div className="mt-16 rounded-lg bg-gray-50 p-8 text-center md:p-12">
                    <h3
                        className={`mb-4 text-3xl  tracking-wider text-gray-900`}
                    >
                        Plan Your Experience at Manu Maharani
                    </h3>
                    <p className={`mb-8 text-lg  text-gray-600`}>
                        Let our expert team help you create an unforgettable celebration at
                        Manu Maharani.
                    </p>
                    <Link
                        className={`inline-block rounded-lg bg-gray-900 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-gray-800`}
                        href="/rooms"
                    >
                        Book Your Stay
                    </Link>
                </div>
            </article>

            {/* Related Posts */}
            <RelatedPostsSuspense category={post.category} ignore={[post.id]} />
        </main>
    );
};

export async function generateMetadata({
    params,
}: PageProps<"/blogs/[blog-slug]">) {
    const { "blog-slug": blogSlug } = await params;
    const post = await getBlogBySlugCache(blogSlug);
    return {
        title: post?.title || "Blog Post Not Found",
    };
};

export async function generateStaticParams() {
    const { blogs } = await getBlogs({
        status: "published",
    });

    return blogs.map((post) => ({
        "blog-slug": post.slug,
    }));
}
