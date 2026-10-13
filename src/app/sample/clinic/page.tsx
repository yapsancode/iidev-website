import type { Metadata } from "next";
import { ClinicSiteView } from "@/components/sample/ClinicSiteView";
import { sampleClinic } from "@/lib/sample/clinic";

// A made-up clinic must never show up in Google as if it were real.
export const metadata: Metadata = {
  title: "Sample clinic website",
  description: "A sample of the clinic websites we build. Klinik Contoh is not a real clinic.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function SampleClinicPage({ searchParams }: Props) {
  const language = (await searchParams).lang === "ms" ? "ms" : "en";
  return <ClinicSiteView site={sampleClinic(language)} />;
}
