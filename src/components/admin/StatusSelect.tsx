"use client";

import { useOptimistic, useTransition } from "react";
import { setAppointmentStatus } from "@/actions/admin";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/status";

export function StatusSelect({ id, status }: { id: number; status: string }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={optimistic}
      autoComplete="off"
      disabled={pending}
      aria-label="Estado de la cita"
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          setOptimistic(next);
          await setAppointmentStatus(id, next);
        });
      }}
      className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-sm font-bold outline-none ${STATUS_STYLES[optimistic]} ${pending ? "opacity-60" : ""}`}
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
