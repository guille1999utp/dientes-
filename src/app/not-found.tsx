import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export default function NotFound() {
  return (
    <main className="bg-dots grid flex-1 place-items-center px-4 py-20 text-center">
      <div>
        <div className="mx-auto w-fit animate-float">
          <Mascot size={200} mood="wow" />
        </div>
        <h1 className="mt-6 text-6xl font-bold">404</h1>
        <p className="mt-3 text-xl text-ink-soft">¡Uy! Esta página se nos perdió como un diente de leche. 🐭</p>
        <Link href="/" className="btn btn-primary mt-8">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
