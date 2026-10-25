"use client";

import { useState } from "react";
import { BOOKING_WINDOW_DAYS, isOpenDay, parseISODate, toISODate } from "@/lib/schedule";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export function Calendar({ today, value, onChange }: { today: string; value: string | null; onChange: (iso: string) => void }) {
  const todayDate = parseISODate(today);
  const limit = new Date(todayDate);
  limit.setDate(limit.getDate() + BOOKING_WINDOW_DAYS);

  const [cursor, setCursor] = useState(() => {
    const base = value ? parseISODate(value) : todayDate;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canPrev = new Date(year, month, 1) > new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const canNext = new Date(year, month + 1, 1) <= limit;

  const title = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(cursor);
  const todayIso = toISODate(todayDate);
  const limitIso = toISODate(limit);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-sky-50 text-lg hover:bg-sky-100 disabled:opacity-30"
          aria-label="Mes anterior"
        >
          ←
        </button>
        <h3 className="text-xl font-semibold capitalize">{title}</h3>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-sky-50 text-lg hover:bg-sky-100 disabled:opacity-30"
          aria-label="Mes siguiente"
        >
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-ink-soft">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const iso = toISODate(new Date(year, month, i + 1));
          const disabled = iso < todayIso || iso > limitIso || !isOpenDay(iso);
          const selected = iso === value;
          const isToday = iso === todayIso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={iso}
              className={`relative aspect-square rounded-2xl font-display text-lg font-medium transition-all ${
                selected
                  ? "scale-110 bg-brand text-white shadow-[0_4px_0_var(--color-brand-dark)]"
                  : disabled
                    ? "text-ink/20 line-through decoration-ink/10"
                    : "bg-sky-50 text-ink hover:-translate-y-0.5 hover:bg-sky-100"
              }`}
            >
              {i + 1}
              {isToday && !selected && <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-bubblegum" />}
            </button>
          );
        })}
      </div>
      <p className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-sky-50 ring-1 ring-sky-200" /> Disponible
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" /> Hoy
        </span>
        <span>Domingos cerrado</span>
      </p>
    </div>
  );
}
