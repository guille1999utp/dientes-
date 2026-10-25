"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/admin";

const LINKS = [
  { href: "/admin", label: "Resumen", emoji: "📊" },
  { href: "/admin/citas", label: "Citas", emoji: "📅" },
  { href: "/admin/mensajes", label: "Mensajes", emoji: "✉️" },
  { href: "/admin/blog", label: "Blog", emoji: "📝" },
  { href: "/admin/testimonios", label: "Testimonios", emoji: "⭐" },
  { href: "/admin/servicios", label: "Servicios", emoji: "🦷" },
];

export function AdminNav() {
  return <AdminNavView pathname={usePathname()} />;
}

export function AdminNavView({ pathname }: { pathname: string }) {
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="border-b border-ink/5 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-2 p-4 lg:block lg:p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-xl">🦷</span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold">Sonrisitas</span>
            <span className="block text-xs font-bold text-ink-soft uppercase">Panel</span>
          </span>
        </Link>
        <div className="flex gap-2 lg:hidden">
          <Link href="/" className="btn btn-ghost !px-3 !py-1.5 text-sm">Sitio</Link>
          <form action={logout}>
            <button className="btn btn-ghost !px-3 !py-1.5 text-sm">Salir</button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:grid lg:px-4 lg:pb-0">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 font-display font-medium transition-colors ${
              active(l.href) ? "bg-sky-100 text-brand-dark" : "text-ink-soft hover:bg-sky-50 hover:text-ink"
            }`}
          >
            <span>{l.emoji}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-6 hidden w-56 gap-2 px-4 lg:grid">
        <Link href="/" target="_blank" className="btn btn-ghost !py-2 text-sm">
          Ver sitio ↗
        </Link>
        <form action={logout}>
          <button className="btn w-full !py-2 text-sm text-rose-600 hover:bg-rose-50">Cerrar sesión</button>
        </form>
      </div>
    </aside>
  );
}
