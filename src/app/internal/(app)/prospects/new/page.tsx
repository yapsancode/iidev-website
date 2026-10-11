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
      <Link href="/internal/prospects" className="inline-flex items-center gap-2 font-sans text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white"><ArrowLeft className="h-4 w-4" />All prospects</Link>
      <h1 className="mt-5 font-sans text-3xl font-bold tracking-tight">Add a prospect</h1>
      <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">Only the business name is needed. The audit fills in the rest.</p>
      <ProspectForm action={createProspectFromForm} error={error} submitLabel="Add prospect" />
    </>
  );
}
