import { deleteMessage, toggleMessageRead } from "@/actions/admin";
import { ActionButton } from "@/components/admin/ActionButton";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const fmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" });

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await db.contactMessage.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold">Mensajes ✉️</h1>
        <p className="text-ink-soft">
          {messages.length} mensajes · {unread} sin leer
        </p>
      </div>
      {messages.length === 0 && <div className="card p-10 text-center text-ink-soft">No hay mensajes todavía.</div>}
      <div className="grid gap-4">
        {messages.map((m) => (
          <article key={m.id} className={`card p-6 ${m.read ? "opacity-70" : "ring-2 ring-sky-200"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {!m.read && <span className="h-2.5 w-2.5 rounded-full bg-brand" aria-label="Sin leer" />}
                  <h2 className="text-lg font-semibold">{m.subject}</h2>
                </div>
                <p className="text-sm text-ink-soft">
                  {m.name} · {m.email}
                  {m.phone && ` · ${m.phone}`}
                </p>
              </div>
              <span className="text-xs text-ink-soft">{fmt.format(m.createdAt)}</span>
            </div>
            <p className="mt-4 whitespace-pre-line">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                className="rounded-xl bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700 hover:bg-sky-100"
              >
                Responder
              </a>
              <ActionButton action={toggleMessageRead.bind(null, m.id, !m.read)} className="bg-slate-100 hover:bg-slate-200">
                {m.read ? "Marcar como no leído" : "Marcar como leído"}
              </ActionButton>
              <ActionButton action={deleteMessage.bind(null, m.id)} confirm="¿Eliminar este mensaje?" className="text-rose-600 hover:bg-rose-50">
                Eliminar
              </ActionButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
