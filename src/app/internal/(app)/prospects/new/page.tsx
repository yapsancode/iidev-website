import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProspectForm } from "@/components/internal/ProspectForm";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { createProspectFromForm } from "../../../prospect-actions";

export const metadata: Metadata = { title: "Add prospect" };

export default async function NewProspectPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireInternalUser();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  return (
    <>
      <Link href="/internal/prospects" className="inline-flex min-h-10 items-center gap-2 text-[13px] text-os-muted hover:text-os-ink"><ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />Prospects</Link>
      <h1 className="mt-2 font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] sm:text-5xl">Add a prospect</h1>
      <p className="mt-3 text-[15px] text-os-muted">Only the business name is needed. The audit fills in the rest.</p>
      <ProspectForm action={createProspectFromForm} error={error} submitLabel="Add prospect" />
    </>
  );
}
