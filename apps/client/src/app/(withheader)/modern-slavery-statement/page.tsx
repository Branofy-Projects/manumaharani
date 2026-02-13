import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Modern slavery statement for Manu Maharani Resort & Spa, outlining our commitment to ethical practices.",
    title: "Modern Slavery Statement | Manu Maharani Resort & Spa",
};

export default function ModernSlaveryStatementPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className=" tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Modern Slavery Statement
                    </h1>
                    <p className="mt-4 font-serif text-base text-[#5a5a5a] md:text-lg">
                        Financial Year 2025–2026
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Introduction</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort & Spa is committed to preventing acts of modern slavery and human trafficking from occurring within our business and supply chain. This statement sets out the steps we have taken and continue to take to ensure that modern slavery is not taking place within our operations.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Our Business</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort & Spa is a hospitality establishment located in the Jim Corbett National Park region of Uttarakhand, India. We provide accommodation, dining, event hosting, and recreational services. Our workforce includes permanent staff and seasonal employees, all of whom are employed directly or through reputable agencies.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Our Policies</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We are committed to ensuring that there is no modern slavery or human trafficking in our supply chains or in any part of our business. Our policies reflect our commitment to acting ethically and with integrity in all our business relationships:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>All employees are paid at least the applicable minimum wage</li>
                            <li>We verify the identity and right to work of all employees</li>
                            <li>We do not use forced, bonded, or involuntary labour</li>
                            <li>All employment is voluntary and employees are free to leave</li>
                            <li>We prohibit the use of child labour in any form</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Supply Chain</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We expect the same high standards from our suppliers and contractors. As part of our due diligence processes, we evaluate new suppliers before entering into agreements and periodically review existing suppliers. We work with local suppliers wherever possible and prioritise partnerships with businesses that share our ethical values.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Training and Awareness</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We provide training to our management team and relevant staff to ensure they understand the signs of modern slavery and know how to report concerns. We encourage all employees to report any concerns and provide appropriate channels for doing so without fear of reprisal.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Reporting Concerns</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            If you have any concerns about modern slavery or human trafficking in relation to our business or supply chain, please contact us through our contact page. All reports will be taken seriously and investigated appropriately.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
