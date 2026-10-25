import Link from "next/link";
import { colorOf } from "@/lib/colors";
import { formatCOP } from "@/lib/site";

type Service = {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  shortDescription: string;
  ageRange: string;
  priceFrom: number;
};

export function ServiceCard({ service, showPrice = false }: { service: Service; showPrice?: boolean }) {
  const c = colorOf(service.color);
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group card relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <span className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${c.soft} transition-transform duration-500 group-hover:scale-150`} />
      <span className={`relative grid h-16 w-16 place-items-center rounded-2xl ${c.bg} text-4xl group-hover:animate-wiggle`}>
        {service.emoji}
      </span>
      <h3 className="relative mt-5 text-2xl font-semibold">{service.name}</h3>
      <p className="relative mt-2 flex-1 text-ink-soft">{service.shortDescription}</p>
      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className={`rounded-full ${c.soft} px-3 py-1 font-bold ${c.text}`}>👶 {service.ageRange}</span>
        {showPrice ? (
          <span className="font-bold text-ink">Desde {formatCOP(service.priceFrom)}</span>
        ) : (
          <span className={`font-display font-semibold ${c.text} transition-transform group-hover:translate-x-1`}>Ver más →</span>
        )}
      </div>
    </Link>
  );
}
