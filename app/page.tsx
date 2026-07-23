"use client";

import { useEffect, useState } from "react";
import { HomePage } from "@/components/landing/home-page";

export default function Home() {
  const [locale, setLocale] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const browserLang = (navigator.language || "").toLowerCase();
    if (browserLang.startsWith("en")) {
      setLocale("en");
    }
  }, []);

  return <HomePage locale={locale} />;
}
