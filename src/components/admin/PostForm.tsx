"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePost } from "@/actions/admin";
import type { FormState } from "@/actions/public";
import { Markdown } from "@/components/Markdown";
import { colorNames, colorOf } from "@/lib/colors";

type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  emoji: string;
  color: string;
  readMinutes: number;
  published: boolean;
};

const EMPTY: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "## Subtítulo\n\nEscribe aquí el contenido. Usa **negritas** para resaltar.\n\n- Punto uno\n- Punto dos",
  category: "Prevención",
  emoji: "🦷",
  color: "sky",
  readMinutes: 3,
  published: true,
};

const EMOJIS = ["🦷", "🪥", "🍎", "🍼", "🦸", "👍", "🚑", "😁", "🧸", "💙", "⭐", "🛡️"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, { ok: false } as FormState);
  const [data, setData] = useState<Post>(post ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const err = (k: string) => state.errors?.[k]?.[0];

  const set = <K extends keyof Post>(key: K, value: Post[K]) => setData((d) => ({ ...d, [key]: value }));
  const words = data.content.trim().split(/\s+/).filter(Boolean).length;
  const c = colorOf(data.color);

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-2">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <div className="card grid content-start gap-4 p-6">
        {state.message && <p className="rounded-2xl bg-rose-100 p-3 font-semibold text-rose-700">{state.message}</p>}
        <label>
          <span className="label">Título</span>
          <input
            name="title"
            className="field"
            value={data.title}
            aria-invalid={!!err("title")}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
          />
          {err("title") && <span className="text-sm font-semibold text-rose-500">{err("title")}</span>}
        </label>
        <label>
          <span className="label">Slug (URL)</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-soft">/blog/</span>
            <input
              name="slug"
              className="field"
              value={data.slug}
              aria-invalid={!!err("slug")}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
            />
          </div>
          {err("slug") && <span className="text-sm font-semibold text-rose-500">{err("slug")}</span>}
        </label>
        <label>
          <span className="label">Resumen</span>
          <textarea name="excerpt" className="field min-h-20" value={data.excerpt} aria-invalid={!!err("excerpt")} onChange={(e) => set("excerpt", e.target.value)} />
          {err("excerpt") && <span className="text-sm font-semibold text-rose-500">{err("excerpt")}</span>}
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className="label">Categoría</span>
            <input name="category" className="field" value={data.category} list="categories" onChange={(e) => set("category", e.target.value)} />
            <datalist id="categories">
              {["Bebés", "Prevención", "Alimentación", "Emociones", "Hábitos", "Urgencias", "Ortodoncia"].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="label">Minutos de lectura</span>
            <input name="readMinutes" type="number" min={1} max={60} className="field" value={data.readMinutes} onChange={(e) => set("readMinutes", Number(e.target.value))} />
          </label>
          <label className="flex items-center gap-3 pt-6">
            <input name="published" type="checkbox" className="h-5 w-5 accent-[var(--color-brand)]" checked={data.published} onChange={(e) => set("published", e.target.checked)} />
            <span className="font-bold">Publicado</span>
          </label>
        </div>
        <div>
          <span className="label">Emoji de portada</span>
          <input type="hidden" name="emoji" value={data.emoji} />
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => set("emoji", e)}
                className={`grid h-11 w-11 place-items-center rounded-xl text-2xl transition ${data.emoji === e ? "scale-110 bg-sky-100 ring-2 ring-brand" : "bg-slate-50 hover:bg-slate-100"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="label">Color</span>
          <input type="hidden" name="color" value={data.color} />
          <div className="flex gap-2">
            {colorNames.map((name) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                onClick={() => set("color", name)}
                className={`h-10 w-10 rounded-full ${colorOf(name).solid} transition ${data.color === name ? "scale-110 ring-4 ring-ink/20" : ""}`}
              />
            ))}
          </div>
        </div>
        <label>
          <span className="label">
            Contenido <span className="font-normal text-ink-soft">(## subtítulo, - lista, **negrita**) · {words} palabras</span>
          </span>
          <textarea
            name="content"
            className="field min-h-80 font-mono text-sm"
            value={data.content}
            aria-invalid={!!err("content")}
            onChange={(e) => set("content", e.target.value)}
          />
          {err("content") && <span className="text-sm font-semibold text-rose-500">{err("content")}</span>}
        </label>
        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={pending}>
            {pending ? "Guardando..." : post?.id ? "Guardar cambios" : "Crear artículo"}
          </button>
          <Link href="/admin/blog" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
      </div>

      <div className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-2 text-sm font-bold text-ink-soft uppercase">Vista previa en vivo</p>
        <div className="card max-h-[80vh] overflow-y-auto">
          <div className={`bg-gradient-to-br ${c.gradient} p-8 text-center`}>
            <div className="text-6xl">{data.emoji}</div>
            <span className={`mt-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold ${c.text}`}>{data.category}</span>
            <h2 className="mt-3 text-3xl font-bold">{data.title || "Título del artículo"}</h2>
          </div>
          <div className="p-8">
            <p className="mb-6 text-lg font-semibold">{data.excerpt || "Resumen del artículo..."}</p>
            <Markdown content={data.content} />
          </div>
        </div>
      </div>
    </form>
  );
}
