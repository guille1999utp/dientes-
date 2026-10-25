import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/Markdown";
import { Mascot } from "@/components/Mascot";
import { ViewCounter } from "@/components/ViewCounter";
import { colorOf } from "@/lib/colors";
import { getPost, getPosts } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

const dateFmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });

async function Article({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const c = colorOf(post.color);
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article>
      <header className={`bg-gradient-to-br ${c.gradient} px-4 pt-10 pb-24 sm:px-6`}>
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/blog" className="font-display font-semibold text-ink-soft hover:text-ink">
            ← Volver al blog
          </Link>
          <div className="mx-auto mt-6 grid h-24 w-24 animate-bounce-soft place-items-center rounded-3xl bg-white text-6xl shadow-lg">
            {post.emoji}
          </div>
          <span className={`mt-6 inline-block rounded-full bg-white px-4 py-1 text-sm font-bold ${c.text}`}>{post.category}</span>
          <h1 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">{post.title}</h1>
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-soft">
            <span>📅 {dateFmt.format(post.createdAt)}</span>
            <span>⏱️ {post.readMinutes} min de lectura</span>
            <ViewCounter slug={post.slug} initial={post.views} />
          </p>
        </div>
      </header>

      <div className="px-4 sm:px-6">
        <div className="card mx-auto -mt-14 max-w-3xl p-6 sm:p-12">
          <p className="mb-8 text-xl leading-relaxed font-semibold text-ink">{post.excerpt}</p>
          <Markdown content={post.content} />

          <div className="mt-12 flex flex-col items-center gap-6 rounded-3xl bg-sky-50 p-6 text-center sm:flex-row sm:text-left">
            <Mascot size={110} wave />
            <div>
              <h2 className="text-2xl font-bold">¿Quieres que revisemos su sonrisa?</h2>
              <p className="mt-1 text-ink-soft">Agenda una cita y resolvemos todas tus dudas en persona.</p>
              <Link href="/agendar" className="btn btn-primary mt-4">
                Agendar cita
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold">Sigue leyendo</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group card flex items-center gap-4 p-5 hover:-translate-y-1 transition-transform">
                  <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${colorOf(p.color).bg} text-3xl`}>{p.emoji}</span>
                  <span className="font-display text-lg font-semibold group-hover:text-brand">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto my-24 h-[32rem] max-w-3xl animate-pulse rounded-[2rem] bg-white/70" />}>
      <Article params={params} />
    </Suspense>
  );
}
