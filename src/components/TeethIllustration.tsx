export type TeethVariant =
  | "caries"
  | "crowded"
  | "gap"
  | "stain"
  | "crossbite"
  | "healthy"
  | "aligned"
  | "sealed";

type Tooth = { w: number; h: number };
type Tweak = { dx?: number; dy?: number; rot?: number; spot?: boolean; seal?: boolean };

const UPPER: Tooth[] = [
  { w: 30, h: 42 },
  { w: 34, h: 48 },
  { w: 40, h: 56 },
  { w: 40, h: 56 },
  { w: 34, h: 48 },
  { w: 30, h: 42 },
];
const LOWER: Tooth[] = [
  { w: 28, h: 34 },
  { w: 30, h: 38 },
  { w: 32, h: 40 },
  { w: 32, h: 40 },
  { w: 30, h: 38 },
  { w: 28, h: 34 },
];

const VARIANTS: Record<TeethVariant, { upper: Tweak[]; lower: Tweak[]; stain?: boolean; sparkle?: boolean; lowerShift?: number }> = {
  caries: {
    upper: [{}, { spot: true }, {}, { spot: true }, {}, {}],
    lower: [{}, {}, { spot: true }, {}, {}, { spot: true }],
  },
  crowded: {
    upper: [{ dx: 4 }, { dx: 8, rot: -14, dy: 3 }, { rot: 6 }, { rot: -4, dx: -2 }, { dx: -8, rot: 14, dy: 4 }, { dx: -4 }],
    lower: [{ dx: 4 }, { rot: 12, dx: 5 }, { rot: -8, dy: -3 }, { rot: 10, dx: -3 }, { rot: -12, dx: -5 }, { dx: -4 }],
  },
  gap: {
    upper: [{ dx: -12 }, { dx: -12 }, { dx: -12, rot: 4 }, { dx: 12, rot: -4 }, { dx: 12 }, { dx: 12 }],
    lower: [{}, {}, {}, {}, {}, {}],
  },
  stain: {
    upper: [{}, {}, {}, {}, {}, {}],
    lower: [{}, {}, {}, {}, {}, {}],
    stain: true,
  },
  crossbite: {
    upper: [{}, { rot: -5 }, {}, {}, { rot: 5 }, {}],
    lower: [{}, {}, {}, {}, {}, {}],
    lowerShift: 18,
  },
  healthy: { upper: Array(6).fill({}), lower: Array(6).fill({}), sparkle: true },
  aligned: { upper: Array(6).fill({}), lower: Array(6).fill({}), sparkle: true },
  sealed: {
    upper: [{ seal: true }, {}, {}, {}, {}, { seal: true }],
    lower: [{ seal: true }, { seal: true }, {}, {}, { seal: true }, { seal: true }],
    sparkle: true,
  },
};

function layout(teeth: Tooth[], gap = 3) {
  const total = teeth.reduce((s, t) => s + t.w, 0) + gap * (teeth.length - 1);
  let x = 160 - total / 2;
  return teeth.map((t) => {
    const pos = { ...t, x };
    x += t.w + gap;
    return pos;
  });
}

export function TeethIllustration({ variant, className = "" }: { variant: TeethVariant; className?: string }) {
  const v = VARIANTS[variant];
  const fill = v.stain ? "#f1dc9c" : "#ffffff";
  const upper = layout(UPPER);
  const lower = layout(LOWER);

  return (
    <svg viewBox="0 0 320 210" className={className} role="img" aria-label={`Ilustración de dientes: ${variant}`}>
      <rect width="320" height="210" fill={v.sparkle ? "#e0f2fe" : "#fef3c7"} />
      {/* labios y boca */}
      <ellipse cx="160" cy="105" rx="138" ry="80" fill="#f9a8c0" />
      <ellipse cx="160" cy="105" rx="122" ry="66" fill="#7a1f45" />
      <ellipse cx="160" cy="140" rx="70" ry="26" fill="#e75a8a" />
      {/* encías */}
      <path d="M44 72 Q160 20 276 72 L276 62 Q160 6 44 62 Z" fill="#f472a0" />
      <path d="M38 64 Q160 30 282 64 L282 50 Q160 12 38 50 Z" fill="#f9a8c0" />
      <path d="M52 150 Q160 186 268 150 L268 162 Q160 200 52 162 Z" fill="#f472a0" />

      {/* dientes superiores */}
      {upper.map((t, i) => {
        const tw = v.upper[i] ?? {};
        const x = t.x + (tw.dx ?? 0);
        const y = 52 + (tw.dy ?? 0) + (i === 0 || i === 5 ? 4 : 0);
        return (
          <g key={`u${i}`} transform={`rotate(${tw.rot ?? 0} ${x + t.w / 2} ${y + t.h / 2})`}>
            <rect x={x} y={y} width={t.w} height={t.h} rx={t.w / 2.6} fill={fill} stroke="#23305a" strokeWidth="2.5" />
            {v.stain && <rect x={x + 4} y={y + 4} width={t.w - 8} height={8} rx={4} fill="#d9b86a" opacity="0.8" />}
            {tw.spot && <circle cx={x + t.w / 2} cy={y + t.h * 0.62} r={t.w / 5} fill="#5b3a1e" />}
            {tw.seal && <rect x={x + 6} y={y + t.h - 14} width={t.w - 12} height={7} rx={3} fill="#60c3ff" />}
            {v.sparkle && <path d={`M${x + 7} ${y + 12} q3 -6 9 -7`} stroke="#bfe3ff" strokeWidth="3" fill="none" strokeLinecap="round" />}
          </g>
        );
      })}

      {/* dientes inferiores */}
      {lower.map((t, i) => {
        const tw = v.lower[i] ?? {};
        const x = t.x + (tw.dx ?? 0) + (v.lowerShift ?? 0);
        const y = 158 - t.h + (tw.dy ?? 0) - (i === 0 || i === 5 ? 3 : 0);
        return (
          <g key={`l${i}`} transform={`rotate(${tw.rot ?? 0} ${x + t.w / 2} ${y + t.h / 2})`}>
            <rect x={x} y={y} width={t.w} height={t.h} rx={t.w / 2.6} fill={fill} stroke="#23305a" strokeWidth="2.5" />
            {v.stain && <rect x={x + 4} y={y + t.h - 11} width={t.w - 8} height={7} rx={3} fill="#d9b86a" opacity="0.8" />}
            {tw.spot && <circle cx={x + t.w / 2} cy={y + t.h * 0.4} r={t.w / 5.5} fill="#5b3a1e" />}
            {tw.seal && <rect x={x + 6} y={y + 6} width={t.w - 12} height={6} rx={3} fill="#60c3ff" />}
          </g>
        );
      })}

      {v.sparkle && (
        <g fill="#ffd23f">
          <path d="M268 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" />
          <path d="M40 160 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" />
          <path d="M290 150 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" />
        </g>
      )}
    </svg>
  );
}
