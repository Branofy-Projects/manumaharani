import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    category: "Wedding Stories",
    date: "December 15, 2024",
    excerpt:
      "Discover the enchanting tale of Priya and Rahul's destination wedding at Manu Maharani, where tradition meets luxury in the heart of Jim Corbett.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    readTime: "8 min read",
    title: "Real Wedding Stories: Priya & Rahul at Jim Corbett",
  },
  {
    category: "Destination Weddings",
    date: "December 10, 2024",
    excerpt:
      "Planning a destination wedding in the wilderness? Here's your complete guide to hosting an unforgettable celebration at Manu Maharani.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    readTime: "10 min read",
    title: "The Ultimate Guide to Destination Weddings in Jim Corbett",
  },
  {
    category: "Venue Spotlight",
    date: "December 5, 2024",
    excerpt:
      "Explore the stunning wedding venues at Manu Maharani, from intimate garden ceremonies to grand ballroom receptions.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    title: "Wedding Venues at Manu Maharani: A Complete Tour",
  },
  {
    category: "Wedding Planning",
    date: "November 28, 2024",
    excerpt:
      "From mehendi to reception, discover how to plan the perfect multi-day wedding celebration in the wilderness.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    readTime: "12 min read",
    title: "Planning a Multi-Day Wedding Celebration",
  },
  {
    category: "Real Weddings",
    date: "November 20, 2024",
    excerpt:
      "Ananya and Vikram's intimate wedding celebration combined modern elegance with traditional ceremonies in a breathtaking natural setting.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min read",
    title: "An Intimate Affair: Ananya & Vikram's Wedding",
  },
  {
    category: "Wedding Decor",
    date: "November 15, 2024",
    excerpt:
      "Get inspired by these stunning wedding decoration ideas that blend seamlessly with the natural beauty of Jim Corbett.",
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    readTime: "9 min read",
    title: "Nature-Inspired Wedding Decoration Ideas",
  },
];

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          alt="Wedding Blog"
          className="object-cover object-center"
          fill
          priority
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 pt-[80px] flex items-center justify-center">
          <div className="text-center">
            <h1
              className={`mb-4 text-4xl px-16 font-thin tracking-[0.2em] md:tracking-[0.3em] uppercase text-white md:text-5xl lg:text-6xl`}
            >
              Lakeside Stories
            </h1>
            <p className={`text-lg font-light text-white/90 mt-10 md:text-xl`}>
              A space where we share stories, guides, and moments from our
              jungle–lake sanctuary in Jim Corbett.
            </p>
          </div>
        </div>
      </section>

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
          {blogPosts.map((post) => (
            <Link
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
              href={`/blogs/${post.id}`}
              key={post.id}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  alt={post.title}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  fill
                  src={post.image}
                />
                <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div
                  className={`mb-3 flex items-center gap-4 text-xs text-gray-500`}
                >
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3
                  className={`mb-3 text-xl font-light leading-tight text-gray-900 transition-colors group-hover:text-gray-600`}
                >
                  {post.title}
                </h3>
                <p className={`mb-4 text-sm leading-relaxed text-gray-600`}>
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
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
          >
            Previous
          </button>
          <button
            className={`rounded-lg bg-gray-900 px-4 py-2 text-sm text-white`}
          >
            1
          </button>
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
          >
            2
          </button>
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
          >
            3
          </button>
          <button
            className={`rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white`}
          >
            Next
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
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
      </section>
    </main>
  );
}
