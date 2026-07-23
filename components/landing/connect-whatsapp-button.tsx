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

type Locale = "pt" | "en";

const COPY: Record<
  Locale,
  {
    onboardingSteps: string[];
    noTokenHeading: string;
    noTokenBody: string;
    contactCta: string;
    successHeading: string;
    successBody: string;
    stepsHeading: string;
    labels: Record<SignupStatus, string>;
    disclaimer: string;
  }
> = {
  pt: {
    onboardingSteps: [
      "Clique no botao abaixo para abrir a janela oficial da Meta.",
      "Faca login na sua conta Meta Business e escolha o numero de WhatsApp da clinica.",
      "Conclua a autorizacao e feche a janela.",
      "Nossa equipe finaliza a configuracao do agente para atendimento, triagem e agendamento.",
    ],
    noTokenHeading: "Integre o WhatsApp da sua clinica",
    noTokenBody:
      "A conexao e feita por link individual enviado pela equipe Dizei apos a contratacao. Fale com nosso time para dar inicio.",
    contactCta: "Falar com o time Dizei",
    successHeading: "WhatsApp conectado com sucesso.",
    successBody:
      "Nossa equipe vai finalizar a configuracao do agente para a sua clinica em breve. Fale conosco pelo WhatsApp comercial se precisar de acompanhamento.",
    stepsHeading: "Como funciona a autorizacao",
    labels: {
      idle: "Conectar meu WhatsApp Business",
      loading: "Abrindo autorizacao da Meta...",
      authorizing: "Salvando conexao...",
      success: "WhatsApp conectado com sucesso.",
      error: "Erro ao conectar. Clique para tentar novamente.",
    },
    disclaimer:
      "WhatsApp e Meta sao marcas de seus respectivos titulares. A autorizacao acontece pela interface oficial da Meta. O Dizei nao solicita senha, codigo de verificacao ou acesso direto as credenciais da conta.",
  },
  en: {
    onboardingSteps: [
      "Click the button below to open Meta's official window.",
      "Log in to your Meta Business account and choose the clinic's WhatsApp number.",
      "Complete the authorization and close the window.",
      "Our team finishes setting up the agent for support, intake, and scheduling.",
    ],
    noTokenHeading: "Connect your clinic's WhatsApp",
    noTokenBody:
      "The connection is made through an individual link sent by the Dizei team after signup. Talk to our team to get started.",
    contactCta: "Talk to the Dizei team",
    successHeading: "WhatsApp connected successfully.",
    successBody:
      "Our team will finish setting up the agent for your clinic shortly. Reach out via our sales WhatsApp if you need follow-up.",
    stepsHeading: "How the authorization works",
    labels: {
      idle: "Connect my WhatsApp Business",
      loading: "Opening Meta authorization...",
      authorizing: "Saving connection...",
      success: "WhatsApp connected successfully.",
      error: "Connection error. Click to try again.",
    },
    disclaimer:
      "WhatsApp and Meta are trademarks of their respective owners. Authorization happens through Meta's official interface. Dizei never asks for your password, verification code, or direct access to account credentials.",
  },
};

export function ConnectWhatsappButton({
  locale = "pt",
}: {
  locale?: Locale;
}) {
  const t = COPY[locale];
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
          {t.noTokenHeading}
        </h3>
        <p className="text-base leading-7 text-slate-600">{t.noTokenBody}</p>
        <a
          href={commercialWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          {t.contactCta}
        </a>
      </div>
    );
  }

  // Token present — show success state
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-lg font-semibold text-emerald-900">
          {t.successHeading}
        </p>
        <p className="mt-2 text-base leading-7 text-emerald-800">
          {t.successBody}
        </p>
      </div>
    );
  }

  // Token present — show onboarding steps + button
  const isDisabled =
    !META_APP_ID ||
    !META_CONFIG_ID ||
    status === "loading" ||
    status === "authorizing";

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-950">
        {t.stepsHeading}
      </h3>
      <ol className="space-y-4">
        {t.onboardingSteps.map((step, i) => (
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
        {t.labels[status] ?? t.labels.idle}
      </button>
      <p className="text-xs leading-5 text-slate-400">{t.disclaimer}</p>
    </div>
  );
}
