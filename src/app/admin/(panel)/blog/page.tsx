import Link from "next/link";
import { deletePost, togglePostPublished } from "@/actions/admin";
import { ActionButton } from "@/components/admin/ActionButton";
import { requireAdmin } from "@/lib/auth";
import { colorOf } from "@/lib/colors";
import { db } from "@/lib/db";

const fmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

export default async function BlogAdminPage() {
  await requireAdmin();
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" }, omit: { content: true } });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog 📝</h1>
          <p className="text-ink-soft">{posts.length} artículos · {posts.reduce((s, p) => s + p.views, 0)} lecturas en total</p>
        </div>
        <Link href="/admin/blog/nuevo" className="btn btn-primary">
          + Nuevo artículo
        </Link>
      </div>
      <div className="card divide-y divide-ink/5">
        {posts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-4 p-4">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${colorOf(p.color).bg} text-3xl`}>{p.emoji}</span>
            <div className="min-w-48 flex-1">
              <Link href={`/admin/blog/${p.id}`} className="font-display text-lg font-semibold hover:text-brand">
                {p.title}
              </Link>
              <p className="text-sm text-ink-soft">
                {p.category} · {fmt.format(p.createdAt)} · 👀 {p.views}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
              {p.published ? "Publicado" : "Borrador"}
            </span>
            <div className="flex gap-1">
              {p.published && (
                <Link href={`/blog/${p.slug}`} target="_blank" className="rounded-xl px-3 py-1.5 text-sm font-bold hover:bg-slate-100">
                  Ver ↗
                </Link>
              )}
              <Link href={`/admin/blog/${p.id}`} className="rounded-xl px-3 py-1.5 text-sm font-bold text-sky-700 hover:bg-sky-50">
                Editar
              </Link>
              <ActionButton action={togglePostPublished.bind(null, p.id, !p.published)} className="hover:bg-slate-100">
                {p.published ? "Despublicar" : "Publicar"}
              </ActionButton>
              <ActionButton action={deletePost.bind(null, p.id)} confirm={`¿Eliminar "${p.title}"?`} className="text-rose-600 hover:bg-rose-50">
                Eliminar
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
