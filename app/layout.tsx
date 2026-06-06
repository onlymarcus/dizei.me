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
  title: "Dizei | IA para atendimento e agendamento em clinicas",
  description:
    "Dizei e um agente de IA para atendimento por telefone, WhatsApp e website, com triagem e agendamento para clinicas e consultorios.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dizei | IA para atendimento e agendamento em clinicas",
    description:
      "Agente de IA para atender pacientes, responder mensagens, fazer triagem e agendar consultas.",
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
