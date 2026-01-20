import { getBlogs } from "@repo/actions/blogs.actions";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { calculateReadTime } from "@/lib/utils";

export default async function BlogsSection() {
    const { blogs } = await getBlogs({
        limit: 3,
        status: 'published'
    }, {
        published_at: 'desc'
    })
    return <>
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-8 md:mb-12 px-4 md:px-0">
            {blogs.map((exp, idx) => (
                <div className="flex flex-col items-start " key={idx}>
                    <div className="w-full aspect-[4/5] overflow-hidden mb-6">
                        <Image
                            alt={exp.title}
                            className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-300"
                            height={500}
                            src={exp.featuredImage?.original_url}
                            width={400}
                        />
                    </div>
                    <h3 className="text-xl font-serif text-black mb-2">{exp.title}</h3>
                    <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{calculateReadTime(exp.content)}</span>
                    </div>
                    {/* {exp.created_at && (
                        <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <rect height="18" rx="2" width="18" x="3" y="4" />
                                <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            <span>{exp.schedule}</span>
                        </div>
                    )} */}
                    <p className="text-gray-800 text-sm mb-2 line-clamp-2">
                        {exp.excerpt}
                    </p>
                    <Link className="text-black font-bold text-base mt-2 underline" href={`/blogs/${exp.slug}`}>
                        Read More
                    </Link>
                </div>
            ))}
        </div>
        <button className="border border-black px-6 md:px-8 py-2 md:py-3 text-black tracking-widest font-medium uppercase text-xs md:text-base hover:bg-black hover:text-white transition">
            Discover More
        </button>
    </>
}