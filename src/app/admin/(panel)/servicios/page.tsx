import { toggleServiceActive } from "@/actions/admin";
import { ActionButton } from "@/components/admin/ActionButton";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCOP } from "@/lib/site";

export default async function ServicesAdminPage() {
  await requireAdmin();
  const services = await db.service.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { appointments: true } } },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold">Servicios 🦷</h1>
        <p className="text-ink-soft">Oculta un servicio para retirarlo del sitio y del agendamiento sin perder su historial.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className={`card p-6 ${s.active ? "" : "opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl">{s.emoji}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                {s.active ? "Visible" : "Oculto"}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{s.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{s.shortDescription}</p>
            <p className="mt-3 text-sm font-semibold">
              {s.durationMin} min · desde {formatCOP(s.priceFrom)} · {s._count.appointments} citas
            </p>
            <ActionButton action={toggleServiceActive.bind(null, s.id, !s.active)} className="mt-4 bg-slate-100 hover:bg-slate-200">
              {s.active ? "Ocultar del sitio" : "Mostrar en el sitio"}
            </ActionButton>
          </article>
        ))}
      </div>
    </div>
  );
}
