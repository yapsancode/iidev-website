import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/internal", "/api/"],
    }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
