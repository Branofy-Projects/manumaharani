import Link from "next/link";

import { getLatestBlogsCache } from "@/lib/cache/blogs.cache";

import { BlogCard } from "../Blogs/BlogCard";

export default async function BlogsSection() {
    const blogs = await getLatestBlogsCache()

    return <>
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-8 md:mb-12 px-4 xl:px-0">
            {blogs.map((exp, idx) => (
                <BlogCard key={idx} post={exp as any} />
            ))}
        </div>
        <Link href="/blogs" passHref
        >
            <button className="border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
                Discover More
            </button>
        </Link>
    </>
}