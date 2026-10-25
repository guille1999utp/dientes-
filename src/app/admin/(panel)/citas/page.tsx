import Link from "next/link";
import { deleteAppointment } from "@/actions/admin";
import { ActionButton } from "@/components/admin/ActionButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import type { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { clinicNow, formatTime, parseISODate, toISODate } from "@/lib/schedule";
import { STATUS_LABELS } from "@/lib/status";

const RANGES = [
  { key: "proximas", label: "Próximas" },
  { key: "hoy", label: "Hoy" },
  { key: "semana", label: "7 días" },
  { key: "pasadas", label: "Pasadas" },
  { key: "todas", label: "Todas" },
];

const dateFmt = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short" });

export default async function AppointmentsPage({ searchParams }: PageProps<"/admin/citas">) {
  await requireAdmin();
  const sp = await searchParams;
  const rango = typeof sp.rango === "string" ? sp.rango : "proximas";
  const estado = typeof sp.estado === "string" ? sp.estado : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const today = clinicNow().date;
  const weekEnd = parseISODate(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const where: Prisma.AppointmentWhereInput = {};
  if (rango === "proximas") where.date = { gte: today };
  if (rango === "hoy") where.date = today;
  if (rango === "semana") where.date = { gte: today, lte: toISODate(weekEnd) };
  if (rango === "pasadas") where.date = { lt: today };
  if (estado) where.status = estado;
  if (q) where.OR = [{ childName: { contains: q } }, { parentName: { contains: q } }, { code: { contains: q.toUpperCase() } }, { email: { contains: q.toLowerCase() } }];

  const appointments = await db.appointment.findMany({
    where,
    include: { service: true },
    orderBy: rango === "pasadas" ? [{ date: "desc" }, { time: "desc" }] : [{ date: "asc" }, { time: "asc" }],
    take: 200,
  });

  const href = (params: Record<string, string>) => {
    const merged = new URLSearchParams({ rango, ...(estado && { estado }), ...(q && { q }), ...params });
    for (const [k, v] of [...merged.entries()]) if (!v) merged.delete(k);
    return `/admin/citas?${merged}`;
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Citas 📅</h1>
          <p className="text-ink-soft">{appointments.length} resultados</p>
        </div>
        <form className="flex gap-2" action="/admin/citas">
          <input type="hidden" name="rango" value={rango} />
          {estado && <input type="hidden" name="estado" value={estado} />}
          <input name="q" defaultValue={q} placeholder="Buscar niño, acudiente, código..." className="field !py-2" />
          <button className="btn btn-primary !py-2">Buscar</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={href({ rango: r.key })}
            className={`rounded-full px-4 py-1.5 font-display font-medium ${rango === r.key ? "bg-ink text-white" : "bg-white hover:bg-sky-50"}`}
          >
            {r.label}
          </Link>
        ))}
        <span className="mx-2 w-px bg-ink/10" />
        <Link href={href({ estado: "" })} className={`rounded-full px-4 py-1.5 font-display font-medium ${!estado ? "bg-ink text-white" : "bg-white hover:bg-sky-50"}`}>
          Todos
        </Link>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={href({ estado: key })}
            className={`rounded-full px-4 py-1.5 font-display font-medium ${estado === key ? "bg-ink text-white" : "bg-white hover:bg-sky-50"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-ink/5 text-xs text-ink-soft uppercase">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Paciente</th>
              <th className="p-4">Acudiente</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-ink-soft">
                  No hay citas con estos filtros 🦷
                </td>
              </tr>
            )}
            {appointments.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold capitalize">{a.date === today ? "Hoy" : dateFmt.format(parseISODate(a.date))}</div>
                  <div className="text-ink-soft">{formatTime(a.time)}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold">{a.childName}</div>
                  <div className="text-ink-soft">{a.childAge} años · {a.code}</div>
                  {a.notes && <div className="mt-1 max-w-56 truncate text-xs text-amber-700" title={a.notes}>📝 {a.notes}</div>}
                </td>
                <td className="p-4">
                  <div className="font-semibold">{a.parentName}</div>
                  <div className="text-ink-soft">{a.phone}</div>
                  <div className="text-ink-soft">{a.email}</div>
                </td>
                <td className="p-4">
                  {a.service.emoji} {a.service.name}
                </td>
                <td className="p-4">
                  <StatusSelect id={a.id} status={a.status} />
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <a
                      href={`https://wa.me/57${a.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                        `Hola ${a.parentName}, te escribimos de Sonrisitas para confirmar la cita de ${a.childName} el ${a.date} a las ${formatTime(a.time)} 🦷`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl px-3 py-1.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      WhatsApp
                    </a>
                    <ActionButton
                      action={deleteAppointment.bind(null, a.id)}
                      confirm={`¿Eliminar la cita de ${a.childName}?`}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      Eliminar
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
