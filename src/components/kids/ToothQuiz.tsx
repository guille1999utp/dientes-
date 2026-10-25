"use client";

import { useState } from "react";
import { Confetti } from "@/components/Confetti";
import { Mascot } from "@/components/Mascot";

const QUESTIONS = [
  { q: "Los dientes de leche no importan porque se van a caer.", answer: false, why: "¡Sí importan! Guardan el espacio para los dientes nuevos y nos ayudan a hablar y masticar." },
  { q: "Debemos cepillarnos los dientes 2 veces al día por 2 minutos.", answer: true, why: "¡Correcto! Mañana y noche, durante dos minutos. ¡Usa nuestro temporizador!" },
  { q: "Los dulces son los únicos que causan caries.", answer: false, why: "Las galletas, el pan y los jugos también tienen azúcares que alimentan a los bichitos." },
  { q: "El esmalte de los dientes es lo más duro del cuerpo humano.", answer: true, why: "¡Así es! Es más duro que los huesos. Pero el azúcar puede debilitarlo." },
  { q: "Hay que cambiar el cepillo de dientes cada 3 meses.", answer: true, why: "¡Exacto! O antes si las cerdas se ven abiertas como una flor." },
  { q: "Los adultos tienen 20 dientes, igual que los niños.", answer: false, why: "Los niños tienen 20 dientes de leche y los adultos ¡hasta 32 dientes permanentes!" },
  { q: "La seda dental limpia lugares donde el cepillo no llega.", answer: true, why: "¡Sí! Entre diente y diente se esconden restos de comida." },
  { q: "Si no me duele, no necesito ir al odontólogo.", answer: false, why: "Las visitas cada 6 meses ayudan a encontrar problemas antes de que duelan." },
];

export function ToothQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);

  const finished = index >= QUESTIONS.length;
  const current = QUESTIONS[index];
  const correct = picked !== null && picked === current?.answer;

  const pick = (value: boolean) => {
    if (picked !== null) return;
    setPicked(value);
    if (value === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
  };

  if (finished) {
    const great = score >= 6;
    return (
      <div className="animate-pop text-center">
        {great && <Confetti />}
        <div className="mx-auto w-fit">
          <Mascot size={160} mood={great ? "wink" : "happy"} />
        </div>
        <h3 className="mt-4 text-4xl font-bold">
          {score} de {QUESTIONS.length} {great ? "🏆" : "💪"}
        </h3>
        <p className="mt-2 text-lg text-ink-soft">
          {great ? "¡Eres un experto en dientes! Dientín está orgulloso." : "¡Buen intento! Juega otra vez para aprender más."}
        </p>
        <button type="button" onClick={restart} className="btn btn-primary mt-6">
          🔄 Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm font-bold text-ink-soft">
        <span>
          Pregunta {index + 1} de {QUESTIONS.length}
        </span>
        <span>⭐ {score} puntos</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-gradient-to-r from-lemon to-bubblegum transition-all duration-500" style={{ width: `${(index / QUESTIONS.length) * 100}%` }} />
      </div>

      <div key={index} className="mt-6 flex animate-pop flex-col items-center gap-6 sm:flex-row">
        <div className="shrink-0">
          <Mascot size={120} wave={picked === null} mood={picked === null ? "happy" : correct ? "wink" : "wow"} />
        </div>
        <div className="relative w-full rounded-3xl bg-white p-6 shadow-md">
          <span className="absolute top-1/2 -left-2 hidden h-5 w-5 -translate-y-1/2 rotate-45 bg-white sm:block" />
          <p className="font-display text-2xl leading-snug font-semibold">{current.q}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          { value: true, label: "✅ Verdad" },
          { value: false, label: "❌ Mito" },
        ].map((opt) => {
          const isAnswer = picked !== null && opt.value === current.answer;
          const isWrongPick = picked === opt.value && !correct;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => pick(opt.value)}
              disabled={picked !== null}
              className={`rounded-3xl p-5 font-display text-2xl font-bold transition-all ${
                isAnswer
                  ? "scale-105 bg-emerald-400 text-white shadow-[0_6px_0_#059669]"
                  : isWrongPick
                    ? "animate-wiggle bg-rose-400 text-white"
                    : "bg-white shadow-[0_6px_0_rgba(35,48,90,0.12)] hover:-translate-y-1"
              } ${picked !== null && !isAnswer && !isWrongPick ? "opacity-40" : ""}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className={`mt-6 animate-pop rounded-3xl p-5 ${correct ? "bg-emerald-50" : "bg-amber-50"}`}>
          <p className="font-display text-xl font-semibold">{correct ? "¡Correcto! 🎉" : "¡Uy, casi! 🤔"}</p>
          <p className="mt-1 text-ink-soft">{current.why}</p>
          <button type="button" onClick={next} className="btn btn-primary mt-4">
            {index === QUESTIONS.length - 1 ? "Ver resultado 🏁" : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
