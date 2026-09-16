"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useEffect, useMemo, useState } from "react";

import {
  calendarEmbedUrl,
  demoPhoneDisplay,
  demoPhoneHref,
  demoWhatsappDisplay,
  demoWhatsappHref,
} from "@/lib/site-config";

type TranscriptItem = {
  id: string;
  role: "user" | "agent";
  text: string;
};

const AGENT_ID = "agent_8301knjjt31gfgya9qk2jq11h30j";
const CONNECTION_TYPE = "websocket" as const;

type Locale = "pt" | "en";

const COPY: Record<
  Locale,
  {
    dateFnsLocale: string;
    kicker: string;
    heading: string;
    paragraph: string;
    endDemo: string;
    startDemo: string;
    unmute: string;
    mute: string;
    testViaWhatsapp: string;
    statusConnectedSpeaking: string;
    statusConnectedListening: string;
    statusConnecting: string;
    statusError: string;
    statusIdle: string;
    channelsPrefix: string;
    channelsAnd: string;
    onDisconnectEmpty: string;
    pcConnectionError: string;
    micPermissionError: string;
    conversationLabel: string;
    transcriptLabel: string;
    emptyTranscript: string;
    calendarKicker: string;
    calendarHeading: string;
    refreshCalendar: string;
    autoRefreshPrefix: string;
    autoRefreshSuffix: string;
    calendarIframeTitle: string;
  }
> = {
  pt: {
    dateFnsLocale: "pt-BR",
    kicker: "Demonstracao ao vivo",
    heading: "Fale com a IA sem sair da pagina.",
    paragraph:
      "Clique no botao, permita o microfone e peca um horario de consulta. Voce escuta a resposta, acompanha a conversa por texto e ve a agenda sendo atualizada. Tambem e possivel testar o mesmo agente pelo telefone ou pelo WhatsApp da demonstracao.",
    endDemo: "Encerrar demonstracao",
    startDemo: "Ligar e testar agora",
    unmute: "Ativar microfone",
    mute: "Silenciar microfone",
    testViaWhatsapp: "Testar pelo WhatsApp",
    statusConnectedSpeaking: "IA falando",
    statusConnectedListening: "IA ouvindo",
    statusConnecting: "Conectando",
    statusError: "Erro na conexao",
    statusIdle: "Pronto para testar",
    channelsPrefix: "Canais de teste da IA: telefone",
    channelsAnd: "e WhatsApp",
    onDisconnectEmpty:
      "A demonstracao foi encerrada. Quando quiser, voce pode iniciar outra conversa.",
    pcConnectionError:
      "Nao foi possivel abrir a conexao de audio em tempo real. Tente novamente em alguns segundos.",
    micPermissionError:
      "Nao foi possivel acessar o microfone. Verifique a permissao do navegador e tente novamente.",
    conversationLabel: "Conversa",
    transcriptLabel: "Transcricao em tempo real",
    emptyTranscript: "Assim que a demonstracao iniciar, as mensagens aparecem aqui.",
    calendarKicker: "Agenda em tempo real",
    calendarHeading: "Calendario da demonstracao",
    refreshCalendar: "Atualizar agenda",
    autoRefreshPrefix: "Atualizacao automatica a cada 45 segundos. Ultima atualizacao as",
    autoRefreshSuffix: "",
    calendarIframeTitle: "Agenda demonstrativa do Dizei",
  },
  en: {
    dateFnsLocale: "en-US",
    kicker: "Live demo",
    heading: "Talk to the AI without leaving the page.",
    paragraph:
      "Click the button, allow microphone access, and request an appointment time. You'll hear the response, follow the conversation in text, and watch the calendar update. You can also test the same agent by phone or via the demo WhatsApp.",
    endDemo: "End demo",
    startDemo: "Call and test now",
    unmute: "Unmute microphone",
    mute: "Mute microphone",
    testViaWhatsapp: "Test via WhatsApp",
    statusConnectedSpeaking: "AI speaking",
    statusConnectedListening: "AI listening",
    statusConnecting: "Connecting",
    statusError: "Connection error",
    statusIdle: "Ready to test",
    channelsPrefix: "AI testing channels: phone",
    channelsAnd: "and WhatsApp",
    onDisconnectEmpty:
      "The demo has ended. You can start another conversation anytime.",
    pcConnectionError:
      "Couldn't open the real-time audio connection. Please try again in a few seconds.",
    micPermissionError:
      "Couldn't access the microphone. Check your browser permission and try again.",
    conversationLabel: "Conversation",
    transcriptLabel: "Real-time transcript",
    emptyTranscript: "Once the demo starts, messages will appear here.",
    calendarKicker: "Real-time calendar",
    calendarHeading: "Demo calendar",
    refreshCalendar: "Refresh calendar",
    autoRefreshPrefix: "Auto-refreshes every 45 seconds. Last updated at",
    autoRefreshSuffix: "",
    calendarIframeTitle: "Dizei demo calendar",
  },
};

function formatTimestamp(date: Date, dateFnsLocale: string) {
  return new Intl.DateTimeFormat(dateFnsLocale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function VoiceDemoPanel({ locale = "pt" }: { locale?: Locale }) {
  const t = COPY[locale];
  const [messages, setMessages] = useState<TranscriptItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calendarTick, setCalendarTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(() => new Date());

  const { startSession, endSession, status, mode, isMuted, setMuted } =
    useConversation({
      onConnect: () => {
        setErrorMessage(null);
        setMessages([]);
      },
      onDisconnect: () => {
        setMessages((current) =>
          current.length === 0
            ? [
                {
                  id: "finished-empty",
                  role: "agent",
                  text: t.onDisconnectEmpty,
                },
              ]
            : current,
        );
      },
      onError: (message) => {
        const normalized = message.includes("pc connection")
          ? t.pcConnectionError
          : message;

        setErrorMessage(normalized);
      },
      onMessage: ({ message, role, event_id }) => {
        const cleanMessage = message?.trim();
        if (!cleanMessage) {
          return;
        }

        setMessages((current) => {
          const itemId =
            event_id !== undefined
              ? `${role}-${event_id}`
              : `${role}-${cleanMessage}-${current.length}`;

          const existingIndex = current.findIndex((item) => item.id === itemId);

          if (existingIndex >= 0) {
            const updated = [...current];
            updated[existingIndex] = {
              ...updated[existingIndex],
              text: cleanMessage,
            };
            return updated;
          }

          return [...current, { id: itemId, role, text: cleanMessage }];
        });
      },
    });

  async function handleStartDemo() {
    if (status === "connected" || status === "connecting") {
      return;
    }

    setErrorMessage(null);

    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      permissionStream.getTracks().forEach((track) => track.stop());

      startSession({
        agentId: AGENT_ID,
        connectionType: CONNECTION_TYPE,
      });
    } catch (error) {
      if (error instanceof Error && error.message.trim()) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(t.micPermissionError);
    }
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCalendarTick((value) => value + 1);
      setLastRefresh(new Date());
    }, 45000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    function startFromExternalButton() {
      void handleStartDemo();
    }

    window.addEventListener("dizei:start-demo", startFromExternalButton);

    return () => {
      window.removeEventListener("dizei:start-demo", startFromExternalButton);
    };
  });

  const statusLabel = useMemo(() => {
    if (status === "connected") {
      return mode === "speaking"
        ? t.statusConnectedSpeaking
        : t.statusConnectedListening;
    }

    if (status === "connecting") {
      return t.statusConnecting;
    }

    if (status === "error") {
      return t.statusError;
    }

    return t.statusIdle;
  }, [mode, status, t]);

  function refreshCalendar() {
    setCalendarTick((value) => value + 1);
    setLastRefresh(new Date());
  }

  return (
    <section
      id="demonstracao"
      className="border-y border-slate-200 bg-white py-12 sm:py-16"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <span className="section-kicker">{t.kicker}</span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {t.heading}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t.paragraph}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {status === "connected" || status === "connecting" ? (
                <button
                  type="button"
                  onClick={endSession}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900 sm:w-auto"
                >
                  {t.endDemo}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto"
                >
                  {t.startDemo}
                </button>
              )}

              <button
                type="button"
                onClick={() => setMuted(!isMuted)}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto"
              >
                {isMuted ? t.unmute : t.mute}
              </button>

              <a
                href={demoWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto"
              >
                {t.testViaWhatsapp}
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">{statusLabel}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {t.channelsPrefix}{" "}
                <a
                  href={demoPhoneHref}
                  className="font-semibold text-slate-950 underline decoration-emerald-300 underline-offset-4"
                >
                  {demoPhoneDisplay}
                </a>
                {" "}
                {t.channelsAnd}{" "}
                <a
                  href={demoWhatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-950 underline decoration-emerald-300 underline-offset-4"
                >
                  {demoWhatsappDisplay}
                </a>
                .
              </p>
            </div>

            {errorMessage ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    {t.conversationLabel}
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {t.transcriptLabel}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                  {status}
                </span>
              </div>

              <div className="mt-5 max-h-[320px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                {messages.length === 0 ? (
                  <p className="text-sm leading-6 text-white/70">
                    {t.emptyTranscript}
                  </p>
                ) : (
                  messages.slice(-8).map((item) => (
                    <div
                      key={item.id}
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        item.role === "agent"
                          ? "ml-auto bg-emerald-300 text-slate-950"
                          : "bg-white/10 text-white/85"
                      }`}
                    >
                      {item.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-soft">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {t.calendarKicker}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {t.calendarHeading}
                </p>
              </div>

              <button
                type="button"
                onClick={refreshCalendar}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {t.refreshCalendar}
              </button>
            </div>

            <p className="px-4 pt-4 text-sm leading-6 text-slate-600 sm:px-5">
              {t.autoRefreshPrefix}{" "}
              {formatTimestamp(lastRefresh, t.dateFnsLocale)}.
            </p>

            <div className="p-3 sm:p-5">
              <iframe
                key={calendarTick}
                src={`${calendarEmbedUrl}&cacheBust=${calendarTick}`}
                title={t.calendarIframeTitle}
                className="h-[520px] w-full rounded-2xl border border-slate-200 bg-white"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VoiceDemo({ locale = "pt" }: { locale?: Locale }) {
  return (
    <ConversationProvider>
      <VoiceDemoPanel locale={locale} />
    </ConversationProvider>
  );
}
