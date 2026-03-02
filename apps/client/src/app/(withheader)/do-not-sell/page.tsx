import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Learn about your rights regarding the sale of personal information at Manu Maharani Resort & Spa.",
    title: "Do Not Sell My Personal Information | Manu Maharani Resort & Spa",
};

export default function DoNotSellPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className=" tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Do Not Sell My Personal Information
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Your Privacy Rights</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            At Manu Maharani Resort & Spa, we respect your privacy and your right to control your personal data. Under applicable privacy laws, you have the right to opt out of the sale of your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Our Commitment</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We do not sell personal information of our guests or website visitors to third parties for monetary consideration. We may share certain information with service providers who help us operate our business, but these partners are contractually obligated to protect your data and use it only for the purposes we specify.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Information We May Share</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            In the course of operating our resort and website, we may share information with:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Payment processors to complete your transactions</li>
                            <li>Email service providers to send you booking confirmations</li>
                            <li>Analytics providers to help us improve our website</li>
                            <li>Government authorities when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">How to Submit a Request</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            If you would like to exercise your rights regarding the sale of your personal information, or if you have any questions about our data practices, please contact us through our contact page. We will respond to your request within the time frame required by applicable law.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
