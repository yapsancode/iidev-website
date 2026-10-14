import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IIDev Sales",
    short_name: "IIDev Sales",
    description: "Founder-only sales dashboard for IIDev Studio: today's outreach, prospects and website enquiries.",
    start_url: "/internal",
    scope: "/internal",
    display: "standalone",
    background_color: "#eef0f3",
    theme_color: "#eef0f3",
    orientation: "portrait-primary",
    icons: [{ src: "/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
  };
}
