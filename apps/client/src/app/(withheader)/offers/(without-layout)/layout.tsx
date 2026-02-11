import Image from "next/image";

export default function OffersLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen pt-[72px] md:pt-[88px] pb-12">
            {/* Hero / Membership Section */}
            <section className="w-full max-w-screen-xl mx-auto px-4 xl:px-0 mb-16">
                <div className="grid pt-4 grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    <div className="flex flex-col lg:col-span-2 items-start gap-6 max-w-xl">
                        <h1 className="text-4xl font-serif font-light tracking-wide uppercase">
                            Offers
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-serif leading-tight">
                            Become a Member to Get the Goods
                        </h2>
                        <p className="text-gray-600 text-lg font-sans">
                            Manu Maharani Rewards™ members receive personalized offers, the
                            guaranteed lowest hotel rates, special entertainment deals and
                            more.
                        </p>
                    </div>
                    <div className="relative w-full lg:col-span-3 h-[200px] md:h-[280px] lg:h-[360px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            alt="Membership Benefits"
                            className="object-cover object-center"
                            fill
                            src="https://thelibrary.mgmresorts.com/transform/2sXDQHygCqH31gRb/TCO159308211.jpg"
                        />
                    </div>
                </div>
            </section>

            {/* Offers List Section */}
            <section className="max-w-screen-xl w-full mx-auto px-4 xl:px-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-t border-gray-300 pt-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-light uppercase tracking-wide mb-6">
                            Manu Maharani Resorts Offers
                        </h2>
                        {/* <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-black text-white border border-black rounded-full px-5 py-2 text-sm font-medium transition-colors uppercase tracking-widest">
                  <Check className="w-4 h-4" />
                  All
                </button>
                <button className="bg-transparent text-gray-800 border border-gray-400 rounded-full px-5 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white hover:border-black uppercase tracking-widest">
                  Hotel
                </button>
                <button className="bg-transparent text-gray-800 border border-gray-400 rounded-full px-5 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white hover:border-black uppercase tracking-widest">
                  Entertainment
                </button>
              </div> */}
                    </div>
                    {/* <Link
              className="text-gray-600 hover:text-black underline text-sm md:self-end font-medium uppercase tracking-widest"
              href="#"
            >
              View all Offers
            </Link> */}
                </div>
            </section>
            {children}
        </main>
    )
}