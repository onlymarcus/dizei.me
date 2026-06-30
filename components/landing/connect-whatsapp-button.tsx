"use client";

import { useEffect, useRef, useState } from "react";
import { commercialWhatsappHref } from "@/lib/site-config";

type SignupStatus = "idle" | "loading" | "authorizing" | "success" | "error";

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID ?? "";
const META_CONFIG_ID =
  process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID ?? "";
const REDIRECT_URI = "https://dizei.me/";

function buildOauthUrl(clinicToken: string) {
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
    `&state=${encodeURIComponent(clinicToken)}` +
    `&extras=${encodeURIComponent(extras)}`
  );
}

const ONBOARDING_STEPS = [
  "Clique no botao abaixo para abrir a janela oficial da Meta.",
  "Faca login na sua conta Meta Business e escolha o numero de WhatsApp da clinica.",
  "Conclua a autorizacao e feche a janela.",
  "Nossa equipe finaliza a configuracao do agente para atendimento, triagem e agendamento.",
];

export function ConnectWhatsappButton() {
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [clinicToken, setClinicToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!META_APP_ID) {
      setReady(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const code = params.get("code");
    const state = params.get("state"); // clinic token returned from Meta OAuth

    if (token) {
      setClinicToken(token);
    }

    if (code && state) {
      // Returning from Meta OAuth via full-page redirect fallback
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.hash
      );
      setClinicToken(state);
      submitCode(code, state);
      setTimeout(() => {
        document
          .getElementById("whatsapp-connect-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitCode(code: string, token: string) {
    setStatus("authorizing");
    try {
      const res = await fetch("/api/meta/embedded-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, clinic_token: token }),
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
    if (!META_APP_ID || !META_CONFIG_ID || !clinicToken) return;

    const oauthUrl = buildOauthUrl(clinicToken);
    const popup = window.open(
      oauthUrl,
      "dizei-meta-signup",
      "width=640,height=720,left=200,top=80,popup=1"
    );

    if (!popup || popup.closed) {
      window.location.href = oauthUrl;
      return;
    }

    setStatus("loading");

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
          // Still on facebook.com (cross-origin) — keep polling
          return;
        }

        if (href && href.startsWith(REDIRECT_URI)) {
          clearInterval(pollRef.current!);
          const redirectParams = new URL(href).searchParams;
          const code = redirectParams.get("code");
          const state = redirectParams.get("state");
          popup.close();

          if (code && state) {
            submitCode(code, state);
          } else {
            setStatus("idle");
          }
        }
      } catch {
        clearInterval(pollRef.current!);
      }
    }, 300);
  }

  // Prevent flash of "no token" state before useEffect reads the URL
  if (!ready) return null;

  // No clinic token — show contact CTA instead of the signup button
  if (!clinicToken) {
    return (
      <div className="space-y-5">
        <h3 className="text-xl font-semibold text-slate-950">
          Integre o WhatsApp da sua clinica
        </h3>
        <p className="text-base leading-7 text-slate-600">
          A conexao e feita por link individual enviado pela equipe Dizei apos a
          contratacao. Fale com nosso time para dar inicio.
        </p>
        <a
          href={commercialWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          Falar com o time Dizei
        </a>
      </div>
    );
  }

  // Token present — show success state
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
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

  // Token present — show onboarding steps + button
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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-950">
        Como funciona a autorizacao
      </h3>
      <ol className="space-y-4">
        {ONBOARDING_STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {i + 1}
            </span>
            <p className="text-base leading-7 text-slate-600">{step}</p>
          </li>
        ))}
      </ol>
      <button
        onClick={handleConnect}
        disabled={isDisabled}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {LABELS[status] ?? LABELS.idle}
      </button>
      <p className="text-xs leading-5 text-slate-400">
        WhatsApp e Meta sao marcas de seus respectivos titulares. A autorizacao
        acontece pela interface oficial da Meta. O Dizei nao solicita senha,
        codigo de verificacao ou acesso direto as credenciais da conta.
      </p>
    </div>
  );
}
