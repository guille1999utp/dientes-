"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Confetti } from "@/components/Confetti";
import { Mascot } from "@/components/Mascot";

const TOTAL = 120;
const ZONES = [
  { label: "Arriba a la derecha", emoji: "↗️" },
  { label: "Arriba a la izquierda", emoji: "↖️" },
  { label: "Abajo a la izquierda", emoji: "↙️" },
  { label: "Abajo a la derecha", emoji: "↘️" },
];
const CHEERS = ["¡Muy bien!", "¡Sigue así!", "¡Eres un campeón!", "¡Casi terminamos!"];

function ding(frequency = 880) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // sin audio disponible
  }
}

const STARS_KEY = "sonrisitas:stars";
const starListeners = new Set<() => void>();

function subscribeStars(callback: () => void) {
  starListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    starListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readStars() {
  try {
    return Number(localStorage.getItem(STARS_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function addStar() {
  try {
    localStorage.setItem(STARS_KEY, String(readStars() + 1));
  } catch {
    // almacenamiento no disponible
  }
  starListeners.forEach((l) => l());
}

export function BrushingTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const stars = useSyncExternalStore(subscribeStars, readStars, () => 0);
  const elapsedRef = useRef(0);
  const soundRef = useRef(sound);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const prev = elapsedRef.current;
      const next = Math.min(prev + 1, TOTAL);
      elapsedRef.current = next;
      setElapsed(next);
      if (next >= TOTAL) {
        setRunning(false);
        if (soundRef.current) ding(1320);
        addStar();
      } else if (Math.floor(next / 30) !== Math.floor(prev / 30) && soundRef.current) {
        ding(660 + Math.floor(next / 30) * 110);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const done = elapsed >= TOTAL;
  const zone = Math.min(Math.floor(elapsed / 30), 3);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    elapsedRef.current = 0;
  };

  const remaining = TOTAL - elapsed;
  const progress = elapsed / TOTAL;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {done && <Confetti />}
      <div className="relative mx-auto grid h-80 w-80 place-items-center">
        <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="140" cy="140" r={radius} fill="white" stroke="#e0f2fe" strokeWidth="18" />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="url(#timer-gradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timer-gradient">
              <stop offset="0%" stopColor="#3aa0ff" />
              <stop offset="100%" stopColor="#ff7eb6" />
            </linearGradient>
          </defs>
        </svg>
        <div className={running ? "animate-bounce-soft" : ""}>
          <Mascot size={150} brush={running} wave={!running} shine={done ? 1 : progress} mood={done ? "wink" : running ? "happy" : "wow"} />
        </div>
      </div>

      <div className="text-center lg:text-left">
        <div className="font-display text-7xl font-bold tabular-nums">
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </div>

        {done ? (
          <p className="mt-4 animate-pop text-2xl font-bold text-emerald-600">✨ ¡Dientes brillantes! Ganaste una estrella ⭐</p>
        ) : running ? (
          <div className="mt-4 animate-pop" key={zone}>
            <p className="text-sm font-bold text-ink-soft uppercase">Ahora cepilla</p>
            <p className="text-3xl font-bold text-brand">
              {ZONES[zone].emoji} {ZONES[zone].label}
            </p>
            <p className="mt-1 font-display text-lg text-bubblegum">{CHEERS[zone]}</p>
          </div>
        ) : (
          <p className="mt-4 text-lg text-ink-soft">Presiona comenzar y cepilla cada zona hasta que Dientín te avise. ¡Mira cómo se pone brillante!</p>
        )}

        <div className="mt-6 grid max-w-sm grid-cols-4 gap-2 lg:max-w-none">
          {ZONES.map((z, i) => (
            <div
              key={z.label}
              className={`rounded-2xl p-2 text-center text-xs font-bold transition-all ${
                elapsed >= (i + 1) * 30 ? "bg-emerald-100 text-emerald-700" : i === zone && running ? "scale-105 bg-sky-100 text-sky-700 ring-2 ring-brand" : "bg-white text-ink-soft"
              }`}
            >
              <div className="text-xl">{elapsed >= (i + 1) * 30 ? "✅" : z.emoji}</div>
              {z.label.replace("Arriba a la ", "Arriba ").replace("Abajo a la ", "Abajo ")}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
          {!done && (
            <button type="button" onClick={() => setRunning((r) => !r)} className="btn btn-primary text-lg">
              {running ? "⏸️ Pausar" : elapsed > 0 ? "▶️ Continuar" : "▶️ Comenzar"}
            </button>
          )}
          <button type="button" onClick={reset} className="btn btn-ghost">
            🔄 {done ? "Otra vez" : "Reiniciar"}
          </button>
          <button type="button" onClick={() => setSound((s) => !s)} className="btn btn-ghost" aria-pressed={sound}>
            {sound ? "🔊" : "🔇"}
          </button>
        </div>
        <p className="mt-6 font-display text-lg">
          Tus estrellas: <span className="text-amber-400">{"⭐".repeat(Math.min(stars, 10))}</span>{" "}
          <span className="font-bold">{stars}</span>
        </p>
      </div>
    </div>
  );
}
