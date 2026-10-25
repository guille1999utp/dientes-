"use client";

import { useState } from "react";

const FACTS = [
  { front: "🦈", title: "¿Sabías que...?", fact: "Los tiburones pueden tener más de 20.000 dientes en toda su vida. ¡Les salen nuevos todo el tiempo!", color: "bg-sky-200" },
  { front: "🐌", title: "¡Increíble!", fact: "Los caracoles tienen miles de dientes diminutos en su lengua. ¡Pero ninguno se cepilla!", color: "bg-emerald-200" },
  { front: "🧚", title: "El Ratón Pérez", fact: "En Colombia y España, el Ratón Pérez cambia los dientes de leche por regalos. ¡En otros países es un hada!", color: "bg-violet-200" },
  { front: "🐘", title: "¡Qué grandes!", fact: "Los colmillos de los elefantes son dientes gigantes que nunca dejan de crecer.", color: "bg-amber-200" },
  { front: "👶", title: "Primer diente", fact: "El primer diente de los bebés suele salir entre los 6 y 10 meses. ¡Y casi siempre es uno de abajo!", color: "bg-rose-200" },
  { front: "🧬", title: "Únicos", fact: "Tus dientes son únicos, como tus huellas. ¡No hay dos sonrisas iguales en el mundo!", color: "bg-sky-200" },
];

export function FactCards() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {FACTS.map((f, i) => {
        const isFlipped = flipped.has(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="group h-56 [perspective:1000px] sm:h-60"
            aria-label={isFlipped ? f.fact : `Voltear tarjeta: ${f.title}`}
          >
            <span
              className={`relative block h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(12deg)]"
              }`}
            >
              <span className={`absolute inset-0 grid place-items-center rounded-3xl ${f.color} shadow-md [backface-visibility:hidden]`}>
                <span>
                  <span className="block text-6xl sm:text-7xl">{f.front}</span>
                  <span className="mt-3 block font-display text-lg font-semibold">{f.title}</span>
                  <span className="text-sm text-ink-soft">Toca para descubrir</span>
                </span>
              </span>
              <span className="absolute inset-0 grid place-items-center rounded-3xl bg-white p-4 shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="text-sm font-semibold sm:text-base">{f.fact}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
