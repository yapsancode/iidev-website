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
      <Link href={`/internal/prospects/${id}`} className="inline-flex items-center gap-2 font-sans text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white"><ArrowLeft className="h-4 w-4" />Back to {found.prospect.business_name}</Link>
      <h1 className="mt-5 font-sans text-3xl font-bold tracking-tight">Edit prospect</h1>
      <ProspectForm action={saveProspect} prospect={found.prospect} error={error} submitLabel="Save changes" />
    </>
  );
}
