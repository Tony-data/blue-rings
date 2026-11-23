import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
