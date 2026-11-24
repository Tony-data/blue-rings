import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 75 is the default; 90 is allowed for the full-width banner photo so it stays sharp.
  images: {
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The investment logic copy (and footer links) are read from content/strategy.md at render time.
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
    "/investment-logic": ["./content/**/*"],
  },
  // Private site: tell crawlers not to index anything, even if a URL leaks.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
