import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f1] px-4 text-center">
            <div className="space-y-6">
                <h1 className="font-serif text-9xl font-light text-[#2b2b2b]">404</h1>
                <h2 className="font-serif text-3xl font-light uppercase tracking-widest text-[#2b2b2b]">
                    Page Not Found
                </h2>
                <div className="mx-auto h-px w-24 bg-[#a88b4d]" />
                <p className="mx-auto max-w-md text-gray-600">
                    We couldn't find the page you were looking for. It might have been
                    removed, renamed, or doesn't exist.
                </p>
                <div className="pt-4">
                    <Link
                        className="inline-block border border-[#2b2b2b] bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#2b2b2b] transition-all duration-300 hover:bg-[#2b2b2b] hover:text-white"
                        href="/"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
