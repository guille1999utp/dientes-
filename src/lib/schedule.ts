// Reglas de agenda compartidas entre el cliente y el servidor.

export const CLINIC_TZ = "America/Bogota";
export const CHAIRS_PER_SLOT = 2;
export const BOOKING_WINDOW_DAYS = 45;
const SLOT_MINUTES = 30;

// Bloques de atención por día de la semana (0 = domingo).
const OPENING_BLOCKS: Record<number, [string, string][]> = {
  0: [],
  1: [["08:00", "12:00"], ["14:00", "18:00"]],
  2: [["08:00", "12:00"], ["14:00", "18:00"]],
  3: [["08:00", "12:00"], ["14:00", "18:00"]],
  4: [["08:00", "12:00"], ["14:00", "18:00"]],
  5: [["08:00", "12:00"], ["14:00", "18:00"]],
  6: [["08:00", "13:00"]],
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, "0");

const fromMinutes = (total: number) => `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Interpreta "YYYY-MM-DD" como fecha local (evita desfases por zona horaria). */
export function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidISODate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return toISODate(parseISODate(iso)) === iso;
}

/** Fecha y minuto actual en la zona horaria de la clínica. */
export function clinicNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function slotsForDate(iso: string): string[] {
  const blocks = OPENING_BLOCKS[parseISODate(iso).getDay()] ?? [];
  const slots: string[] = [];
  for (const [start, end] of blocks) {
    for (let t = toMinutes(start); t + SLOT_MINUTES <= toMinutes(end); t += SLOT_MINUTES) {
      slots.push(fromMinutes(t));
    }
  }
  return slots;
}

export function isOpenDay(iso: string) {
  return slotsForDate(iso).length > 0;
}

/** Fechas reservables: desde hoy hasta la ventana de agenda. */
export function isBookableDate(iso: string, today = clinicNow().date) {
  if (!isValidISODate(iso) || !isOpenDay(iso) || iso < today) return false;
  const limit = parseISODate(today);
  limit.setDate(limit.getDate() + BOOKING_WINDOW_DAYS);
  return iso <= toISODate(limit);
}

/** Un horario de hoy que ya pasó (con 1 hora de margen) no se puede reservar. */
export function isPastSlot(iso: string, time: string, now = clinicNow()) {
  if (iso < now.date) return true;
  if (iso > now.date) return false;
  return toMinutes(time) < now.minutes + 60;
}

export function formatDateLong(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseISODate(iso));
}

export function formatTime(hhmm: string) {
  const m = toMinutes(hhmm);
  const h = Math.floor(m / 60);
  const suffix = h >= 12 ? "p.m." : "a.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m % 60)} ${suffix}`;
}

export function slotPeriod(hhmm: string) {
  return toMinutes(hhmm) < 12 * 60 ? "Mañana" : "Tarde";
}

/** Enlace para añadir la cita a Google Calendar (hora de Bogotá, UTC-5 sin horario de verano). */
export function googleCalendarLink(opts: {
  title: string;
  date: string;
  time: string;
  durationMin: number;
  details: string;
  location: string;
}) {
  const start = new Date(`${opts.date}T${opts.time}:00-05:00`);
  const end = new Date(start.getTime() + opts.durationMin * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: opts.details,
    location: opts.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
