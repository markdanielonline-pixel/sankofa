import type { MetadataRoute } from "next"

const BASE = "https://sankofapublishers.com"
const PAGES = ["", "/how-it-works", "/what-we-publish", "/distribution", "/royalties", "/services", "/faq", "/compare", "/submissions", "/about", "/contact", "/policies", "/board_of_advisors", "/governance", "/media", "/partnership", "/support"]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(p => ({ url: BASE + p, lastModified: new Date(), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }))
}
