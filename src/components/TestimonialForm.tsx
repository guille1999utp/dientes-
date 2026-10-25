"use client";

import { useActionState, useState } from "react";
import { submitTestimonial, type FormState } from "@/actions/public";

const initial: FormState = { ok: false };
const LABELS = ["", "Mejorable", "Regular", "Buena", "¡Muy buena!", "¡Increíble!"];

export function TestimonialForm() {
  const [state, action, pending] = useActionState(submitTestimonial, initial);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const err = (k: string) => state.errors?.[k]?.[0];
  const shown = hover || rating;

  if (state.ok) {
    return (
      <div className="card animate-pop p-8 text-center">
        <div className="text-6xl">🥰</div>
        <p className="mt-3 text-lg font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card grid gap-4 p-6 sm:p-8" noValidate>
      <div>
        <span className="label">Tu calificación</span>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} estrellas`}
              className={`text-4xl transition-transform hover:scale-125 ${n <= shown ? "text-amber-400" : "text-ink/15"}`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 font-display font-semibold text-ink-soft">{LABELS[shown]}</span>
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="label">Tu nombre</span>
          <input name="parentName" className="field" aria-invalid={!!err("parentName")} />
          {err("parentName") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("parentName")}</span>}
        </label>
        <label>
          <span className="label">Tu peque (opcional)</span>
          <input name="childName" className="field" placeholder="Ej: Sofía, 4 años" />
        </label>
      </div>
      <label>
        <span className="label">Tu experiencia</span>
        <textarea name="comment" className="field min-h-28" aria-invalid={!!err("comment")} placeholder="¿Cómo le fue a tu peque?" />
        {err("comment") && <span className="mt-1 block text-sm font-semibold text-rose-500">{err("comment")}</span>}
      </label>
      <button className="btn btn-pink" disabled={pending}>
        {pending ? "Enviando..." : "Publicar opinión ⭐"}
      </button>
    </form>
  );
}
