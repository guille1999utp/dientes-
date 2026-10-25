"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { colorOf } from "@/lib/colors";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  emoji: string;
  color: string;
  readMinutes: number;
  views: number;
  createdAt: Date;
};

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(() => ["Todos", ...new Set(posts.map((p) => p.category))], [posts]);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return posts.filter(
      (p) =>
        (category === "Todos" || p.category === category) &&
        (!q || normalize(`${p.title} ${p.excerpt} ${p.category}`).includes(q)),
    );
  }, [posts, category, deferredQuery]);

  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-center gap-5">
        <label className="relative w-full max-w-xl">
          <span className="sr-only">Buscar artículos</span>
          <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-xl">🔎</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca: caries, cepillado, chupo..."
            className="field !rounded-full !py-4 !pl-14 text-lg shadow-md"
          />
        </label>
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categorías">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 font-display font-medium transition-all ${
                category === c ? "scale-105 bg-ink text-white shadow-lg" : "bg-white text-ink hover:bg-sky-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-6xl">🦷❓</div>
          <p className="mt-4 text-lg text-ink-soft">No encontramos artículos con esa búsqueda. ¡Intenta con otra palabra!</p>
        </div>
      ) : (
        <>
          {featured && (
            <Link
              key={featured.id}
              href={`/blog/${featured.slug}`}
              className="group card mt-12 grid animate-pop overflow-hidden md:grid-cols-2"
            >
              <div className={`grid min-h-64 place-items-center bg-gradient-to-br ${colorOf(featured.color).gradient} text-[7rem]`}>
                <span className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">{featured.emoji}</span>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="w-fit rounded-full bg-lemon/50 px-3 py-1 text-sm font-bold">⭐ Destacado · {featured.category}</span>
                <h2 className="mt-4 text-3xl font-bold group-hover:text-brand sm:text-4xl">{featured.title}</h2>
                <p className="mt-3 text-lg text-ink-soft">{featured.excerpt}</p>
                <span className="mt-5 text-sm font-semibold text-ink-soft">
                  ⏱️ {featured.readMinutes} min de lectura · 👀 {featured.views} lecturas
                </span>
              </div>
            </Link>
          )}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => {
              const c = colorOf(p.color);
              return (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group card flex animate-pop flex-col overflow-hidden transition-transform hover:-translate-y-2"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`grid h-40 place-items-center bg-gradient-to-br ${c.gradient} text-6xl`}>
                    <span className="transition-transform duration-500 group-hover:scale-125">{p.emoji}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className={`text-sm font-bold ${c.text}`}>{p.category}</span>
                    <h3 className="mt-2 text-xl font-semibold group-hover:text-brand">{p.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-ink-soft">{p.excerpt}</p>
                    <span className="mt-4 text-sm text-ink-soft">
                      ⏱️ {p.readMinutes} min · 👀 {p.views}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
