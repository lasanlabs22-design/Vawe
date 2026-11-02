import type { MetadataRoute } from "next";
import { collections } from "@/lib/collections";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/gallery/mirrors`, changeFrequency: "monthly", priority: 0.8 },
    ...collections.map((c) => ({
      url: `${site.url}/collections/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
