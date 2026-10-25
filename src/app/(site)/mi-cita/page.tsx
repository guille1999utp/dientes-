import type { Metadata } from "next";
import { AppointmentLookup } from "@/components/AppointmentLookup";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Consultar mi cita",
  description: "Consulta el estado de tu cita o cancélala con tu código de reserva.",
};

export default function MyAppointmentPage() {
  return (
    <>
      <PageHero
        emoji="🔎"
        title={<>Consulta tu <span className="text-shine">cita</span></>}
        subtitle="Escribe el código que recibiste al agendar y el correo que usaste para ver el estado de tu cita."
      />
      <section className="px-4 sm:px-6">
        <AppointmentLookup />
      </section>
    </>
  );
}
