const shapes = [
  { emoji: "⭐", className: "top-[12%] left-[6%] text-3xl animate-float" },
  { emoji: "🫧", className: "top-[60%] left-[3%] text-4xl animate-float-slow" },
  { emoji: "✨", className: "top-[20%] right-[8%] text-3xl animate-float-slow" },
  { emoji: "🪥", className: "bottom-[14%] right-[5%] text-4xl animate-float" },
  { emoji: "🫧", className: "top-[8%] right-[38%] text-2xl animate-float" },
  { emoji: "💙", className: "bottom-[8%] left-[30%] text-2xl animate-float-slow" },
];

export function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <span key={i} className={`absolute opacity-70 select-none ${s.className}`} style={{ animationDelay: `${i * 0.7}s` }}>
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
