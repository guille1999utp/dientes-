export const site = {
  name: "Sonrisitas",
  fullName: "Sonrisitas Odontología Infantil",
  tagline: "Odontopediatría con amor, juego y ciencia",
  description:
    "Clínica de odontología infantil en Pereira. Cuidamos la sonrisa de bebés, niños y adolescentes en un ambiente divertido y sin miedo.",
  phone: "+57 300 123 4567",
  whatsapp: "573001234567",
  email: "hola@sonrisitas.co",
  address: "Cra. 13 #15-20, Centro, Pereira, Risaralda",
  mapQuery: "Pereira, Risaralda, Colombia",
  hours: [
    { days: "Lunes a viernes", time: "8:00 a.m. – 12:00 m. · 2:00 p.m. – 6:00 p.m." },
    { days: "Sábados", time: "8:00 a.m. – 1:00 p.m." },
    { days: "Domingos", time: "Cerrado (urgencias por WhatsApp)" },
  ],
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
};

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/galeria", label: "Sonrisas" },
  { href: "/rincon-infantil", label: "Rincón Infantil" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function whatsappLink(text = "¡Hola Sonrisitas! Quiero información para mi peque 🦷") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
