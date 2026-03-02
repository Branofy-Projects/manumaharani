import type { Metadata } from "next";

export const metadata: Metadata = {
    description: "Manage your cookie preferences for the Manu Maharani Resort & Spa website.",
    title: "Cookie Preferences | Manu Maharani Resort & Spa",
};

export default function CookiePreferencesPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-b-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
                    <h1 className=" tracking-widest text-2xl uppercase text-[#2b2b2b] md:text-4xl">
                        Cookie Preferences
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-10 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">What Are Cookies</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site. Cookies help us personalise your experience and remember your preferences.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Essential Cookies</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site may not work as expected.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Analytics Cookies</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Marketing Cookies</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4  tracking-widest text-xl uppercase text-[#2b2b2b]">Managing Your Preferences</h2>
                        <p className="font-serif text-base leading-relaxed text-[#5a5a5a] md:text-lg">
                            You can manage your cookie preferences at any time through your browser settings. Most browsers allow you to refuse cookies or to accept cookies selectively. Please note that disabling cookies may affect the functionality of this and many other websites that you visit.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
