import Link from "next/link";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { countEnquiriesWaiting } from "@/lib/leads/data";
import { InternalNav } from "@/components/internal/InternalNav";
import { InternalPwaRegister } from "@/components/internal/InternalPwaRegister";

export const dynamic = "force-dynamic";

async function newEnquiries(): Promise<number> {
  try {
    return (await countEnquiriesWaiting()).new_enquiries;
  } catch {
    return 0;
  }
}

export default async function InternalAppLayout({ children }: { children: React.ReactNode }) {
  const [user, enquiries] = await Promise.all([requireInternalUser(), newEnquiries()]);
  const initials = user.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <>
      <InternalPwaRegister />
      <a href="#main" className="sr-only z-50 bg-os-accent px-4 py-3 text-os-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-os-line bg-os-ground">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Link href="/internal" className="flex shrink-0 items-baseline gap-2">
            <span className="font-os-display text-[1.375rem] leading-none tracking-[-0.01em]">IIDev</span>
            <span className="text-[13px] text-os-muted">Sales</span>
          </Link>
          <InternalNav enquiries={enquiries} />
          <Link
            href="/internal/settings"
            aria-label={`Settings, signed in as ${user.full_name}`}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center bg-os-well text-xs font-medium transition-colors hover:bg-os-line"
          >
            {initials}
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 pb-32 pt-7 sm:px-6 lg:pb-20">
        {children}
      </main>
      <InternalNav enquiries={enquiries} mobile />
    </>
  );
}
