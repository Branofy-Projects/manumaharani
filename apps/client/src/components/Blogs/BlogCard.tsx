import Image from "next/image";
import Link from "next/link";

import { calculateReadTime } from "@/lib/utils";

import type { TBlog } from "@repo/db/schema/types.schema";

export function BlogCard({ post }: { post: TBlog }) {
    return (
        <Link
            className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
            href={`/blogs/${post.slug}`}
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    alt={post.featuredImage?.alt_text || post.title}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    fill
                    src={post.featuredImage?.small_url}
                />
                <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900">
                    {post.category}
                </div>
            </div>
            <div className="p-6">
                <div className={`mb-3 flex items-center gap-4 text-xs text-gray-500`}>
                    <span>{post.created_at?.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{calculateReadTime(post.content)} min read</span>
                </div>
                <h3
                    className={`mb-3 text-xl font-light leading-tight text-gray-900 transition-colors group-hover:text-gray-600`}
                >
                    {post.title}
                </h3>
                <p
                    className={`mb-4 text-sm line-clamp-2 leading-relaxed text-gray-600`}
                >
                    {post.excerpt}
                </p>
                <span
                    className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-900 transition-all group-hover:gap-3`}
                >
                    Read More
                    <span className="text-lg">→</span>
                </span>
            </div>
        </Link>
    );
}
