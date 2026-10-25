import Link from "next/link";
import { navLinks, site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-24 bg-ink text-white">
      <svg viewBox="0 0 1440 80" className="absolute -top-[79px] left-0 h-20 w-full" preserveAspectRatio="none" aria-hidden>
        <path d="M0 40 C240 90 480 0 720 40 C960 80 1200 10 1440 40 L1440 80 L0 80 Z" fill="var(--color-ink)" />
      </svg>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-2xl">🦷</span>
            <span className="font-display text-2xl font-bold">Sonrisitas</span>
          </div>
          <p className="mt-4 text-white/70">{site.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(site.socials).map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm capitalize transition hover:bg-white/20"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Explora</h3>
          <ul className="mt-4 grid gap-2 text-white/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-lemon">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mi-cita" className="hover:text-lemon">
                Consultar mi cita
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Horarios</h3>
          <ul className="mt-4 grid gap-3 text-white/70">
            {site.hours.map((h) => (
              <li key={h.days}>
                <span className="block font-bold text-white">{h.days}</span>
                {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Contacto</h3>
          <ul className="mt-4 grid gap-3 text-white/70">
            <li>📍 {site.address}</li>
            <li>
              📞{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-lemon">
                {site.phone}
              </a>
            </li>
            <li>
              ✉️{" "}
              <a href={`mailto:${site.email}`} className="hover:text-lemon">
                {site.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn mt-1 !bg-emerald-500 !py-2 text-white">
                Escríbenos por WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-white/50">
        © 2026 {site.fullName} · Hecho con 💙 para las sonrisas más pequeñas ·{" "}
        <Link href="/admin" className="hover:text-white">
          Panel
        </Link>
      </div>
    </footer>
  );
}
