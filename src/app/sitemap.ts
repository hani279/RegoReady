import type { MetadataRoute } from "next";
import { SELLER_LIST } from "@/lib/fees/sellers";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/calculator",
    "/check",
    "/pricing",
    "/fees",
    "/guides",
    "/sources",
    "/report/sample",
    ...SELLER_LIST.map((s) => `/fees/${s.id}`),
    ...GUIDES.map((g) => `/guides/${g.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
