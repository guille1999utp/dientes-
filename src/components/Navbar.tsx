"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";

/** Lee la ruta actual; en el shell prerenderizado se usa <NavbarView pathname="" /> como fallback. */
export function Navbar() {
  return <NavbarView pathname={usePathname()} />;
}

export function NavbarView({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Cierra el menú móvil al navegar.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-[0_8px_30px_-12px_rgba(35,48,90,0.25)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2" aria-label="Sonrisitas, inicio">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-2xl shadow-[0_4px_0_var(--color-brand-dark)] group-hover:animate-wiggle">
            🦷
          </span>
          <span className="leading-tight">
            <span className="block font-display text-2xl font-bold text-ink">Sonrisitas</span>
            <span className="block text-[0.7rem] font-bold tracking-wider text-ink-soft uppercase">Odontología infantil</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 font-display text-[1.02rem] font-medium transition-colors ${
                  isActive(l.href) ? "bg-sky-100 text-brand-dark" : "text-ink hover:bg-white hover:text-brand"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/mi-cita" className="hidden rounded-full px-4 py-2 font-display font-medium text-ink-soft hover:text-brand md:block">
            Mi cita
          </Link>
          <Link href="/agendar" className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Agendar cita 📅
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-md lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-2 rotate-45" : "top-0"}`} />
              <span className={`absolute top-2 left-0 h-0.5 w-5 rounded bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-2 -rotate-45" : "top-4"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div className={`overflow-hidden transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[36rem]" : "max-h-0"}`}>
        <ul className="mx-4 mb-4 grid gap-1 rounded-3xl bg-white p-3 shadow-xl">
          {[...navLinks, { href: "/mi-cita", label: "Mi cita" }].map((l, i) => (
            <li key={l.href} style={{ animationDelay: `${i * 40}ms` }} className={open ? "animate-pop" : ""}>
              <Link
                href={l.href}
                className={`block rounded-2xl px-4 py-3 font-display text-lg ${isActive(l.href) ? "bg-sky-100 text-brand-dark" : "hover:bg-sky-50"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/agendar" className="btn btn-primary mt-2 w-full">
              Agendar cita 📅
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
