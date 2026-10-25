import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Chequeo optimista: redirige al login si no hay sesión válida.
// Las páginas y acciones del panel vuelven a verificar con requireAdmin().
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const valid = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return valid ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (!valid) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
