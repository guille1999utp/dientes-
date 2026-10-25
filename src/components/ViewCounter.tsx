"use client";

import { useEffect, useState } from "react";
import { registerPostView } from "@/actions/public";

export function ViewCounter({ slug, initial }: { slug: string; initial: number }) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sin almacenamiento disponible: contamos igual
    }
    registerPostView(slug).then((v) => v !== null && setViews(v));
  }, [slug]);

  return <span>👀 {views.toLocaleString("es-CO")} lecturas</span>;
}
