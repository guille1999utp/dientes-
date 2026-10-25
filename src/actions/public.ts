"use server";

import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import {
  CHAIRS_PER_SLOT,
  clinicNow,
  isBookableDate,
  isPastSlot,
  slotsForDate,
} from "@/lib/schedule";
import {
  appointmentSchema,
  contactSchema,
  fieldErrors,
  testimonialSchema,
  type FieldErrors,
} from "@/lib/validation";

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
};

export type BookingResult =
  | { ok: true; code: string; childName: string; serviceName: string; date: string; time: string; durationMin: number }
  | { ok: false; message: string; errors?: FieldErrors };

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SON-";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export async function createAppointment(input: Record<string, unknown>): Promise<BookingResult> {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del formulario.", errors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  const now = clinicNow();
  if (!isBookableDate(data.date, now.date) || !slotsForDate(data.date).includes(data.time)) {
    return { ok: false, message: "Ese horario no está disponible. Elige otro, por favor." };
  }
  if (isPastSlot(data.date, data.time, now)) {
    return { ok: false, message: "Ese horario ya pasó. Elige uno más tarde." };
  }

  const service = await db.service.findFirst({ where: { id: data.serviceId, active: true } });
  if (!service) return { ok: false, message: "El servicio seleccionado no existe." };

  try {
    const appointment = await db.$transaction(async (tx) => {
      const taken = await tx.appointment.count({
        where: { date: data.date, time: data.time, status: { not: "CANCELADA" } },
      });
      if (taken >= CHAIRS_PER_SLOT) throw new Error("SLOT_FULL");

      const sameChild = await tx.appointment.findFirst({
        where: {
          date: data.date,
          childName: data.childName,
          email: data.email,
          status: { not: "CANCELADA" },
        },
      });
      if (sameChild) throw new Error("DUPLICATE");

      return tx.appointment.create({
        data: {
          code: generateCode(),
          serviceId: service.id,
          date: data.date,
          time: data.time,
          parentName: data.parentName,
          phone: data.phone,
          email: data.email,
          childName: data.childName,
          childAge: data.childAge,
          notes: data.notes || null,
        },
      });
    });

    updateTag("appointments");
    return {
      ok: true,
      code: appointment.code,
      childName: appointment.childName,
      serviceName: service.name,
      date: appointment.date,
      time: appointment.time,
      durationMin: service.durationMin,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_FULL") {
      return { ok: false, message: "¡Uy! Alguien acaba de tomar ese horario. Elige otro, por favor." };
    }
    if (error instanceof Error && error.message === "DUPLICATE") {
      return { ok: false, message: `${data.childName} ya tiene una cita ese día. Puedes revisarla en "Mi cita".` };
    }
    console.error(error);
    return { ok: false, message: "No pudimos agendar la cita. Intenta de nuevo en un momento." };
  }
}

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) };
  }
  await db.contactMessage.create({
    data: { ...parsed.data, phone: parsed.data.phone || null },
  });
  return { ok: true, message: "¡Mensaje enviado! Te responderemos en menos de 24 horas." };
}

export async function submitTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) };
  }
  await db.testimonial.create({
    data: { ...parsed.data, childName: parsed.data.childName || null },
  });
  return { ok: true, message: "¡Gracias por tu opinión! La publicaremos después de revisarla. 💙" };
}

export type LookupResult =
  | {
      ok: true;
      appointment: {
        code: string;
        date: string;
        time: string;
        status: string;
        childName: string;
        parentName: string;
        serviceName: string;
        serviceEmoji: string;
        durationMin: number;
        canCancel: boolean;
      };
    }
  | { ok: false; message: string };

async function findAppointment(code: string, email: string) {
  return db.appointment.findFirst({
    where: { code: code.trim().toUpperCase(), email: email.trim().toLowerCase() },
    include: { service: true },
  });
}

function toLookup(a: NonNullable<Awaited<ReturnType<typeof findAppointment>>>): LookupResult {
  const now = clinicNow();
  return {
    ok: true,
    appointment: {
      code: a.code,
      date: a.date,
      time: a.time,
      status: a.status,
      childName: a.childName,
      parentName: a.parentName,
      serviceName: a.service.name,
      serviceEmoji: a.service.emoji,
      durationMin: a.service.durationMin,
      canCancel: ["PENDIENTE", "CONFIRMADA"].includes(a.status) && !isPastSlot(a.date, a.time, now),
    },
  };
}

export async function lookupAppointment(code: string, email: string): Promise<LookupResult> {
  if (!code.trim() || !email.trim()) return { ok: false, message: "Escribe el código y el correo." };
  const appointment = await findAppointment(code, email);
  if (!appointment) {
    return { ok: false, message: "No encontramos una cita con esos datos. Revisa el código y el correo." };
  }
  return toLookup(appointment);
}

export async function cancelAppointment(code: string, email: string): Promise<LookupResult> {
  const appointment = await findAppointment(code, email);
  if (!appointment) return { ok: false, message: "No encontramos la cita." };
  const current = toLookup(appointment);
  if (!current.ok || !current.appointment.canCancel) {
    return { ok: false, message: "Esta cita ya no se puede cancelar en línea. Escríbenos por WhatsApp." };
  }
  const updated = await db.appointment.update({
    where: { id: appointment.id },
    data: { status: "CANCELADA" },
    include: { service: true },
  });
  updateTag("appointments");
  return toLookup(updated);
}

export async function registerPostView(slug: string) {
  try {
    const post = await db.post.update({ where: { slug }, data: { views: { increment: 1 } }, select: { views: true } });
    return post.views;
  } catch {
    return null;
  }
}
