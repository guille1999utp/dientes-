"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { TeethIllustration, type TeethVariant } from "./TeethIllustration";

export function BeforeAfterSlider({ before, after }: { before: TeethVariant; after: TeethVariant }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[32/21] w-full cursor-ew-resize touch-none overflow-hidden rounded-3xl select-none"
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      <TeethIllustration variant={after} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <TeethIllustration variant={before} className="h-full w-full" />
      </div>

      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 font-display text-sm font-semibold text-rose-500 shadow">
        Antes
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 font-display text-sm font-semibold text-emerald-600 shadow">
        Después ✨
      </span>

      <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes y después"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-brand text-lg text-white shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-lemon"
        >
          ⇆
        </div>
      </div>
    </div>
  );
}
