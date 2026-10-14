import Link from "next/link";

export default function InternalLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-md bg-os-paper p-6 sm:p-8">
        <p className="text-[13px] text-os-muted">IIDev Sales</p>
        <h1 className="mt-1 font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em]">Founders only</h1>
        <p className="mt-4 text-[15px]">
          Cloudflare asks for a founder&rsquo;s email before this area opens. You reached this page because the sign-in was not accepted.
        </p>
        <p className="mt-3 text-[13px] text-os-muted">
          If you are a founder and see this after signing in, check that your email is on the Cloudflare Access list and in the founder list in the database.
        </p>
        <Link href="/" className="mt-6 inline-block text-[13px] text-os-accent underline-offset-4 hover:underline">Back to the public website</Link>
      </section>
    </main>
  );
}
