import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getPosts()]);
  const pages = ["", "/servicios", "/galeria", "/blog", "/agendar", "/contacto", "/rincon-infantil", "/mi-cita"];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${BASE}/servicios/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
