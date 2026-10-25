"use client";

import { useActionState } from "react";
import { sendContactMessage, type FormState } from "@/actions/public";

const initial: FormState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const err = (k: string) => state.errors?.[k]?.[0];

  if (state.ok) {
    return (
      <div className="card grid min-h-96 animate-pop place-items-center p-8 text-center">
        <div>
          <div className="text-7xl">💌</div>
          <h3 className="mt-4 text-3xl font-bold">¡Gracias por escribirnos!</h3>
          <p className="mt-2 text-lg text-ink-soft">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8" noValidate>
      <h2 className="text-3xl font-bold sm:col-span-2">Envíanos un mensaje ✉️</h2>
      {state.message && (
        <p role="alert" className="rounded-2xl bg-rose-100 p-3 font-semibold text-rose-700 sm:col-span-2">
          {state.message}
        </p>
      )}
      <label>
        <span className="label">Nombre</span>
        <input name="name" className="field" aria-invalid={!!err("name")} autoComplete="name" />
        {err("name") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("name")}</span>}
      </label>
      <label>
        <span className="label">Correo</span>
        <input name="email" type="email" className="field" aria-invalid={!!err("email")} autoComplete="email" />
        {err("email") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("email")}</span>}
      </label>
      <label>
        <span className="label">Teléfono (opcional)</span>
        <input name="phone" type="tel" className="field" aria-invalid={!!err("phone")} autoComplete="tel" />
        {err("phone") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("phone")}</span>}
      </label>
      <label>
        <span className="label">Asunto</span>
        <select name="subject" className="field" defaultValue="Información general">
          <option>Información general</option>
          <option>Precios y seguros</option>
          <option>Talleres para colegios</option>
          <option>Urgencia</option>
          <option>Otro</option>
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">Mensaje</span>
        <textarea name="message" className="field min-h-36" aria-invalid={!!err("message")} placeholder="Cuéntanos en qué te podemos ayudar..." />
        {err("message") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("message")}</span>}
      </label>
      <button className="btn btn-primary sm:col-span-2" disabled={pending}>
        {pending ? "Enviando..." : "Enviar mensaje 🚀"}
      </button>
    </form>
  );
}
