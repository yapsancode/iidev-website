import Link from "next/link";
import { Ghost, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_50%)]" />
      <div className="relative z-10 max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Ghost className="h-12 w-12 text-emerald-300" aria-hidden="true" />
        </div>
        <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
          Error 404
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
          The page you are looking for may have moved, or the address may be incorrect.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-white bg-white px-7 py-3 font-semibold text-black transition-colors hover:bg-emerald-300"
          >
            <Home className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border-2 border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:border-white"
          >
            <Search className="h-4 w-4" />
            View services
          </Link>
        </div>
      </div>
    </main>
  );
}
