import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/internal", "/api/"],
    }],
    sitemap: "https://iidevstudio.com/sitemap.xml",
  };
}
