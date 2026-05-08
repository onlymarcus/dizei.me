import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dizei.me"),
  title: "Dizei | IA por telefone para agendar pacientes",
  description:
    "Teste o Dizei: ligue para a IA, peca uma consulta e veja o agendamento aparecendo na agenda ao vivo.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dizei | IA por telefone para agendar pacientes",
    description:
      "Ligue para a IA, peca uma consulta e acompanhe o agendamento aparecendo na agenda em tempo real.",
    url: "https://dizei.me",
    siteName: "Dizei",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
