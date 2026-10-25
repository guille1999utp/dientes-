// Clases completas para que Tailwind las detecte (no se pueden construir dinámicamente).
export const palette = {
  sky: {
    bg: "bg-sky-100",
    soft: "bg-sky-50",
    solid: "bg-sky-500",
    text: "text-sky-600",
    border: "border-sky-200",
    ring: "ring-sky-300",
    gradient: "from-sky-200 to-sky-100",
  },
  mint: {
    bg: "bg-emerald-100",
    soft: "bg-emerald-50",
    solid: "bg-emerald-500",
    text: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-300",
    gradient: "from-emerald-200 to-emerald-100",
  },
  sun: {
    bg: "bg-amber-100",
    soft: "bg-amber-50",
    solid: "bg-amber-400",
    text: "text-amber-600",
    border: "border-amber-200",
    ring: "ring-amber-300",
    gradient: "from-amber-200 to-amber-100",
  },
  coral: {
    bg: "bg-rose-100",
    soft: "bg-rose-50",
    solid: "bg-rose-500",
    text: "text-rose-600",
    border: "border-rose-200",
    ring: "ring-rose-300",
    gradient: "from-rose-200 to-rose-100",
  },
  grape: {
    bg: "bg-violet-100",
    soft: "bg-violet-50",
    solid: "bg-violet-500",
    text: "text-violet-600",
    border: "border-violet-200",
    ring: "ring-violet-300",
    gradient: "from-violet-200 to-violet-100",
  },
} as const;

export type ColorName = keyof typeof palette;

export const colorNames = Object.keys(palette) as ColorName[];

export function colorOf(name: string) {
  return palette[(name in palette ? name : "sky") as ColorName];
}
