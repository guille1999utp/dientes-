"use client";

import { useState, useTransition } from "react";
import { cancelAppointment, lookupAppointment, type LookupResult } from "@/actions/public";
import { formatDateLong, formatTime, googleCalendarLink } from "@/lib/schedule";
import { site, whatsappLink } from "@/lib/site";

type Appointment = Extract<LookupResult, { ok: true }>["appointment"];

const STATUS: Record<string, { label: string; emoji: string; className: string }> = {
  PENDIENTE: { label: "Pendiente de confirmación", emoji: "⏳", className: "bg-amber-100 text-amber-700" },
  CONFIRMADA: { label: "Confirmada", emoji: "✅", className: "bg-emerald-100 text-emerald-700" },
  COMPLETADA: { label: "Completada", emoji: "🏆", className: "bg-sky-100 text-sky-700" },
  CANCELADA: { label: "Cancelada", emoji: "❌", className: "bg-rose-100 text-rose-700" },
};

const TIMELINE = ["PENDIENTE", "CONFIRMADA", "COMPLETADA"];

export function AppointmentLookup() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const handle = (res: LookupResult) => {
    if (res.ok) {
      setAppointment(res.appointment);
      setError(null);
    } else {
      setError(res.message);
    }
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setAppointment(null);
      handle(await lookupAppointment(code, email));
    });
  };

  const cancel = () => {
    startTransition(async () => {
      handle(await cancelAppointment(code, email));
      setConfirming(false);
    });
  };

  const status = appointment ? STATUS[appointment.status] : null;
  const stepIndex = appointment ? TIMELINE.indexOf(appointment.status) : -1;

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={search} className="card grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8">
        <label>
          <span className="label">Código de reserva</span>
          <input
            className="field font-display tracking-widest uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SON-XXXXXX"
            required
          />
        </label>
        <label>
          <span className="label">Correo electrónico</span>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
        </label>
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "..." : "Buscar 🔎"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-6 animate-pop rounded-2xl bg-rose-100 p-4 text-center font-semibold text-rose-700">
          {error}
        </p>
      )}

      {appointment && status && (
        <div className="card mt-8 animate-pop overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-sky-50 p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-4xl">{appointment.serviceEmoji}</span>
              <div>
                <div className="text-sm font-bold text-ink-soft">{appointment.code}</div>
                <div className="text-2xl font-bold">{appointment.serviceName}</div>
              </div>
            </div>
            <span className={`rounded-full px-4 py-2 font-bold ${status.className}`}>
              {status.emoji} {status.label}
            </span>
          </div>

          {appointment.status !== "CANCELADA" && (
            <ol className="flex items-center justify-between gap-2 px-6 pt-6">
              {TIMELINE.map((s, i) => (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      i <= stepIndex ? "bg-emerald-400 text-white" : "bg-ink/10 text-ink/40"
                    }`}
                  >
                    {i <= stepIndex ? "✓" : i + 1}
                  </span>
                  <span className="hidden text-sm font-semibold sm:block">{STATUS[s].label.split(" ")[0]}</span>
                  {i < TIMELINE.length - 1 && <span className={`h-1 flex-1 rounded ${i < stepIndex ? "bg-emerald-400" : "bg-ink/10"}`} />}
                </li>
              ))}
            </ol>
          )}

          <dl className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream p-4">
              <dt className="text-sm font-bold text-ink-soft">📅 Fecha</dt>
              <dd className="font-semibold capitalize">{formatDateLong(appointment.date)}</dd>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <dt className="text-sm font-bold text-ink-soft">⏰ Hora</dt>
              <dd className="font-semibold">{formatTime(appointment.time)}</dd>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <dt className="text-sm font-bold text-ink-soft">🧒 Paciente</dt>
              <dd className="font-semibold">{appointment.childName}</dd>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <dt className="text-sm font-bold text-ink-soft">👤 Acudiente</dt>
              <dd className="font-semibold">{appointment.parentName}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3 border-t border-ink/5 p-6">
            {appointment.canCancel && (
              <a
                className="btn btn-ghost !py-2"
                target="_blank"
                rel="noreferrer"
                href={googleCalendarLink({
                  title: `🦷 ${appointment.serviceName} - ${appointment.childName} (Sonrisitas)`,
                  date: appointment.date,
                  time: appointment.time,
                  durationMin: appointment.durationMin,
                  details: `Código de reserva: ${appointment.code}`,
                  location: site.address,
                })}
              >
                📆 Calendario
              </a>
            )}
            <a
              className="btn btn-ghost !py-2"
              target="_blank"
              rel="noreferrer"
              href={whatsappLink(`Hola, quiero reprogramar mi cita ${appointment.code}`)}
            >
              💬 Reprogramar
            </a>
            {appointment.canCancel &&
              (confirming ? (
                <span className="flex flex-wrap items-center gap-2 rounded-2xl bg-rose-50 p-2">
                  <span className="px-2 font-semibold text-rose-700">¿Seguro?</span>
                  <button type="button" onClick={cancel} disabled={pending} className="btn !bg-rose-500 !py-2 text-white">
                    Sí, cancelar
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost !py-2">
                    No
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirming(true)} className="btn !py-2 text-rose-600 hover:bg-rose-50">
                  Cancelar cita
                </button>
              ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-ink-soft">
        ¿Quieres probar? Usa el código <code className="rounded bg-white px-2 py-0.5 font-bold">SON-DEMO1</code> con el correo{" "}
        <code className="rounded bg-white px-2 py-0.5 font-bold">familia@ejemplo.com</code>
      </p>
    </div>
  );
}
