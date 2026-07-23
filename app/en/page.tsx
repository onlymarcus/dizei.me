import type { Metadata } from "next";
import { HomePage } from "@/components/landing/home-page";

export const metadata: Metadata = {
  title: "Dizei | AI for patient support and scheduling in clinics",
  description:
    "Dizei is an AI agent for support by phone, WhatsApp, and website, with intake and scheduling for clinics and medical offices.",
  alternates: {
    canonical: "/en",
  },
  openGraph: {
    title: "Dizei | AI for patient support and scheduling in clinics",
    description:
      "AI agent that answers patients, replies to messages, runs intake, and books appointments.",
    url: "https://dizei.me/en",
    siteName: "Dizei",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
