import type { Metadata } from "next";
import Link from "next/link";
import { BrushingTimer } from "@/components/kids/BrushingTimer";
import { FactCards } from "@/components/kids/FactCards";
import { ToothQuiz } from "@/components/kids/ToothQuiz";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Rincón Infantil: juegos para cuidar los dientes",
  description: "Temporizador de cepillado, quiz de mitos y verdades y datos curiosos sobre los dientes para niños.",
};

export default function KidsCornerPage() {
  return (
    <>
      <PageHero
        emoji="🎮"
        title={<>Rincón <span className="text-shine">Infantil</span></>}
        subtitle="¡Aprende a cuidar tus dientes jugando con Dientín! Cepíllate con el temporizador, pon a prueba lo que sabes y descubre datos increíbles."
      >
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#cepillado" className="btn btn-primary">🪥 Cepillado</a>
          <a href="#quiz" className="btn btn-pink">❓ Quiz</a>
          <a href="#curiosidades" className="btn btn-ghost">🦈 Curiosidades</a>
        </nav>
      </PageHero>

      <section id="cepillado" className="scroll-mt-24 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-br from-sky-100 to-white p-6 shadow-inner sm:p-12">
          <SectionTitle eyebrow="Juego 1" title="Temporizador de cepillado" subtitle="Dos minutos, cuatro zonas. ¡Limpia a Dientín mientras te cepillas!" />
          <div className="mt-10">
            <BrushingTimer />
          </div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-24 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-br from-rose-100 to-amber-50 p-6 sm:p-12">
          <SectionTitle eyebrow="Juego 2" title="¿Mito o verdad?" subtitle="Responde las preguntas de Dientín y conviértete en un experto en sonrisas." />
          <div className="mt-10">
            <ToothQuiz />
          </div>
        </div>
      </section>

      <section id="curiosidades" className="scroll-mt-24 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Para descubrir" title="Datos dentales increíbles" subtitle="Toca cada tarjeta para voltearla." />
          <div className="mt-10">
            <FactCards />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center sm:px-6">
        <p className="text-lg text-ink-soft">¿Listo para conocer a Dientín en persona?</p>
        <Link href="/agendar" className="btn btn-primary mt-4 text-lg">
          ¡Quiero ir a Sonrisitas! 🦷
        </Link>
      </section>
    </>
  );
}
