import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { TestimonialForm } from "@/components/TestimonialForm";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escríbenos, llámanos o visítanos en ${site.address}.`,
};

export default function ContactPage() {
  const cards = [
    { emoji: "💬", title: "WhatsApp", text: "Respuesta en minutos", href: whatsappLink(), color: "bg-emerald-100" },
    { emoji: "📞", title: "Llámanos", text: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, color: "bg-sky-100" },
    { emoji: "✉️", title: "Correo", text: site.email, href: `mailto:${site.email}`, color: "bg-rose-100" },
  ];

  return (
    <>
      <PageHero
        emoji="👋"
        title={<>¡Hablemos! <span className="text-shine">Estamos aquí</span></>}
        subtitle="Resolvemos tus dudas sobre tratamientos, precios, seguros o lo que necesites."
      />
      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group card flex items-center gap-4 p-5 transition-transform hover:-translate-y-1"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-2xl ${c.color} text-3xl group-hover:animate-wiggle`}>{c.emoji}</span>
              <span>
                <span className="block font-display text-lg font-semibold">{c.title}</span>
                <span className="text-sm text-ink-soft">{c.text}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />
          <div className="grid gap-6">
            <div className="card overflow-hidden">
              <iframe
                title="Mapa de Sonrisitas"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <div className="font-display text-lg font-semibold">📍 {site.address}</div>
                <ul className="mt-3 grid gap-2 text-sm">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4">
                      <span className="font-bold">{h.days}</span>
                      <span className="text-right text-ink-soft">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="opinion" className="mx-auto mt-20 max-w-3xl scroll-mt-28">
          <h2 className="text-center text-4xl font-bold">¿Ya nos visitaste? ⭐</h2>
          <p className="mt-2 mb-8 text-center text-lg text-ink-soft">Tu opinión ayuda a otras familias a perderle el miedo al odontólogo.</p>
          <TestimonialForm />
        </div>
      </section>
    </>
  );
}
