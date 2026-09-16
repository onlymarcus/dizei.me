"use client";

// Rastreamento Meta do site.
//
// Cada evento e disparado duas vezes: pelo Pixel no navegador e pela API de
// Conversoes a partir do servidor (functions/api/meta/capi.ts). Os dois
// carregam o mesmo event_id, entao a Meta desduplica e conta uma vez so.
// Enviar pelos dois caminhos e o que sustenta a metrica "Cobertura de eventos
// da API de Conversoes" quando bloqueador de anuncio ou falha de rede derruba
// o evento do navegador.

export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Eventos configurados no Gerenciador de Eventos. A allowlist do endpoint
// do servidor precisa acompanhar esta lista.
export type MetaEvent = "ViewContent" | "Contact" | "Lead";

// Campos de identificacao do cliente. Vao em texto puro daqui; o hash SHA-256
// exigido pela Meta e feito no servidor, nunca no navegador.
type MetaUserData = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  zp?: string;
  db?: string;
  external_id?: string;
};

type TrackOptions = {
  userData?: MetaUserData;
  customData?: Record<string, string | number>;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Cookie do navegador criado pelo proprio Pixel.
function browserId(): string | undefined {
  return readCookie("_fbp");
}

// Cookie de clique. O Pixel so grava o _fbc depois que carrega; se o visitante
// acabou de chegar por um anuncio, o fbclid ainda esta na URL e montamos o
// valor no formato que a Meta espera.
function clickId(): string | undefined {
  const fromCookie = readCookie("_fbc");
  if (fromCookie) return fromCookie;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function trackEvent(name: MetaEvent, options: TrackOptions = {}): void {
  if (!metaPixelId || typeof window === "undefined") return;

  const eventId = newEventId();
  const { userData, customData } = options;

  window.fbq?.("track", name, customData ?? {}, { eventID: eventId });

  // keepalive porque a maioria dos CTAs navega para wa.me logo depois do
  // clique — sem isso o browser cancela a requisicao na saida da pagina.
  void fetch("/api/meta/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      event_name: name,
      event_id: eventId,
      event_source_url: window.location.href,
      fbp: browserId(),
      fbc: clickId(),
      user_data: userData,
      custom_data: customData,
    }),
  }).catch(() => {
    // Falha no rastreamento nunca pode atrapalhar o clique do visitante.
  });
}
