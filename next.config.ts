import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // "Collections" was renamed to "Series"; keep old links and search results working.
  async redirects() {
    return [{ source: "/collections/:slug", destination: "/series/:slug", permanent: true }];
  },
};

export default nextConfig;
