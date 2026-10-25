"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";
import { fieldErrors, postSchema } from "@/lib/validation";
import type { FormState } from "./public";

const STATUSES = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"] as const;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, message: "Contraseña incorrecta" };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function setAppointmentStatus(id: number, status: string) {
  await requireAdmin();
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;
  await db.appointment.update({ where: { id }, data: { status } });
  updateTag("appointments");
  refresh();
}

export async function deleteAppointment(id: number) {
  await requireAdmin();
  await db.appointment.delete({ where: { id } });
  updateTag("appointments");
  refresh();
}

export async function toggleMessageRead(id: number, read: boolean) {
  await requireAdmin();
  await db.contactMessage.update({ where: { id }, data: { read } });
  refresh();
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await db.contactMessage.delete({ where: { id } });
  refresh();
}

export async function setTestimonialApproved(id: number, approved: boolean) {
  await requireAdmin();
  await db.testimonial.update({ where: { id }, data: { approved } });
  updateTag("testimonials");
  refresh();
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  await db.testimonial.delete({ where: { id } });
  updateTag("testimonials");
  refresh();
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const parsed = postSchema.safeParse({
    ...Object.fromEntries(formData),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) };
  }

  const clash = await db.post.findFirst({
    where: { slug: parsed.data.slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (clash) return { ok: false, message: "Ya existe un artículo con ese slug.", errors: { slug: ["Slug en uso"] } };

  if (id) await db.post.update({ where: { id }, data: parsed.data });
  else await db.post.create({ data: parsed.data });

  updateTag("posts");
  redirect("/admin/blog");
}

export async function togglePostPublished(id: number, published: boolean) {
  await requireAdmin();
  await db.post.update({ where: { id }, data: { published } });
  updateTag("posts");
  refresh();
}

export async function deletePost(id: number) {
  await requireAdmin();
  await db.post.delete({ where: { id } });
  updateTag("posts");
  refresh();
}

export async function toggleServiceActive(id: number, active: boolean) {
  await requireAdmin();
  await db.service.update({ where: { id }, data: { active } });
  updateTag("services");
  refresh();
}
