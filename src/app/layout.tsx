import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.fullName} | Odontopediatría en Pereira`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["odontopediatría", "odontología infantil", "dentista para niños", "Pereira", "ortodoncia preventiva"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.fullName,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#3aa0ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
