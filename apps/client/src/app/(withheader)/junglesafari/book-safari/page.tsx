import SafariBookingForm from "@/components/Safari/SafariBookingForm";

export default async function BookSafariPage(props: {
  searchParams: Promise<{ zone: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="w-full overflow-x-hidden bg-[#f3eee7] pt-[72px] md:pt-[88px]">
      <SafariBookingForm zone={searchParams.zone} />
    </main>
  );
}
