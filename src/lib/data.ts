import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";

// Lecturas públicas cacheadas. Las acciones del panel invalidan estas etiquetas con updateTag().

export async function getServices() {
  "use cache";
  cacheLife("days");
  cacheTag("services");
  return db.service.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export async function getService(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("services");
  return db.service.findUnique({ where: { slug } });
}

export async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    omit: { content: true },
  });
}

export async function getPost(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return db.post.findFirst({ where: { slug, published: true } });
}

export async function getTestimonials() {
  "use cache";
  cacheLife("hours");
  cacheTag("testimonials");
  return db.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" } });
}

export async function getTestimonialStats() {
  "use cache";
  cacheLife("hours");
  cacheTag("testimonials");
  const agg = await db.testimonial.aggregate({
    where: { approved: true },
    _avg: { rating: true },
    _count: true,
  });
  return { average: agg._avg.rating ?? 5, count: agg._count };
}

export async function getGallery() {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  return db.galleryCase.findMany({ orderBy: { order: "asc" } });
}

export async function getHappySmilesCount() {
  "use cache";
  cacheLife("hours");
  cacheTag("appointments");
  // Base histórica de la clínica + citas completadas registradas en la plataforma.
  const completed = await db.appointment.count({ where: { status: "COMPLETADA" } });
  return 2480 + completed;
}
