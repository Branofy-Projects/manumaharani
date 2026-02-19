import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Privacy Policy for Manu Maharani Resort, Jim Corbett — learn how we collect, use, disclose, and safeguard your personal information.",
    title: "Privacy Policy | Manu Maharani Resort & Spa",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className="tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 font-serif text-lg text-[#5a5a5a]">
                        Manu Maharani Resort, Jim Corbett
                    </p>
                    <p className="mt-4 font-serif text-base text-[#5a5a5a] md:text-lg">
                        Last Updated: 12th February 2026
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    {/* 1. Introduction */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">1. Introduction</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort is committed to protecting the privacy and personal information of our guests, website visitors, and partners. This Privacy Policy describes how we collect, use, disclose, and safeguard information when you visit our website, make reservations, or interact with us.
                        </p>
                        <p className="mt-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            By using our website or services, you agree to the terms outlined in this policy.
                        </p>
                    </section>

                    {/* 2. Information We Collect */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">2. Information We Collect</h2>

                        <h3 className="mb-3 font-serif text-lg font-semibold text-[#2b2b2b]">a) Personal Information</h3>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We may collect the following information when voluntarily provided by you:
                        </p>
                        <ul className="mb-6 list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Full name</li>
                            <li>Contact details (email address, phone number, postal address)</li>
                            <li>Identification details required for booking/check-in</li>
                            <li>Payment and billing details</li>
                            <li>Travel preferences or special requests</li>
                            <li>Corporate or agency details (if applicable)</li>
                        </ul>

                        <h3 className="mb-3 font-serif text-lg font-semibold text-[#2b2b2b]">b) Automatically Collected Information</h3>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            When visiting our website, we may automatically collect:
                        </p>
                        <ul className="mb-6 list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>IP address</li>
                            <li>Browser type and device information</li>
                            <li>Pages visited and interaction data</li>
                            <li>Cookies and tracking information</li>
                        </ul>

                        <h3 className="mb-3 font-serif text-lg font-semibold text-[#2b2b2b]">c) Information from Third Parties</h3>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We may receive information from:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Online Travel Agencies (OTAs)</li>
                            <li>Booking engines/payment gateways</li>
                            <li>Marketing or analytics providers</li>
                        </ul>
                    </section>

                    {/* 3. How We Use Your Information */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">3. How We Use Your Information</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We use collected information to:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Process reservations and guest services</li>
                            <li>Confirm bookings and communicate with guests</li>
                            <li>Personalize guest experience</li>
                            <li>Send promotional or marketing communications (with consent)</li>
                            <li>Improve website functionality and service quality</li>
                            <li>Meet legal or regulatory requirements</li>
                        </ul>
                    </section>

                    {/* 4. Sharing of Information */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">4. Sharing of Information</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We do not sell personal data. Information may be shared with trusted third parties only when necessary:
                        </p>
                        <ul className="mb-6 list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Payment processing providers</li>
                            <li>Booking/CRM systems</li>
                            <li>Marketing or analytics platforms</li>
                            <li>Government or legal authorities where required by law</li>
                        </ul>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            All third parties are expected to maintain appropriate confidentiality and security standards.
                        </p>
                    </section>

                    {/* 5. Cookies & Tracking Technologies */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">5. Cookies & Tracking Technologies</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Our website uses cookies to:
                        </p>
                        <ul className="mb-6 list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Enhance user experience</li>
                            <li>Analyze traffic and usage patterns</li>
                            <li>Support marketing and remarketing activities</li>
                        </ul>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            You may disable cookies via browser settings, though some site features may not function properly.
                        </p>
                    </section>

                    {/* 6. Data Security */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">6. Data Security</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We implement reasonable administrative, technical, and physical safeguards to protect personal information from unauthorized access, misuse, or disclosure. While we strive to protect your data, no digital transmission or storage system can be guaranteed 100% secure.
                        </p>
                    </section>

                    {/* 7. Data Retention */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">7. Data Retention</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Personal information is retained only as long as necessary to:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Fulfill service obligations</li>
                            <li>Comply with legal requirements</li>
                            <li>Resolve disputes</li>
                        </ul>
                    </section>

                    {/* 8. Your Rights */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">8. Your Rights</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Subject to applicable laws (including India&apos;s Digital Personal Data Protection Act, 2023), you may have the right to:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Request access to your personal data</li>
                            <li>Request corrections</li>
                            <li>Request deletion or withdrawal of consent</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    {/* 9. Third-Party Links */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">9. Third-Party Links</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Our website may contain links to external websites. We are not responsible for the privacy practices or content of those third-party sites.
                        </p>
                    </section>

                    {/* 10. Children's Privacy */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">10. Children&apos;s Privacy</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Our services are not directed toward individuals under the age of 18 without parental supervision. We do not knowingly collect personal data from minors.
                        </p>
                    </section>

                    {/* 11. Updates to This Policy */}
                    <section className="mb-10">
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">11. Updates to This Policy</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We reserve the right to update this Privacy Policy at any time. Updates will be posted on this page with a revised effective date.
                        </p>
                    </section>

                    {/* 12. Contact Us */}
                    <section>
                        <h2 className="mb-4 tracking-widest text-xl uppercase text-[#2b2b2b]">12. Contact Us</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            For questions, concerns, or data requests, please contact:{" "}
                            <a
                                className="text-[#a88b4d] underline transition-colors hover:text-[#2b2b2b]"
                                href="mailto:gmoffice@manumaharaniresorts.com"
                            >
                                gmoffice@manumaharaniresorts.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
