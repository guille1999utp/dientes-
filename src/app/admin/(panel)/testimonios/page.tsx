import { deleteTestimonial, setTestimonialApproved } from "@/actions/admin";
import { ActionButton } from "@/components/admin/ActionButton";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function TestimonialsPage() {
  await requireAdmin();
  const items = await db.testimonial.findMany({ orderBy: [{ approved: "asc" }, { createdAt: "desc" }] });
  const pending = items.filter((t) => !t.approved).length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold">Testimonios ⭐</h1>
        <p className="text-ink-soft">
          {items.length} en total · {pending} esperando aprobación
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <article key={t.id} className={`card flex flex-col p-6 ${t.approved ? "" : "ring-2 ring-amber-300"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xl text-amber-400" aria-label={`${t.rating} estrellas`}>
                {"★".repeat(t.rating)}
                <span className="text-ink/15">{"★".repeat(5 - t.rating)}</span>
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {t.approved ? "Publicado" : "Pendiente"}
              </span>
            </div>
            <p className="mt-3 flex-1">“{t.comment}”</p>
            <p className="mt-3 text-sm font-semibold text-ink-soft">
              — {t.parentName}
              {t.childName && `, familia de ${t.childName}`}
            </p>
            <div className="mt-4 flex gap-2">
              <ActionButton
                action={setTestimonialApproved.bind(null, t.id, !t.approved)}
                className={t.approved ? "bg-slate-100 hover:bg-slate-200" : "bg-emerald-500 text-white hover:bg-emerald-600"}
              >
                {t.approved ? "Ocultar" : "Aprobar y publicar"}
              </ActionButton>
              <ActionButton action={deleteTestimonial.bind(null, t.id)} confirm="¿Eliminar este testimonio?" className="text-rose-600 hover:bg-rose-50">
                Eliminar
              </ActionButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
