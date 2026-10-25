import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { PageHero } from "@/components/PageHero";
import { getServices } from "@/lib/data";
import { clinicNow } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "Agendar cita",
  description: "Agenda en línea la cita de odontología infantil de tu hijo en menos de un minuto.",
};

async function Booking({ searchParams }: Pick<PageProps<"/agendar">, "searchParams">) {
  const { servicio } = await searchParams;
  await connection(); // "hoy" depende de la fecha actual de la clínica
  const services = await getServices();
  return (
    <BookingWizard
      services={services}
      today={clinicNow().date}
      initialSlug={typeof servicio === "string" ? servicio : undefined}
    />
  );
}

function BookingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="h-20 animate-pulse rounded-full bg-white/70" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-[1.75rem] bg-white/70" />
        ))}
      </div>
    </div>
  );
}

export default function BookingPage({ searchParams }: PageProps<"/agendar">) {
  return (
    <>
      <PageHero
        emoji="📅"
        title={<>Agenda tu <span className="text-shine">aventura</span></>}
        subtitle="Cuatro pasos sencillos y listo. Verás los horarios disponibles en tiempo real."
      />
      <section className="px-4 sm:px-6">
        <Suspense fallback={<BookingSkeleton />}>
          <Booking searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
