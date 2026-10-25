"use client";

import { useActionState } from "react";
import { login } from "@/actions/admin";
import type { FormState } from "@/actions/public";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { ok: false } as FormState);
  return (
    <form action={action} className="mt-6 grid gap-4 text-left">
      <label>
        <span className="label">Contraseña</span>
        <input name="password" type="password" className="field" autoFocus required aria-invalid={!!state.message} />
      </label>
      {state.message && <p className="font-semibold text-rose-500">{state.message}</p>}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar 🔐"}
      </button>
    </form>
  );
}
