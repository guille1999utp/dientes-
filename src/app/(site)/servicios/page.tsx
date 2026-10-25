import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Servicios de odontología infantil",
  description: "Primera visita, limpieza, flúor y sellantes, tratamiento de caries, ortodoncia preventiva y urgencias para niños en Pereira.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        emoji="🦷"
        title={<>Servicios para <span className="text-shine">sonrisas pequeñas</span></>}
        subtitle="Tratamientos suaves, explicados con juegos y adaptados a cada edad. Elige uno para conocer más detalles."
      />
      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90}>
              <ServiceCard service={s} showPrice />
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-4xl rounded-[2rem] bg-amber-100 p-8 text-center sm:p-10">
          <h2 className="text-3xl font-bold">¿No sabes cuál elegir? 🤔</h2>
          <p className="mt-3 text-lg text-ink-soft">
            Agenda una valoración y te recomendamos el plan ideal para tu peque. Los precios son de referencia y pueden variar
            según la valoración.
          </p>
          <Link href="/agendar" className="btn btn-primary mt-6">
            Agendar valoración
          </Link>
        </div>
      </section>
    </>
  );
}
