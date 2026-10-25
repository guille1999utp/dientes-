import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{6,19}$/, "Escribe un teléfono válido");

export const appointmentSchema = z.object({
  serviceId: z.coerce.number().int().positive("Elige un servicio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora"),
  parentName: z.string().trim().min(3, "Escribe tu nombre completo").max(80),
  phone,
  email: z.email("Escribe un correo válido").trim().toLowerCase(),
  childName: z.string().trim().min(2, "Escribe el nombre de tu peque").max(60),
  childAge: z.coerce.number().int().min(0, "Edad inválida").max(17, "Atendemos hasta los 17 años"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre").max(80),
  email: z.email("Escribe un correo válido").trim().toLowerCase(),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Cuéntanos el asunto").max(100),
  message: z.string().trim().min(10, "El mensaje es muy corto").max(2000),
});

export const testimonialSchema = z.object({
  parentName: z.string().trim().min(3, "Escribe tu nombre").max(80),
  childName: z.string().trim().max(60).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(15, "Cuéntanos un poquito más (mín. 15 caracteres)").max(600),
});

export const postSchema = z.object({
  title: z.string().trim().min(5, "Título muy corto").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  excerpt: z.string().trim().min(20, "Resumen muy corto").max(300),
  content: z.string().trim().min(50, "El contenido es muy corto"),
  category: z.string().trim().min(3).max(30),
  emoji: z.string().trim().min(1).max(8),
  color: z.enum(["sky", "mint", "sun", "coral", "grape"]),
  readMinutes: z.coerce.number().int().min(1).max(60),
  published: z.coerce.boolean(),
});

export type FieldErrors = Record<string, string[] | undefined>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors as FieldErrors;
}
