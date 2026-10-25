import Link from "next/link";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { FAQ } from "@/components/FAQ";
import { FloatingShapes } from "@/components/FloatingShapes";
import { Mascot } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { colorOf } from "@/lib/colors";
import { getHappySmilesCount, getPosts, getServices, getTestimonialStats, getTestimonials } from "@/lib/data";

const steps = [
  { emoji: "🧸", title: "Llegada a la sala de juegos", text: "Tu peque explora, juega y se familiariza con el lugar mientras esperan." },
  { emoji: "🦷", title: "Conoce a Dientín", text: "Le presentamos los instrumentos como si fueran juguetes: decir, mostrar y hacer." },
  { emoji: "🔍", title: "Revisión divertida", text: "Contamos dientes, buscamos 'bichitos' y limpiamos con pasta de su sabor favorito." },
  { emoji: "🏆", title: "Diploma y premio", text: "Celebramos su valentía con un diploma y un regalo del cofre del tesoro." },
];

const reasons = [
  { emoji: "🎓", title: "Especialistas en niños", text: "Odontopediatras certificados con años de experiencia en el manejo infantil." },
  { emoji: "🎨", title: "Consultorios temáticos", text: "Selva, océano y espacio: cada consultorio es una aventura distinta." },
  { emoji: "📺", title: "Pantallas en el techo", text: "Sus dibujos favoritos mientras los atendemos. ¡El tiempo vuela!" },
  { emoji: "🧼", title: "Bioseguridad total", text: "Protocolos de esterilización certificados para la tranquilidad de los papás." },
];

export default async function HomePage() {
  const [services, testimonials, stats, posts, smiles] = await Promise.all([
    getServices(),
    getTestimonials(),
    getTestimonialStats(),
    getPosts(),
    getHappySmilesCount(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="bg-dots relative overflow-hidden px-4 pt-8 pb-20 sm:px-6">
        <FloatingShapes />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex animate-pop items-center gap-2 rounded-full bg-white px-4 py-2 font-display font-medium shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Odontología infantil en Pereira
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
              Pequeñas sonrisas, <span className="text-shine">grandes aventuras</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft sm:text-xl lg:mx-0">
              Cuidamos los dientes de bebés, niños y adolescentes en un lugar lleno de juegos, colores y mucha paciencia.
              Aquí ir al odontólogo es <strong className="text-ink">¡divertido!</strong>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link href="/agendar" className="btn btn-primary text-lg">
                Agendar una cita 📅
              </Link>
              <Link href="/servicios" className="btn btn-ghost text-lg">
                Ver servicios
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex -space-x-3">
                {["🧒", "👧", "👦", "👶"].map((e) => (
                  <span key={e} className="grid h-12 w-12 place-items-center rounded-full border-4 border-cream bg-sky-100 text-2xl">
                    {e}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <div className="text-amber-400">★★★★★ <span className="font-bold text-ink">{stats.average.toFixed(1)}</span></div>
                <div className="text-sm text-ink-soft">+{smiles.toLocaleString("es-CO")} sonrisas felices</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto">
            <div className="absolute inset-0 m-auto h-80 w-80 animate-spin-slow rounded-full border-[14px] border-dashed border-sky-200 sm:h-[26rem] sm:w-[26rem]" />
            <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-gradient-to-br from-sky-200 via-rose-100 to-amber-100 blur-2xl sm:h-80 sm:w-80" />
            <div className="relative animate-float">
              <Mascot size={300} brush />
            </div>
            <div className="absolute top-6 -left-6 animate-bounce-soft rounded-2xl bg-white px-4 py-3 font-display font-semibold shadow-lg sm:-left-14">
              ¡Hola! Soy Dientín 👋
            </div>
            <div className="absolute -right-4 bottom-10 animate-float-slow rounded-2xl bg-white px-4 py-3 shadow-lg sm:-right-12">
              <div className="text-xs text-ink-soft">Próxima cita</div>
              <div className="font-display font-semibold text-emerald-600">¡Sin miedo! 💪</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto -mt-6 grid max-w-6xl grid-cols-2 gap-4 rounded-[2rem] bg-white p-6 shadow-xl sm:p-8 lg:grid-cols-4">
          {[
            { value: smiles, label: "Sonrisas felices", emoji: "😁", color: "text-sky-500" },
            { value: 12, label: "Años de experiencia", emoji: "🎂", color: "text-rose-500" },
            { value: stats.average, decimals: 1, label: `Calificación (${stats.count} reseñas)`, emoji: "⭐", color: "text-amber-500" },
            { value: services.length, label: "Servicios para peques", emoji: "🦷", color: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl">{s.emoji}</div>
              <div className={`font-display text-4xl font-bold ${s.color}`}>
                <AnimatedCounter value={s.value} decimals={s.decimals} />
              </div>
              <div className="text-sm font-semibold text-ink-soft">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="px-4 py-24 sm:px-6">
        <SectionTitle
          eyebrow="Nuestros servicios"
          title={<>Todo lo que su sonrisa <span className="text-brand">necesita</span></>}
          subtitle="Desde el primer dientito hasta la adolescencia, con tratamientos pensados para cada etapa."
        />
        <div className="mx-auto mt-14 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 90}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CÓMO ES UNA VISITA */}
      <section className="relative bg-sky-100/60 px-4 py-24 sm:px-6">
        <SectionTitle
          eyebrow="Paso a paso"
          title="¿Cómo es una visita a Sonrisitas?"
          subtitle="Diseñamos cada momento para que tu peque se sienta seguro, feliz y con ganas de volver."
        />
        <div className="relative mx-auto mt-14 max-w-6xl">
        <div aria-hidden className="absolute top-10 right-[12%] left-[12%] hidden border-t-4 border-dashed border-sky-300 md:block" />
        <ol className="relative grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 120} className="relative text-center">
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-4xl shadow-lg transition-transform hover:scale-110">
                  {s.emoji}
                  <span className="absolute -top-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-bubblegum font-display font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        </div>
      </section>

      {/* POR QUÉ NOSOTROS */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTitle
              center={false}
              eyebrow="¿Por qué Sonrisitas?"
              title={<>Un lugar hecho <span className="text-bubblegum">a su medida</span></>}
              subtitle="Sabemos que la primera experiencia marca para toda la vida. Por eso todo, desde las sillas hasta las palabras que usamos, está pensado para los niños."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rincon-infantil" className="btn btn-pink">
                Visitar el Rincón Infantil 🎮
              </Link>
              <Link href="/galeria" className="btn btn-ghost">
                Ver sonrisas ✨
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 100}>
                <div className={`card h-full p-6 transition-transform hover:-rotate-1 ${i % 2 ? "sm:translate-y-8" : ""}`}>
                  <div className="text-4xl">{r.emoji}</div>
                  <h3 className="mt-3 text-xl font-semibold">{r.title}</h3>
                  <p className="mt-2 text-ink-soft">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-4 py-24 sm:px-6">
        <SectionTitle eyebrow="Familias felices" title="Lo que dicen los papás" />
        <div className="mt-12">
          <TestimonialCarousel items={testimonials} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/contacto#opinion" className="font-display font-semibold text-brand hover:underline">
            ¿Ya nos visitaste? Deja tu opinión →
          </Link>
        </p>
      </section>

      {/* BLOG */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
          <SectionTitle center={false} eyebrow="Blog para papás" title="Consejos para sonrisas sanas" />
          <Link href="/blog" className="btn btn-ghost">
            Ver todos los artículos
          </Link>
        </div>
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => {
            const c = colorOf(p.color);
            return (
              <Reveal key={p.id} delay={i * 100}>
                <Link href={`/blog/${p.slug}`} className="group card block h-full overflow-hidden transition-transform hover:-translate-y-2">
                  <div className={`grid h-44 place-items-center bg-gradient-to-br ${c.gradient} text-7xl`}>
                    <span className="transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">{p.emoji}</span>
                  </div>
                  <div className="p-6">
                    <span className={`text-sm font-bold ${c.text}`}>{p.category} · {p.readMinutes} min</span>
                    <h3 className="mt-2 text-xl font-semibold group-hover:text-brand">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-ink-soft">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-24 sm:px-6">
        <SectionTitle eyebrow="Preguntas frecuentes" title="¿Tienes dudas? ¡Te ayudamos!" />
        <div className="mt-12">
          <FAQ />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 sm:px-6">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-violet-500 px-6 py-14 text-center text-white sm:px-12">
          <FloatingShapes />
          <div className="relative">
            <h2 className="text-4xl font-bold sm:text-5xl">¿Listos para la próxima aventura?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Agenda en menos de un minuto. Elige el servicio, el día y la hora que mejor les quede.
            </p>
            <Link href="/agendar" className="btn mt-8 bg-lemon text-lg text-ink shadow-[0_6px_0_#d4a817]">
              Reservar ahora 🚀
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
