import SafariBookingCTA from "@/components/Safari/SafariBookingCTA";
import SafariFAQ from "@/components/Safari/SafariFAQ";
import SafariGuidelines from "@/components/Safari/SafariGuidelines";
import SafariHero from "@/components/Safari/SafariHero";
import SafariIntro from "@/components/Safari/SafariIntro";
import SafariZones from "@/components/Safari/SafariZones";

export default function JungleSafariPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#f3eee7] pt-[72px] md:pt-[88px]">
      <SafariHero />
      <SafariIntro />
      {/* <SafariTypes /> */}
      <SafariZones />
      <SafariGuidelines />
      <SafariBookingCTA />
      <SafariFAQ />

      {/* Bottom Info Banner */}
      <section className="bg-gray-900 py-8 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            Information adapted from the official Corbett Tiger Reserve. For the
            most current information, please visit{" "}
            <a
              className="underline hover:text-gray-300"
              href="https://corbettgov.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              corbettgov.org
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
