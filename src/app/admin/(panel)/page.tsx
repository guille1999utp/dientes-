import Link from "next/link";
import { STATUS_STYLES } from "@/lib/status";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { clinicNow, formatTime, parseISODate, toISODate } from "@/lib/schedule";

const dayFmt = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric" });

export default async function DashboardPage() {
  await requireAdmin();
  const today = clinicNow().date;
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = parseISODate(today);
    d.setDate(d.getDate() + i);
    return toISODate(d);
  });

  const [todayCount, pending, unread, pendingReviews, upcoming, perDay, perService, services] = await Promise.all([
    db.appointment.count({ where: { date: today, status: { not: "CANCELADA" } } }),
    db.appointment.count({ where: { status: "PENDIENTE", date: { gte: today } } }),
    db.contactMessage.count({ where: { read: false } }),
    db.testimonial.count({ where: { approved: false } }),
    db.appointment.findMany({
      where: { date: { gte: today }, status: { in: ["PENDIENTE", "CONFIRMADA"] } },
      include: { service: true },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 6,
    }),
    db.appointment.groupBy({
      by: ["date"],
      where: { date: { gte: days[0], lte: days[days.length - 1] }, status: { not: "CANCELADA" } },
      _count: true,
    }),
    db.appointment.groupBy({ by: ["serviceId"], where: { status: { not: "CANCELADA" } }, _count: true }),
    db.service.findMany({ select: { id: true, name: true, emoji: true } }),
  ]);

  const countByDay = new Map(perDay.map((d) => [d.date, d._count]));
  const series = days.map((d) => ({ date: d, count: countByDay.get(d) ?? 0 }));
  const max = Math.max(4, ...series.map((s) => s.count));
  const popularity = perService
    .map((p) => ({ ...services.find((s) => s.id === p.serviceId)!, count: p._count }))
    .sort((a, b) => b.count - a.count);
  const maxPop = Math.max(1, ...popularity.map((p) => p.count));

  const stats = [
    { label: "Citas hoy", value: todayCount, emoji: "📅", href: "/admin/citas?rango=hoy", tint: "bg-sky-100" },
    { label: "Por confirmar", value: pending, emoji: "⏳", href: "/admin/citas?estado=PENDIENTE", tint: "bg-amber-100" },
    { label: "Mensajes sin leer", value: unread, emoji: "✉️", href: "/admin/mensajes", tint: "bg-rose-100" },
    { label: "Reseñas por aprobar", value: pendingReviews, emoji: "⭐", href: "/admin/testimonios", tint: "bg-violet-100" },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold">¡Hola, equipo! 👋</h1>
        <p className="text-ink-soft">Esto es lo que está pasando en Sonrisitas.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group card flex items-center gap-4 p-5 transition hover:-translate-y-1">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${s.tint} group-hover:animate-wiggle`}>{s.emoji}</span>
            <span>
              <span className="block font-display text-3xl font-bold">{s.value}</span>
              <span className="text-sm font-semibold text-ink-soft">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Citas agendadas · próximos 14 días</h2>
          <div className="mt-6 flex h-56 items-end gap-[2px] border-b border-ink/10" role="img" aria-label="Citas por día en los próximos 14 días">
            {series.map((s) => (
              <div key={s.date} className="group relative flex h-full flex-1 flex-col justify-end">
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                  {dayFmt.format(parseISODate(s.date))}: {s.count} {s.count === 1 ? "cita" : "citas"}
                </span>
                <div
                  className="mx-auto w-full max-w-8 rounded-t bg-brand-dark transition-opacity group-hover:opacity-80"
                  style={{ height: `${(s.count / max) * 100}%`, minHeight: s.count ? 4 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-[2px] text-center text-[0.65rem] text-ink-soft">
            {series.map((s, i) => (
              <span key={s.date} className="flex-1">
                {i % 2 === 0 ? dayFmt.format(parseISODate(s.date)) : ""}
              </span>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold">Servicios más pedidos</h2>
          <ul className="mt-5 grid gap-3">
            {popularity.length === 0 && <li className="text-ink-soft">Aún no hay citas.</li>}
            {popularity.slice(0, 6).map((p) => (
              <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                <span className="truncate font-semibold">
                  {p.emoji} {p.name}
                </span>
                <span className="font-bold text-ink-soft tabular-nums">{p.count}</span>
                <span className="col-span-2 h-2.5 rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-brand-dark" style={{ width: `${(p.count / maxPop) * 100}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Próximas citas</h2>
          <Link href="/admin/citas" className="font-display font-semibold text-brand hover:underline">
            Ver todas →
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-ink/5">
          {upcoming.length === 0 && <li className="py-6 text-center text-ink-soft">No hay citas próximas.</li>}
          {upcoming.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 py-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-2xl">{a.service.emoji}</span>
              <span className="min-w-40 flex-1">
                <span className="block font-bold">
                  {a.childName} <span className="font-normal text-ink-soft">({a.childAge} años)</span>
                </span>
                <span className="text-sm text-ink-soft">{a.service.name}</span>
              </span>
              <span className="text-sm font-semibold capitalize">
                {a.date === today ? "Hoy" : dayFmt.format(parseISODate(a.date))} · {formatTime(a.time)}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[a.status]}`}>{a.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
