"use client";

import { useEffect, useState } from "react";

type Testimonial = { id: number; parentName: string; childName: string | null; rating: number; comment: string };

const BG = ["bg-sky-100", "bg-rose-100", "bg-amber-100", "bg-emerald-100", "bg-violet-100"];

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5500);
    return () => clearInterval(id);
  }, [paused, items.length]);

  if (!items.length) return null;
  const go = (delta: number) => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <div className="relative mx-auto max-w-3xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden rounded-[2rem]">
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((t, i) => (
            <figure key={t.id} className={`w-full shrink-0 ${BG[i % BG.length]} p-8 sm:p-12`} aria-hidden={i !== index}>
              <div className="text-2xl tracking-widest text-amber-400" aria-label={`${t.rating} de 5 estrellas`}>
                {"★".repeat(t.rating)}
                <span className="text-ink/15">{"★".repeat(5 - t.rating)}</span>
              </div>
              <blockquote className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl">“{t.comment}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white font-display text-xl font-bold text-brand">
                  {t.parentName.charAt(0)}
                </span>
                <span>
                  <span className="block font-bold">{t.parentName}</span>
                  {t.childName && <span className="text-sm text-ink-soft">Familia de {t.childName}</span>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-md hover:bg-sky-50" aria-label="Anterior">
          ←
        </button>
        <div className="flex gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver testimonio ${i + 1}`}
              className={`h-3 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-3 bg-ink/20"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-md hover:bg-sky-50" aria-label="Siguiente">
          →
        </button>
      </div>
    </div>
  );
}
