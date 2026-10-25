import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FloatingShapes } from "@/components/FloatingShapes";
import { ServiceCard } from "@/components/ServiceCard";
import { colorOf } from "@/lib/colors";
import { getService, getServices } from "@/lib/data";
import { formatCOP } from "@/lib/site";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Servicio no encontrado" };
  return { title: service.name, description: service.shortDescription };
}

async function ServiceDetail({ params }: Pick<PageProps<"/servicios/[slug]">, "params">) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getService(slug), getServices()]);
  if (!service || !service.active) notFound();

  const c = colorOf(service.color);
  const benefits = service.benefits.split("|");
  const related = all.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <section className={`relative overflow-hidden bg-gradient-to-br ${c.gradient} px-4 pt-10 pb-20 sm:px-6`}>
        <FloatingShapes />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link href="/servicios" className="font-display font-semibold text-ink-soft hover:text-ink">
              ← Todos los servicios
            </Link>
            <h1 className="mt-4 text-5xl font-bold sm:text-6xl">{service.name}</h1>
            <p className="mt-4 text-xl text-ink-soft">{service.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">👶 {service.ageRange}</span>
              <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">⏱️ {service.durationMin} min</span>
              <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">💰 Desde {formatCOP(service.priceFrom)}</span>
            </div>
            <Link href={`/agendar?servicio=${service.slug}`} className="btn btn-primary mt-8 text-lg">
              Agendar {service.name} 📅
            </Link>
          </div>
          <div className="mx-auto grid h-64 w-64 animate-float place-items-center rounded-[3rem] bg-white text-[8rem] shadow-2xl sm:h-72 sm:w-72">
            {service.emoji}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-8 sm:p-10">
            <h2 className="text-3xl font-bold">¿En qué consiste?</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{service.description}</p>
            <div className="mt-8 rounded-3xl bg-cream p-6">
              <h3 className="text-xl font-semibold">💡 Consejo de Dientín</h3>
              <p className="mt-2 text-ink-soft">
                Habla de la cita con entusiasmo y sin palabras que asusten. Cuéntale que vamos a contar sus dientes y que al final
                ¡hay premio!
              </p>
            </div>
          </div>
          <div className="card p-8">
            <h2 className="text-2xl font-bold">Beneficios</h2>
            <ul className="mt-5 grid gap-3">
              {benefits.map((b) => (
                <li key={b} className={`flex items-center gap-3 rounded-2xl ${c.soft} p-4 font-semibold`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${c.solid} text-white`}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <h2 className="text-center text-3xl font-bold">También te puede interesar</h2>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
          {related.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function ServicePage({ params }: PageProps<"/servicios/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto my-24 h-96 max-w-6xl animate-pulse rounded-[2rem] bg-white/70" />}>
      <ServiceDetail params={params} />
    </Suspense>
  );
}
