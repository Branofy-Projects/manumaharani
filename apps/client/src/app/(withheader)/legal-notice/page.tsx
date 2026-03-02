import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Legal notice and terms of use for Manu Maharani Resort & Spa.",
    title: "Legal Notice | Manu Maharani Resort & Spa",
};

export default function LegalNoticePage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className=" tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Legal Notice
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Terms of Use</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Welcome to the Manu Maharani Resort & Spa website. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Intellectual Property</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            All content on this website, including but not limited to text, graphics, logos, images, photographs, audio clips, digital downloads, and data compilations, is the property of Manu Maharani Resort & Spa or its content suppliers and is protected by Indian and international copyright laws. The compilation of all content on this site is the exclusive property of Manu Maharani Resort & Spa.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Limitation of Liability</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort & Spa shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this website or the performance of the products, even if Manu Maharani Resort & Spa has been advised of the possibility of such damages. Applicable law may not allow the limitation or exclusion of liability or incidental or consequential damages, so the above limitation or exclusion may not apply to you.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Governing Law</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Uttarakhand, India.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Changes to Terms</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort & Spa reserves the right to modify these terms at any time. We recommend that visitors review this page periodically for any changes. Your continued use of the website following the posting of changes will mean you accept those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Contact</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            If you have any questions regarding this legal notice, please contact us at our front desk or via our contact page.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
