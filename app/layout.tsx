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
  title: "Dizei | Voc\u00ea diz. O Dizei faz.",
  description:
    "Landing page do Dizei, o agente de IA por voz da AgentSet que responde d\u00favidas e agenda automaticamente para cl\u00ednicas, consult\u00f3rios e neg\u00f3cios com atendimento recorrente.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dizei | Voc\u00ea diz. O Dizei faz.",
    description:
      "Atendimento imediato com IA por voz para responder clientes e organizar agendamentos sem demora.",
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
