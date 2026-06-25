"use client";

import { useEffect, useRef, useState } from "react";

type SignupStatus =
  | "idle"
  | "loading"
  | "authorizing"
  | "success"
  | "error"
  | "popup_blocked";

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID ?? "";
const META_CONFIG_ID =
  process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID ?? "";

// Redirect URI must match exactly what is registered in the Meta app settings
const REDIRECT_URI = "https://dizei.me/";

function buildOauthUrl() {
  const extras = JSON.stringify({
    setup: {},
    featurize: { messaging_product: "whatsapp" },
  });
  return (
    "https://www.facebook.com/dialog/oauth" +
    `?client_id=${META_APP_ID}` +
    `&config_id=${META_CONFIG_ID}` +
    `&response_type=code` +
    `&override_default_response_type=true` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&extras=${encodeURIComponent(extras)}`
  );
}

export function ConnectWhatsappButton() {
  const [status, setStatus] = useState<SignupStatus>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Check if returning from Meta OAuth redirect (full-page fallback)
  useEffect(() => {
    if (!META_APP_ID) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    // Remove code from URL bar so it doesn't linger
    window.history.replaceState(
      {},
      "",
      window.location.pathname + window.location.hash
    );

    submitCode(code);
    // Scroll to this section
    setTimeout(() => {
      document.getElementById("whatsapp-connect-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitCode(code: string) {
    setStatus("authorizing");
    try {
      const res = await fetch("/api/meta/embedded-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "(sem corpo)");
        console.error("[Dizei] Backend erro:", res.status, body);
      }
      setStatus(res.ok ? "success" : "error");
    } catch (err) {
      console.error("[Dizei] Falha ao chamar backend:", err);
      setStatus("error");
    }
  }

  function handleConnect() {
    if (!META_APP_ID || !META_CONFIG_ID) return;

    // Open Meta OAuth as a popup using window.open() — always allowed from
    // a direct user click, no FB SDK required
    const popup = window.open(
      buildOauthUrl(),
      "dizei-meta-signup",
      "width=640,height=720,left=200,top=80,popup=1"
    );

    if (!popup || popup.closed) {
      // Popup was blocked — fall back to full-page redirect
      window.location.href = buildOauthUrl();
      return;
    }

    popupRef.current = popup;
    setStatus("loading");

    // Poll the popup URL until it redirects back to our domain
    pollRef.current = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(pollRef.current!);
          setStatus((s) => (s === "loading" ? "idle" : s));
          return;
        }

        let href = "";
        try {
          href = popup.location.href;
        } catch {
          // Still on facebook.com (cross-origin) — expected, keep polling
          return;
        }

        if (href && href.startsWith(REDIRECT_URI)) {
          clearInterval(pollRef.current!);
          const code = new URL(href).searchParams.get("code");
          popup.close();

          if (code) {
            submitCode(code);
          } else {
            setStatus("idle");
          }
        }
      } catch {
        clearInterval(pollRef.current!);
      }
    }, 300);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left">
        <p className="text-lg font-semibold text-emerald-900">
          WhatsApp conectado com sucesso.
        </p>
        <p className="mt-2 text-base leading-7 text-emerald-800">
          Nossa equipe vai finalizar a configuracao do agente para a sua clinica
          em breve. Fale conosco pelo WhatsApp comercial se precisar de
          acompanhamento.
        </p>
      </div>
    );
  }

  if (status === "popup_blocked") {
    return (
      <div className="space-y-3 text-left">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-900">
            A janela da Meta foi bloqueada pelo navegador.
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            Permita popups para dizei.me nas configuracoes do navegador e tente
            novamente.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-emerald-700 underline underline-offset-4"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const LABELS: Record<string, string> = {
    idle: "Conectar meu WhatsApp Business",
    loading: "Abrindo autorizacao da Meta...",
    authorizing: "Salvando conexao...",
    error: "Erro ao conectar. Clique para tentar novamente.",
  };

  const isDisabled =
    !META_APP_ID ||
    !META_CONFIG_ID ||
    status === "loading" ||
    status === "authorizing";

  return (
    <button
      onClick={handleConnect}
      disabled={isDisabled}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {LABELS[status] ?? LABELS.idle}
    </button>
  );
}
