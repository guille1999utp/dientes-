import type { Metadata } from "next";
import { BlogExplorer } from "@/components/BlogExplorer";
import { PageHero } from "@/components/PageHero";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog para papás",
  description: "Consejos de odontopediatría: cepillado, alimentación, hábitos, urgencias y cómo quitarle el miedo al odontólogo.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        emoji="📚"
        title={<>Blog para <span className="text-shine">papás y mamás</span></>}
        subtitle="Consejos sencillos y basados en evidencia para cuidar la sonrisa de tus hijos en casa."
      />
      <section className="px-4 sm:px-6">
        <BlogExplorer posts={posts} />
      </section>
    </>
  );
}
