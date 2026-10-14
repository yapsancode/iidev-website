import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProspectForm } from "@/components/internal/ProspectForm";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getProspect } from "@/lib/prospects/data";
import { saveProspect } from "../../../../prospect-actions";

export const metadata: Metadata = { title: "Edit prospect" };

export default async function EditProspectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireInternalUser();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const found = await getProspect(id);
  if (!found) notFound();
  const error = typeof query.error === "string" ? query.error : undefined;
  return (
    <>
      <Link href={`/internal/prospects/${id}`} className="inline-flex min-h-10 items-center gap-2 text-[13px] text-os-muted hover:text-os-ink"><ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />Back to {found.prospect.business_name}</Link>
      <h1 className="mt-2 font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] sm:text-5xl">Edit prospect</h1>
      <ProspectForm action={saveProspect} prospect={found.prospect} error={error} submitLabel="Save changes" />
    </>
  );
}
