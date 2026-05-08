"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useEffect, useMemo, useState } from "react";

import {
  calendarEmbedUrl,
  demoPhoneDisplay,
  demoPhoneHref,
} from "@/lib/site-config";

type TranscriptItem = {
  id: string;
  role: "user" | "agent";
  text: string;
};

const AGENT_ID = "agent_8301knjjt31gfgya9qk2jq11h30j";
const CONNECTION_TYPE = "websocket" as const;

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function VoiceDemoPanel() {
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
                  text: "A demonstracao foi encerrada. Quando quiser, voce pode iniciar outra conversa.",
                },
              ]
            : current,
        );
      },
      onError: (message) => {
        const normalized = message.includes("pc connection")
          ? "Nao foi possivel abrir a conexao de audio em tempo real. Tente novamente em alguns segundos."
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

      setErrorMessage(
        "Nao foi possivel acessar o microfone. Verifique a permissao do navegador e tente novamente.",
      );
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
      return mode === "speaking" ? "IA falando" : "IA ouvindo";
    }

    if (status === "connecting") {
      return "Conectando";
    }

    if (status === "error") {
      return "Erro na conexao";
    }

    return "Pronto para testar";
  }, [mode, status]);

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
            <span className="section-kicker">Demonstracao ao vivo</span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Fale com a IA sem sair da pagina.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Clique no botao, permita o microfone e peca um horario de consulta.
              Voce escuta a resposta, acompanha a conversa por texto e ve a
              agenda sendo atualizada.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {status === "connected" || status === "connecting" ? (
                <button
                  type="button"
                  onClick={endSession}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900 sm:w-auto"
                >
                  Encerrar demonstracao
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto"
                >
                  Ligar e testar agora
                </button>
              )}

              <button
                type="button"
                onClick={() => setMuted(!isMuted)}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto"
              >
                {isMuted ? "Ativar microfone" : "Silenciar microfone"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">{statusLabel}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Tambem e possivel testar por telefone:{" "}
                <a
                  href={demoPhoneHref}
                  className="font-semibold text-slate-950 underline decoration-emerald-300 underline-offset-4"
                >
                  {demoPhoneDisplay}
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
                    Conversa
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    Transcricao em tempo real
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                  {status}
                </span>
              </div>

              <div className="mt-5 max-h-[320px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                {messages.length === 0 ? (
                  <p className="text-sm leading-6 text-white/70">
                    Assim que a demonstracao iniciar, as mensagens aparecem aqui.
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
                  Agenda em tempo real
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  Calendario da demonstracao
                </p>
              </div>

              <button
                type="button"
                onClick={refreshCalendar}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                Atualizar agenda
              </button>
            </div>

            <p className="px-4 pt-4 text-sm leading-6 text-slate-600 sm:px-5">
              Atualizacao automatica a cada 45 segundos. Ultima atualizacao as{" "}
              {formatTimestamp(lastRefresh)}.
            </p>

            <div className="p-3 sm:p-5">
              <iframe
                key={calendarTick}
                src={`${calendarEmbedUrl}&cacheBust=${calendarTick}`}
                title="Agenda demonstrativa do Dizei"
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

export function VoiceDemo() {
  return (
    <ConversationProvider>
      <VoiceDemoPanel />
    </ConversationProvider>
  );
}
