export default function GalleryLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-200 animate-pulse" />

      {/* Tabs skeleton */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"
                key={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              className="break-inside-avoid rounded-lg bg-gray-200 animate-pulse"
              key={i}
              style={{ height: `${250 + (i % 3) * 80}px` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
