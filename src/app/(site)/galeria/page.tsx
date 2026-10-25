import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import type { TeethVariant } from "@/components/TeethIllustration";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galería de sonrisas: antes y después",
  description: "Casos reales de tratamientos de odontología infantil: caries, ortodoncia preventiva, limpieza y sellantes.",
};

export default async function GalleryPage() {
  const cases = await getGallery();
  return (
    <>
      <PageHero
        emoji="✨"
        title={<>Galería de <span className="text-shine">sonrisas</span></>}
        subtitle="Arrastra el control de cada caso para ver la transformación. Ilustraciones basadas en tratamientos reales de nuestros pacientes."
      />
      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.id} delay={(i % 2) * 120}>
              <article className="card overflow-hidden p-4">
                <BeforeAfterSlider before={c.before as TeethVariant} after={c.after as TeethVariant} />
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">{c.treatment}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">👶 {c.childAge} años</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">⏱️ {c.duration}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold">{c.title}</h2>
                  <p className="mt-1 text-ink-soft">{c.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/agendar" className="btn btn-primary text-lg">
            Quiero una sonrisa así 😁
          </Link>
        </div>
      </section>
    </>
  );
}
