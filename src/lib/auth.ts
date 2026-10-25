import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function isAdmin() {
  await connection(); // la verificación depende de la hora actual: siempre en tiempo de solicitud
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Verificación obligatoria dentro de cada Server Action y página del panel. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
