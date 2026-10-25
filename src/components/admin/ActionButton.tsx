"use client";

import { useTransition, type ReactNode } from "react";

/** Botón que ejecuta una Server Action con estado de carga y confirmación opcional. */
export function ActionButton({
  action,
  confirm,
  className = "",
  children,
  title,
}: {
  action: () => Promise<void>;
  confirm?: string;
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        startTransition(() => action());
      }}
      className={`rounded-xl px-3 py-1.5 text-sm font-bold transition disabled:opacity-50 ${className}`}
    >
      {pending ? "…" : children}
    </button>
  );
}
