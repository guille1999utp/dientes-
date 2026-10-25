"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { createAppointment, type BookingResult } from "@/actions/public";
import { Confetti } from "@/components/Confetti";
import { Mascot } from "@/components/Mascot";
import { colorOf } from "@/lib/colors";
import { formatDateLong, formatTime, googleCalendarLink } from "@/lib/schedule";
import { formatCOP, site, whatsappLink } from "@/lib/site";
import { appointmentSchema, fieldErrors, type FieldErrors } from "@/lib/validation";
import { Calendar } from "./Calendar";
import { TimeSlots, type Slot } from "./TimeSlots";

type Service = {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  color: string;
  shortDescription: string;
  durationMin: number;
  priceFrom: number;
  ageRange: string;
};

const STEPS = ["Servicio", "Fecha y hora", "Datos", "Confirmar"];

const emptyForm = { parentName: "", phone: "", email: "", childName: "", childAge: "5", notes: "" };

export function BookingWizard({ services, today, initialSlug }: { services: Service[]; today: string; initialSlug?: string }) {
  const initial = services.find((s) => s.slug === initialSlug);
  const [step, setStep] = useState(initial ? 1 : 0);
  const [serviceId, setServiceId] = useState<number | null>(initial?.id ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<BookingResult, { ok: true }> | null>(null);
  const [pending, startTransition] = useTransition();

  const service = services.find((s) => s.id === serviceId) ?? null;

  const slotsRequest = useRef<AbortController | null>(null);

  const loadSlots = (iso: string) => {
    slotsRequest.current?.abort();
    const controller = new AbortController();
    slotsRequest.current = controller;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${iso}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { slots: Slot[] }) => {
        setSlots(data.slots);
        setLoadingSlots(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setSlots([]);
          setLoadingSlots(false);
        }
      });
  };

  useEffect(() => () => slotsRequest.current?.abort(), []);

  const selectDate = (iso: string) => {
    setDate(iso);
    setTime(null);
    loadSlots(iso);
  };

  const update = (field: keyof typeof emptyForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const payload = () => ({ serviceId, date, time, ...form });

  const validateDetails = () => {
    const parsed = appointmentSchema.safeParse(payload());
    if (parsed.success) {
      setErrors({});
      return true;
    }
    setErrors(fieldErrors(parsed.error));
    return false;
  };

  const submit = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await createAppointment(payload());
      if (res.ok) {
        setResult(res);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMessage(res.message);
        if (res.errors) {
          setErrors(res.errors);
          setStep(2);
        } else {
          setTime(null);
          if (date) loadSlots(date);
          setStep(1);
        }
      }
    });
  };

  const canContinue = [serviceId !== null, Boolean(date && time), true, true][step];

  const next = () => {
    setMessage(null);
    if (step === 2 && !validateDetails()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  if (result) return <Success result={result} />;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progreso */}
      <div className="relative mb-10 px-2">
        <div className="absolute top-6 right-8 left-8 h-2 rounded-full bg-sky-100" />
        <div
          className="absolute top-6 left-8 h-2 rounded-full bg-gradient-to-r from-brand to-bubblegum transition-all duration-500"
          style={{ width: `calc((100% - 4rem) * ${step / (STEPS.length - 1)})` }}
        />
        <ol className="relative flex justify-between">
          {STEPS.map((label, i) => (
            <li key={label} className="flex w-16 flex-col items-center text-center">
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                className={`grid h-14 w-14 place-items-center rounded-full font-display text-xl font-bold transition-all ${
                  i < step
                    ? "bg-emerald-400 text-white"
                    : i === step
                      ? "scale-110 bg-brand text-white shadow-[0_4px_0_var(--color-brand-dark)]"
                      : "bg-white text-ink/30 shadow"
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span className={`mt-2 text-xs font-bold sm:text-sm ${i === step ? "text-ink" : "text-ink-soft"}`}>{label}</span>
            </li>
          ))}
        </ol>
      </div>

      {message && (
        <div role="alert" className="mb-6 animate-pop rounded-2xl bg-rose-100 p-4 font-semibold text-rose-700">
          {message}
        </div>
      )}

      <div key={step} className="animate-pop">
        {step === 0 && (
          <div>
            <h2 className="text-center text-3xl font-bold">¿Qué servicio necesita tu peque?</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const c = colorOf(s.color);
                const selected = s.id === serviceId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setServiceId(s.id);
                      setStep(1);
                    }}
                    aria-pressed={selected}
                    className={`group card flex items-start gap-4 p-5 text-left ring-4 transition-all hover:-translate-y-1 ${
                      selected ? c.ring : "ring-transparent"
                    }`}
                  >
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${c.bg} text-3xl group-hover:animate-wiggle`}>
                      {s.emoji}
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold">{s.name}</span>
                      <span className="mt-1 block text-sm text-ink-soft">{s.shortDescription}</span>
                      <span className="mt-2 block text-xs font-bold text-ink-soft">
                        ⏱️ {s.durationMin} min · desde {formatCOP(s.priceFrom)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-center text-3xl font-bold">¿Qué día y a qué hora?</h2>
            {service && (
              <p className="mt-2 text-center text-ink-soft">
                {service.emoji} {service.name} · {service.durationMin} minutos
              </p>
            )}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <Calendar today={today} value={date} onChange={selectDate} />
              <div className="rounded-3xl bg-white p-4 shadow-md sm:p-6">
                {date && <h3 className="mb-4 text-lg font-semibold capitalize">📅 {formatDateLong(date)}</h3>}
                <TimeSlots slots={date ? slots : null} loading={loadingSlots} value={time} onChange={setTime} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold">Cuéntanos sobre ustedes</h2>
            <div className="card mt-8 grid gap-6 p-6 sm:p-8">
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-3 font-display text-xl font-semibold">🧒 Tu peque</legend>
                <Field label="Nombre del niño o niña" error={errors.childName}>
                  <input className="field" value={form.childName} onChange={(e) => update("childName", e.target.value)} aria-invalid={!!errors.childName} autoComplete="off" />
                </Field>
                <Field label={`Edad: ${form.childAge} ${form.childAge === "1" ? "año" : "años"}`} error={errors.childAge}>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-2xl">{Number(form.childAge) < 3 ? "👶" : Number(form.childAge) < 10 ? "🧒" : "🧑"}</span>
                    <input
                      type="range"
                      min={0}
                      max={17}
                      value={form.childAge}
                      onChange={(e) => update("childAge", e.target.value)}
                      className="w-full accent-[var(--color-brand)]"
                      aria-label="Edad del niño"
                    />
                  </div>
                </Field>
              </fieldset>
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-3 font-display text-xl font-semibold">👨‍👩‍👧 Acudiente</legend>
                <Field label="Tu nombre completo" error={errors.parentName} className="sm:col-span-2">
                  <input className="field" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} aria-invalid={!!errors.parentName} autoComplete="name" />
                </Field>
                <Field label="Celular / WhatsApp" error={errors.phone}>
                  <input className="field" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={!!errors.phone} autoComplete="tel" placeholder="300 123 4567" />
                </Field>
                <Field label="Correo electrónico" error={errors.email}>
                  <input className="field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} autoComplete="email" placeholder="tu@correo.com" />
                </Field>
                <Field label="¿Algo que debamos saber? (opcional)" error={errors.notes} className="sm:col-span-2">
                  <textarea
                    className="field min-h-24"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Alergias, miedos, condiciones especiales, si es su primera visita..."
                  />
                </Field>
              </fieldset>
            </div>
          </div>
        )}

        {step === 3 && service && date && time && (
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold">¿Todo listo? Revisa tu cita</h2>
            <div className="card mt-8 overflow-hidden">
              <div className={`flex items-center gap-4 bg-gradient-to-r ${colorOf(service.color).gradient} p-6`}>
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-4xl">{service.emoji}</span>
                <div>
                  <div className="text-2xl font-bold">{service.name}</div>
                  <div className="text-ink-soft">
                    {service.durationMin} min · desde {formatCOP(service.priceFrom)}
                  </div>
                </div>
              </div>
              <dl className="grid gap-4 p-6 sm:grid-cols-2">
                <Summary label="📅 Fecha" value={formatDateLong(date)} />
                <Summary label="⏰ Hora" value={formatTime(time)} />
                <Summary label="🧒 Paciente" value={`${form.childName} (${form.childAge} años)`} />
                <Summary label="👤 Acudiente" value={form.parentName} />
                <Summary label="📞 Celular" value={form.phone} />
                <Summary label="✉️ Correo" value={form.email} />
                {form.notes && <Summary label="📝 Notas" value={form.notes} className="sm:col-span-2" />}
              </dl>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className={`btn btn-ghost ${step === 0 ? "invisible" : ""}`}>
          ← Atrás
        </button>
        {step < 3 ? (
          <button type="button" onClick={next} disabled={!canContinue} className="btn btn-primary">
            Continuar →
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={pending} className="btn btn-pink text-lg">
            {pending ? "Agendando..." : "Confirmar cita 🎉"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string[]; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {error?.[0] && <span className="mt-1 block text-sm font-semibold text-rose-500">{error[0]}</span>}
    </label>
  );
}

function Summary({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-cream p-4 ${className}`}>
      <dt className="text-sm font-bold text-ink-soft">{label}</dt>
      <dd className="mt-1 font-semibold first-letter:uppercase">{value}</dd>
    </div>
  );
}

function Success({ result }: { result: Extract<BookingResult, { ok: true }> }) {
  const [copied, setCopied] = useState(false);
  const calendarUrl = googleCalendarLink({
    title: `🦷 ${result.serviceName} - ${result.childName} (Sonrisitas)`,
    date: result.date,
    time: result.time,
    durationMin: result.durationMin,
    details: `Código de reserva: ${result.code}`,
    location: site.address,
  });

  const copy = async () => {
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Confetti />
      <div className="mx-auto w-fit animate-bounce-soft">
        <Mascot size={180} mood="wink" />
      </div>
      <h2 className="mt-4 text-4xl font-bold sm:text-5xl">¡Cita agendada! 🎉</h2>
      <p className="mt-3 text-lg text-ink-soft">
        Te esperamos con <strong className="text-ink">{result.childName}</strong> el{" "}
        <strong className="text-ink">{formatDateLong(result.date)}</strong> a las <strong className="text-ink">{formatTime(result.time)}</strong>{" "}
        para <strong className="text-ink">{result.serviceName}</strong>.
      </p>

      <div className="card mx-auto mt-8 max-w-md p-6">
        <div className="text-sm font-bold text-ink-soft">Tu código de reserva</div>
        <div className="mt-2 font-display text-4xl font-bold tracking-widest text-brand">{result.code}</div>
        <button type="button" onClick={copy} className="mt-3 text-sm font-bold text-ink-soft hover:text-brand">
          {copied ? "¡Copiado! ✅" : "📋 Copiar código"}
        </button>
        <p className="mt-3 text-sm text-ink-soft">Guárdalo para consultar o cancelar tu cita en “Mi cita”. Te confirmaremos por WhatsApp.</p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
          📆 Añadir a mi calendario
        </a>
        <a
          href={whatsappLink(`¡Hola! Acabo de agendar una cita. Mi código es ${result.code} 🦷`)}
          target="_blank"
          rel="noreferrer"
          className="btn !bg-emerald-500 text-white shadow-[0_6px_0_#059669]"
        >
          💬 Avisar por WhatsApp
        </a>
        <Link href="/rincon-infantil" className="btn btn-ghost">
          🎮 Preparar a mi peque
        </Link>
      </div>
    </div>
  );
}
