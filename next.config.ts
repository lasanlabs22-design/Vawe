import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // Keep old links and search results working: "Collections" was renamed to "Series", and the
  // mirror gallery was retired in favour of the mirrors series page.
  async redirects() {
    return [
      { source: "/collections/:slug", destination: "/series/:slug", permanent: true },
      { source: "/gallery/mirrors", destination: "/series/mirrors", permanent: true },
    ];
  },
};

export default nextConfig;
