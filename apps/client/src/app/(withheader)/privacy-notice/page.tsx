import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Privacy notice explaining how Manu Maharani Resort & Spa collects, uses, and protects your personal data.",
    title: "Privacy Notice | Manu Maharani Resort & Spa",
};

export default function PrivacyNoticePage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className="font-thin tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Privacy Notice
                    </h1>
                    <p className="mt-4 font-serif text-base text-[#5a5a5a] md:text-lg">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">Information We Collect</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We collect information you provide directly to us when you make a reservation, enquire about our services, sign up for our newsletter, or communicate with us. This may include your name, email address, phone number, postal address, payment information, and any other information you choose to provide.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">How We Use Your Information</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Process and manage your reservations and bookings</li>
                            <li>Communicate with you about your stay and our services</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our website and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">Data Sharing</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">Data Security</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">Your Rights</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing of your data. To exercise any of these rights, please contact us through our contact page.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 font-thin tracking-widest text-xl uppercase text-[#2b2b2b]">Contact</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            If you have any questions about this privacy notice or our data practices, please contact us via our contact page or at the front desk.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
