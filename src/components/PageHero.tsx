import type { ReactNode } from "react";
import { FloatingShapes } from "./FloatingShapes";

export function PageHero({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string;
  title: ReactNode;
  subtitle: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-dots relative overflow-hidden px-4 pt-10 pb-16 sm:px-6">
      <FloatingShapes />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto grid h-20 w-20 animate-bounce-soft place-items-center rounded-3xl bg-white text-5xl shadow-lg">{emoji}</div>
        <h1 className="mt-6 text-4xl font-bold sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft sm:text-xl">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
