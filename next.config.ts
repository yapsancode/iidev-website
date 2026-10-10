import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      // One address for visitors and for Google: the bare domain always goes to www.
      {
        source: "/:path*",
        has: [{ type: "host", value: "iidevstudio.com" }],
        destination: "https://www.iidevstudio.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
