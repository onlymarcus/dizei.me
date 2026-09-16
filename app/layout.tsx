import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import { MetaPixelViewContent } from "@/components/meta-pixel";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Snippet base oficial da Meta. Roda como beforeInteractive para que
// window.fbq ja exista (enfileirando chamadas) antes de qualquer efeito de
// React disparar um evento. Ver lib/meta-pixel.ts.
const metaPixelSnippet = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
`;

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
      <body>
        {metaPixelId ? (
          <>
            <Script
              id="meta-pixel"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{ __html: metaPixelSnippet }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
            <MetaPixelViewContent />
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
