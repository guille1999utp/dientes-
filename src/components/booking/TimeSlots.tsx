"use client";

import { formatTime, slotPeriod } from "@/lib/schedule";

export type Slot = { time: string; left: number };

export function TimeSlots({
  slots,
  loading,
  value,
  onChange,
}: {
  slots: Slot[] | null;
  loading: boolean;
  value: string | null;
  onChange: (time: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-2xl bg-sky-100" style={{ animationDelay: `${i * 50}ms` }} />
        ))}
      </div>
    );
  }
  if (!slots) {
    return (
      <div className="grid h-full min-h-48 place-items-center rounded-3xl border-2 border-dashed border-sky-200 p-6 text-center text-ink-soft">
        <div>
          <div className="text-4xl">👈</div>
          <p className="mt-2 font-semibold">Elige un día en el calendario para ver los horarios disponibles</p>
        </div>
      </div>
    );
  }
  const available = slots.filter((s) => s.left > 0).length;
  if (available === 0) {
    return (
      <div className="grid min-h-48 place-items-center rounded-3xl bg-rose-50 p-6 text-center">
        <div>
          <div className="text-4xl">😢</div>
          <p className="mt-2 font-semibold">No quedan cupos este día. ¡Prueba con otra fecha!</p>
        </div>
      </div>
    );
  }

  const groups = ["Mañana", "Tarde"]
    .map((period) => ({ period, items: slots.filter((s) => slotPeriod(s.time) === period) }))
    .filter((g) => g.items.length);

  return (
    <div className="grid gap-5">
      <p className="text-sm font-semibold text-emerald-600">✅ {available} horarios disponibles</p>
      {groups.map((g) => (
        <div key={g.period}>
          <h4 className="mb-2 font-display font-semibold text-ink-soft">
            {g.period === "Mañana" ? "🌤️" : "🌇"} {g.period}
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {g.items.map((s, i) => {
              const selected = value === s.time;
              const full = s.left === 0;
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={full}
                  onClick={() => onChange(s.time)}
                  aria-pressed={selected}
                  className={`relative animate-pop rounded-2xl px-2 py-3 font-display font-medium transition-all ${
                    selected
                      ? "bg-brand text-white shadow-[0_4px_0_var(--color-brand-dark)]"
                      : full
                        ? "bg-ink/5 text-ink/25 line-through"
                        : "bg-white text-ink shadow-sm ring-2 ring-sky-100 hover:-translate-y-0.5 hover:ring-brand"
                  }`}
                  style={{ animationDelay: `${i * 25}ms` }}
                >
                  {formatTime(s.time)}
                  {s.left === 1 && !selected && (
                    <span className="absolute -top-2 -right-1 rounded-full bg-amber-400 px-1.5 text-[0.65rem] font-bold text-ink">
                      ¡último!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
