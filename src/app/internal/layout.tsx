import type { Metadata } from "next";
import "./internal.css";

export const metadata: Metadata = {
  title: { default: "Sales", template: "%s | IIDev Sales" },
  robots: { index: false, follow: false, nocache: true },
};

export default function InternalRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="internal-os min-h-screen font-os">{children}</div>;
}
