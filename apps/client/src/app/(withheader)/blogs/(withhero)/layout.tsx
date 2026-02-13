import Image from "next/image";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          alt="Wedding Blog"
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
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
      {children}
    </main>
  );
}
