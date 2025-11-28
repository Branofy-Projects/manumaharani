import Image from "next/image";
import Link from "next/link";

// This would typically come from a CMS or database
type ContentBlock =
  | { heading: string; type: "heading" }
  | { image: string; type: "image" }
  | { text: string; type: "paragraph" }
  | { text: string; type: "quote" };

const blogData: Record<
  string,
  {
    author: string;
    category: string;
    content: ContentBlock[];
    date: string;
    image: string;
    readTime: string;
    title: string;
  }
> = {
  "real-wedding-priya-rahul-jim-corbett": {
    author: "Manu Maharani Team",
    category: "Wedding Stories",
    content: [
      {
        text: "When Priya and Rahul decided to tie the knot, they knew they wanted something extraordinary – a celebration that would blend their love for nature with the grandeur of traditional Indian weddings. Their search led them to Manu Maharani, nestled in the heart of Jim Corbett, where the wilderness meets luxury.",
        type: "paragraph",
      },
      {
        heading: "The Beginning of a Beautiful Journey",
        type: "heading",
      },
      {
        text: "Priya, a wildlife photographer from Mumbai, and Rahul, an architect from Delhi, met during a tiger safari in Ranthambore. Their shared passion for wildlife and adventure made Jim Corbett the perfect location for their wedding. 'We wanted our guests to experience the magic of the jungle while celebrating our union,' says Priya.",
        type: "paragraph",
      },
      {
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
      {
        heading: "The Venue: Where Wilderness Meets Elegance",
        type: "heading",
      },
      {
        text: "Manu Maharani provided the perfect canvas for their dream wedding. The resort's sprawling lawns, surrounded by dense forests and overlooking the Kosi River, offered a breathtaking backdrop for their ceremonies. The couple chose to have their mehendi ceremony in the garden, sangeet by the poolside, and the wedding ceremony on the main lawn with the Himalayas visible in the distance.",
        type: "paragraph",
      },
      {
        text: "The resort's team worked closely with the couple to ensure every detail was perfect. From the floral arrangements featuring local wildflowers to the traditional Kumaoni cuisine served alongside contemporary dishes, every element reflected the couple's vision of a celebration rooted in nature.",
        type: "paragraph",
      },
      {
        heading: "The Celebrations: Three Days of Magic",
        type: "heading",
      },
      {
        text: "Day 1 - Mehendi & Welcome Dinner: The celebrations kicked off with an intimate mehendi ceremony. Guests were treated to traditional henna artists while enjoying refreshing drinks and canapés. The evening concluded with a welcome dinner featuring a bonfire and live folk music from local Kumaoni artists.",
        type: "paragraph",
      },
      {
        image:
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
      {
        text: "Day 2 - Sangeet Night: The sangeet was a spectacular affair with performances by family and friends. The couple had choreographed a special dance that told their love story, from their first meeting in Ranthambore to their engagement in the Himalayas. The night ended with a DJ set that had everyone dancing under the stars.",
        type: "paragraph",
      },
      {
        text: "Day 3 - The Wedding: The wedding day began with a traditional haldi ceremony, followed by preparations for the main event. As the sun began to set, Rahul arrived on a decorated elephant, a nod to their love for wildlife. Priya made a stunning entrance in a traditional red lehenga, walking down an aisle lined with marigolds and roses.",
        type: "paragraph",
      },
      {
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
      {
        heading: "The Details That Made It Special",
        type: "heading",
      },
      {
        text: "What set this wedding apart were the thoughtful details that reflected the couple's personalities and values. Instead of traditional return gifts, they donated to wildlife conservation organizations in each guest's name. The wedding favors were seed packets with native wildflower seeds, encouraging guests to plant them and think of the couple.",
        type: "paragraph",
      },
      {
        text: "The couple also organized an early morning safari for interested guests, allowing them to experience the magic of Jim Corbett National Park. Many guests cited this as the highlight of their trip, spotting deer, elephants, and various bird species in their natural habitat.",
        type: "paragraph",
      },
      {
        text: "'Manu Maharani gave us the perfect blend of luxury and wilderness. Our guests are still talking about the wedding, and we couldn't have asked for a more magical setting for the beginning of our journey together.' - Priya & Rahul",
        type: "quote",
      },
      {
        heading: "Planning Your Own Destination Wedding",
        type: "heading",
      },
      {
        text: "Inspired by Priya and Rahul's story? Here are some tips for planning your own destination wedding at Manu Maharani:",
        type: "paragraph",
      },
      {
        text: "1. Book Early: Destination weddings require more planning time. Start at least 8-12 months in advance to secure your preferred dates and ensure all arrangements can be made perfectly.",
        type: "paragraph",
      },
      {
        text: "2. Visit the Venue: If possible, visit Manu Maharani before your wedding to understand the space and meet the team. This helps in better planning and visualization.",
        type: "paragraph",
      },
      {
        text: "3. Consider Your Guests: Provide detailed information about travel, accommodation, and activities. Many couples create a wedding website with all necessary details.",
        type: "paragraph",
      },
      {
        text: "4. Embrace the Location: Incorporate local elements into your celebration – from cuisine to decor to entertainment. It makes the experience more authentic and memorable.",
        type: "paragraph",
      },
      {
        text: "5. Plan Activities: Organize activities for guests who arrive early or stay longer. Safari tours, nature walks, and spa sessions are great options at Manu Maharani.",
        type: "paragraph",
      },
      {
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
      {
        heading: "Why Choose Manu Maharani",
        type: "heading",
      },
      {
        text: "Manu Maharani offers a unique combination of natural beauty, luxury amenities, and exceptional service. Located in the buffer zone of Jim Corbett National Park, it provides an unparalleled setting for destination weddings. The experienced team handles everything from accommodation and catering to decor and entertainment, allowing you to focus on enjoying your special day.",
        type: "paragraph",
      },
      {
        text: "Whether you're planning an intimate gathering or a grand celebration, Manu Maharani can accommodate weddings of all sizes. The resort offers multiple venue options, luxurious accommodations, world-class dining, and a range of activities to keep your guests entertained throughout their stay.",
        type: "paragraph",
      },
      {
        text: "Ready to start planning your dream destination wedding? Contact our wedding planning team to discuss your vision and learn more about our wedding packages.",
        type: "paragraph",
      },
    ],
    date: "December 15, 2024",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    readTime: "8 min read",
    title: "Real Wedding Stories: Priya & Rahul at Jim Corbett",
  },
};

const relatedPosts = [
  {
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
    title: "The Ultimate Guide to Destination Weddings in Jim Corbett",
  },
  {
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=600&q=80",
    title: "Wedding Venues at Manu Maharani: A Complete Tour",
  },
  {
    id: "real-wedding-priya-rahul-jim-corbett",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    title: "Planning a Multi-Day Wedding Celebration",
  },
];

export default async function BlogPost({
  params,
}: {
  params: Promise<{ "blog-id": string }>;
}) {
  const { "blog-id": blogId } = await params;
  const post = blogData[blogId];

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
          src={post.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className={`mb-8 flex items-center gap-2 text-sm text-gray-500`}>
          <Link className="hover:text-gray-900" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="hover:text-gray-900" href="/blogs">
            Blogs
          </Link>
          <span>/</span>
          <span className="text-gray-900">{post.category}</span>
        </nav>

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
          className={`mb-6 text-4xl font-thin leading-tight text-gray-900 md:text-5xl lg:text-6xl`}
        >
          {post.title}
        </h1>

        {/* Meta Info */}
        <div
          className={`mb-12 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 text-sm text-gray-600`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">By</span>
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2
                    className={`mb-6 mt-12 text-3xl font-thin text-gray-900`}
                    key={index}
                  >
                    {"heading" in block ? block.heading : ""}
                  </h2>
                );
              case "image":
                return (
                  <div
                    className="relative my-8 h-[250px] w-full overflow-hidden rounded-lg sm:h-[350px] md:my-12 md:h-[500px]"
                    key={index}
                  >
                    <Image
                      alt="Wedding moment"
                      className="object-cover object-center"
                      fill
                      src={"image" in block ? block.image : ""}
                    />
                  </div>
                );
              case "paragraph":
                return (
                  <p
                    className={`mb-6 text-lg font-thin leading-relaxed text-gray-700`}
                    key={index}
                  >
                    {"text" in block ? block.text : ""}
                  </p>
                );
              case "quote":
                return (
                  <blockquote
                    className={`my-12 border-l-4 border-gray-900 bg-gray-50 p-8 text-xl italic leading-relaxed text-gray-800`}
                    key={index}
                  >
                    {"text" in block ? block.text : ""}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Share Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
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
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg bg-gray-50 p-8 text-center md:p-12">
          <h3
            className={`mb-4 text-3xl font-thin tracking-wider text-gray-900`}
          >
            Ready to Plan Your Dream Wedding?
          </h3>
          <p className={`mb-8 text-lg font-thin text-gray-600`}>
            Let our expert team help you create an unforgettable celebration at
            Manu Maharani.
          </p>
          <Link
            className={`inline-block rounded-lg bg-gray-900 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-gray-800`}
            href="/contact"
          >
            Contact Our Wedding Team
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className={`mb-12 text-center text-3xl font-thin tracking-widest text-gray-900`}
          >
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                href={`/blogs/${relatedPost.id}`}
                key={relatedPost.id}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    alt={relatedPost.title}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    fill
                    src={relatedPost.image}
                  />
                </div>
                <div className="p-6">
                  <h3
                    className={`text-lg font-light leading-tight text-gray-900 transition-colors group-hover:text-gray-600`}
                  >
                    {relatedPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
