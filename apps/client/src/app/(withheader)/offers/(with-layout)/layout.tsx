export default function OfferDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-[72px] md:pt-[88px]">
      {children}
    </div>
  );
}
