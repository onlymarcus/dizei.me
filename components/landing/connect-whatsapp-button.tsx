"use client";

import { useEffect, useRef, useState } from "react";

type SignupStatus =
  | "idle"
  | "loading"
  | "authorizing"
  | "success"
  | "error"
  | "popup_blocked";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (params: {
        appId: string;
        cookie: boolean;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          status?: string;
          authResponse?: { code?: string } | null;
        }) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras: {
            setup: Record<string, unknown>;
            featurize: { messaging_product: string };
          };
        }
      ) => void;
    };
  }
}

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID ?? "";
const META_CONFIG_ID =
  process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID ?? "";

function initFB() {
  window.FB?.init({
    appId: META_APP_ID,
    cookie: true,
    autoLogAppEvents: true,
    xfbml: true,
    version: "v23.0",
  });
}

export function ConnectWhatsappButton() {
  const [status, setStatus] = useState<SignupStatus>("idle");
  const wabaDataRef = useRef<{
    business_id?: string;
    waba_id?: string;
    phone_number_id?: string;
  }>({});

  useEffect(() => {
    if (!META_APP_ID) return;

    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }
      try {
        const data =
          typeof event.data === "string"
            ? (JSON.parse(event.data) as Record<string, unknown>)
            : (event.data as Record<string, unknown>);

        if (data?.type === "WA_EMBEDDED_SIGNUP") {
          const inner = data.data as
            | {
                business_id?: string;
                waba_id?: string;
                phone_number_id?: string;
              }
            | undefined;
          wabaDataRef.current = {
            business_id: inner?.business_id,
            waba_id: inner?.waba_id,
            phone_number_id: inner?.phone_number_id,
          };
        }
      } catch {
        // ignore parse errors from unrelated messages
      }
    }

    window.addEventListener("message", handleMessage);

    // If SDK is already in the page (e.g. cached), init directly.
    // Otherwise set fbAsyncInit so the SDK calls it when it loads.
    if (window.FB) {
      initFB();
    } else {
      window.fbAsyncInit = initFB;

      if (!document.getElementById("facebook-jssdk")) {
        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src = "https://connect.facebook.net/pt_BR/sdk.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  async function handleConnect() {
    if (!window.FB) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    wabaDataRef.current = {};

    const loginCalledAt = Date.now();

    // Safety timeout: reset if popup never fires callback
    const timeoutId = setTimeout(() => setStatus("popup_blocked"), 30_000);

    window.FB.login(
      async (response) => {
        clearTimeout(timeoutId);

        const code = response.authResponse?.code;
        const elapsed = Date.now() - loginCalledAt;

        if (!code) {
          // If callback fires in under 1 second it means no popup was shown
          // (popup blocked or SDK not configured for JS login).
          // Otherwise the user actively closed or denied the popup.
          setStatus(elapsed < 1000 ? "popup_blocked" : "idle");
          return;
        }

        setStatus("authorizing");

        try {
          const res = await fetch("/api/meta/embedded-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, ...wabaDataRef.current }),
          });
          setStatus(res.ok ? "success" : "error");
        } catch {
          setStatus("error");
        }
      },
      {
        config_id: META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featurize: { messaging_product: "whatsapp" },
        },
      }
    );
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
            Procure o icone de popup bloqueado na barra de endereco do seu
            navegador, clique nele e permita popups para dizei.me. Depois
            tente novamente.
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

  const BUTTON_LABELS: Record<string, string> = {
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
      {BUTTON_LABELS[status] ?? BUTTON_LABELS.idle}
    </button>
  );
}
