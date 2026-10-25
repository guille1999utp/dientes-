const faqs = [
  {
    q: "¿Desde qué edad atienden a los niños?",
    a: "Desde el nacimiento hasta los 17 años. Recomendamos la primera visita cuando sale el primer diente o antes de cumplir un año.",
  },
  {
    q: "¿Puedo entrar al consultorio con mi hijo?",
    a: "¡Claro! Los papás son parte del equipo. En algunos casos, con niños mayores, sugerimos que esperen afuera para fomentar su autonomía, siempre de común acuerdo.",
  },
  {
    q: "Mi hijo tiene mucho miedo, ¿qué hacen?",
    a: "Usamos el método decir-mostrar-hacer, refuerzo positivo, distracción con juegos y pantallas en el techo. Nunca forzamos un tratamiento: vamos al ritmo de cada peque.",
  },
  {
    q: "¿Reciben seguros o EPS?",
    a: "Trabajamos con varias pólizas y medicina prepagada. Escríbenos por WhatsApp con el nombre de tu aseguradora y te confirmamos la cobertura.",
  },
  {
    q: "¿Cómo puedo cancelar o reprogramar una cita?",
    a: "Desde la sección \"Mi cita\" con tu código de reserva y correo, o escribiéndonos por WhatsApp con al menos 24 horas de anticipación.",
  },
  {
    q: "¿Qué hago en caso de una urgencia?",
    a: "Escríbenos por WhatsApp o llámanos. Atendemos urgencias el mismo día. Si un diente permanente se cae, guárdalo en leche y ven de inmediato.",
  },
];

export function FAQ() {
  return (
    <div className="mx-auto grid max-w-3xl gap-3">
      {faqs.map((f, i) => (
        <details key={f.q} className="group card overflow-hidden" open={i === 0}>
          <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-display text-lg font-semibold sm:p-6">
            {f.q}
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-brand transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-5 pb-6 text-ink-soft sm:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
