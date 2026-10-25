type Props = {
  size?: number;
  wave?: boolean;
  brush?: boolean;
  shine?: number; // 0 a 1: qué tan limpio está Dientín
  className?: string;
  mood?: "happy" | "wow" | "wink";
};

/** Dientín, la mascota de Sonrisitas. SVG puro, animado con CSS. */
export function Mascot({ size = 220, wave = true, brush = false, shine = 1, mood = "happy", className = "" }: Props) {
  const dirt = 1 - Math.min(Math.max(shine, 0), 1);
  const blinkStyle = { transformBox: "fill-box", transformOrigin: "center" } as const;

  return (
    <svg
      viewBox="0 0 220 230"
      width={size}
      height={size * (230 / 220)}
      className={className}
      role="img"
      aria-label="Dientín, la mascota de Sonrisitas"
    >
      <defs>
        <linearGradient id="tooth-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8f3ff" />
        </linearGradient>
      </defs>

      {/* sombra */}
      <ellipse cx="110" cy="220" rx="55" ry="7" fill="#23305a" opacity="0.12" />

      {/* brazo izquierdo */}
      <path d="M42 120 Q20 130 22 150" stroke="#23305a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="152" r="9" fill="#fff" stroke="#23305a" strokeWidth="5" />

      {/* brazo derecho (saluda o cepilla) */}
      <g className={wave || brush ? "animate-wave" : ""} style={{ transformOrigin: "176px 118px" }}>
        <path d="M176 118 Q200 100 202 76" stroke="#23305a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="202" cy="72" r="9" fill="#fff" stroke="#23305a" strokeWidth="5" />
        {brush && (
          <g transform="translate(196 18) rotate(18)">
            <rect x="0" y="0" width="12" height="52" rx="6" fill="#3aa0ff" stroke="#23305a" strokeWidth="3" />
            <rect x="-4" y="-16" width="20" height="18" rx="4" fill="#fff" stroke="#23305a" strokeWidth="3" />
            <path d="M-2 -16 v-6 M4 -16 v-7 M10 -16 v-6" stroke="#ff7eb6" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* cuerpo */}
      <path
        d="M110 22 C68 6 32 28 35 74 C37 108 52 130 57 166 C61 200 69 214 82 209 C96 204 92 170 110 164 C128 170 124 204 138 209 C151 214 159 200 163 166 C168 130 183 108 185 74 C188 28 152 6 110 22 Z"
        fill="url(#tooth-fill)"
        stroke="#23305a"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* manchitas de suciedad (se van al cepillar) */}
      <g opacity={dirt} style={{ transition: "opacity 0.4s" }}>
        <circle cx="72" cy="150" r="9" fill="#c9a96b" />
        <circle cx="150" cy="140" r="7" fill="#b8955a" />
        <circle cx="140" cy="60" r="6" fill="#c9a96b" />
        <circle cx="62" cy="70" r="5" fill="#b8955a" />
        <circle cx="118" cy="182" r="6" fill="#c9a96b" />
      </g>

      {/* brillo */}
      <path d="M58 52 Q66 36 84 32" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* ojos */}
      {mood === "wink" ? (
        <>
          <path d="M76 92 Q86 84 96 92" stroke="#23305a" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g className="animate-blink" style={blinkStyle}>
            <ellipse cx="136" cy="90" rx="9" ry="12" fill="#23305a" />
            <circle cx="139" cy="85" r="3.5" fill="#fff" />
          </g>
        </>
      ) : (
        <g className="animate-blink" style={blinkStyle}>
          <ellipse cx="86" cy="90" rx="9" ry={mood === "wow" ? 14 : 12} fill="#23305a" />
          <ellipse cx="136" cy="90" rx="9" ry={mood === "wow" ? 14 : 12} fill="#23305a" />
          <circle cx="89" cy="85" r="3.5" fill="#fff" />
          <circle cx="139" cy="85" r="3.5" fill="#fff" />
        </g>
      )}

      {/* mejillas */}
      <ellipse cx="68" cy="114" rx="11" ry="7" fill="#ff7eb6" opacity="0.55" />
      <ellipse cx="154" cy="114" rx="11" ry="7" fill="#ff7eb6" opacity="0.55" />

      {/* boca */}
      {mood === "wow" ? (
        <ellipse cx="111" cy="122" rx="10" ry="12" fill="#23305a" />
      ) : (
        <g>
          <path d="M92 112 Q111 138 130 112 Z" fill="#23305a" stroke="#23305a" strokeWidth="5" strokeLinejoin="round" />
          <path d="M101 124 Q111 118 121 124 Q111 132 101 124 Z" fill="#ff7eb6" />
        </g>
      )}

      {/* destellos cuando está limpio */}
      {shine > 0.95 && (
        <g fill="#ffd23f" className="animate-pulse">
          <path d="M28 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" />
          <path d="M188 150 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" />
        </g>
      )}
    </svg>
  );
}
