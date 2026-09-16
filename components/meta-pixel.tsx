"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/meta-pixel";

// Dispara o ViewContent uma vez por carregamento de pagina.
//
// O snippet base do Pixel e injetado em app/layout.tsx com
// strategy="beforeInteractive", entao window.fbq ja existe (mesmo que ainda
// enfileirando) quando este efeito roda.
export function MetaPixelViewContent() {
  useEffect(() => {
    trackEvent("ViewContent");
  }, []);

  return null;
}
