import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Internal OS", template: "%s | iidev Internal OS" },
  robots: { index: false, follow: false, nocache: true },
};

export default function InternalRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-sans">{children}</div>;
}
