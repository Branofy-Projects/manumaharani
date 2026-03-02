import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Accessibility policy for Manu Maharani Resort & Spa website and facilities.",
    title: "Accessibility Policy | Manu Maharani Resort & Spa",
};

export default function AccessibilityPolicyPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className=" tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Accessibility Policy
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Our Commitment</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Manu Maharani Resort & Spa is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Web Accessibility</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We strive to ensure that our website meets the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone. Our efforts include providing text alternatives for non-text content, ensuring sufficient colour contrast, making all functionality available from a keyboard, and providing clear navigation.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">On-Property Accessibility</h2>
                        <p className="mb-4 font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            At our resort, we strive to accommodate guests with varying needs. Our accessibility features include:
                        </p>
                        <ul className="list-disc space-y-2 pl-6 font-serif text-base text-[#5a5a5a] md:text-lg">
                            <li>Wheelchair-accessible common areas and pathways</li>
                            <li>Accessible room options available upon request</li>
                            <li>Accessible parking spaces near the main entrance</li>
                            <li>Staff trained to assist guests with special needs</li>
                            <li>Accessible dining options at our restaurant</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Ongoing Efforts</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We view accessibility as an ongoing effort and are continually seeking to improve. We regularly review our website and facilities to identify and address any barriers to accessibility. Our team undergoes regular training to ensure we maintain high standards of inclusivity.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Feedback</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            We welcome your feedback on the accessibility of our website and resort. If you encounter any accessibility barriers or have suggestions for improvement, please contact us through our contact page. We take your feedback seriously and will make every effort to address your concerns promptly.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
