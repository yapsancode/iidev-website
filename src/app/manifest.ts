import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iidev Internal OS",
    short_name: "iidev OS",
    description: "Founder-only lead intelligence and operations dashboard for iidev Studio.",
    start_url: "/internal",
    scope: "/internal",
    display: "standalone",
    background_color: "#eff0ee",
    theme_color: "#0d1712",
    orientation: "portrait-primary",
    icons: [{ src: "/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
  };
}
