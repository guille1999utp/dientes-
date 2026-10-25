import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-lemon/40 px-4 py-1 font-display text-sm font-semibold tracking-wide text-ink">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-4xl font-bold text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-ink-soft">{subtitle}</p>}
    </div>
  );
}
