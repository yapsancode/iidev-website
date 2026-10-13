import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicSiteView } from "@/components/sample/ClinicSiteView";
import { getProspectByPreviewToken } from "@/lib/prospects/data";
import { tokenFromRef } from "@/lib/prospects/preview";
import { isHealthcare, mockupClinic } from "@/lib/sample/clinic";

export const dynamic = "force-dynamic";

// Private, like the preview page it belongs to.
export const metadata: Metadata = { title: "Sketch", robots: { index: false, follow: false } };

type Props = { params: Promise<{ ref: string }> };

/** A sketch of this prospect's future website. It exists only while their preview link does. */
export default async function SketchPage({ params }: Props) {
  const token = tokenFromRef((await params).ref);
  const prospect = token ? await getProspectByPreviewToken(token) : null;
  if (!prospect?.mockup || !isHealthcare(prospect.category)) notFound();
  return <ClinicSiteView site={mockupClinic(prospect, prospect.mockup)} />;
}
