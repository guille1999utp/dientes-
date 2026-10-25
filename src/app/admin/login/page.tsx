import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = { title: "Ingresar al panel", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="bg-dots grid flex-1 place-items-center px-4 py-16">
      <div className="card w-full max-w-md p-8 text-center sm:p-10">
        <div className="mx-auto w-fit">
          <Mascot size={120} wave />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Panel Sonrisitas</h1>
        <p className="mt-1 text-ink-soft">Ingresa la contraseña del equipo</p>
        <LoginForm />
      </div>
    </main>
  );
}
