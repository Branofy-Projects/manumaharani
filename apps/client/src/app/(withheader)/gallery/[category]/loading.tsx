export default function GalleryCategoryLoading() {
  return (
    <main className="min-h-screen">
      <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-200 animate-pulse" />

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              className="rounded-lg bg-gray-200 animate-pulse"
              key={i}
              style={{ height: `${250 + (i % 3) * 80}px` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
