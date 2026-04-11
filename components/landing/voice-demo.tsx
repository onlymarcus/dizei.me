"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useEffect, useMemo, useState } from "react";

type TranscriptItem = {
  id: string;
  role: "user" | "agent";
  text: string;
};

const AGENT_ID = "agent_8301knjjt31gfgya9qk2jq11h30j";
const DEMO_PHONE = "(81) 3264-2080";
const CALENDAR_URL =
  "https://calendar.google.com/calendar/embed?src=61a30ff6ddf982134fa08cfc7a00e64c846c17b9e7d489f65f4982efbd636557%40group.calendar.google.com&ctz=America%2FRecife";

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

  const {
    startSession,
    endSession,
    status,
    mode,
    isMuted,
    setMuted,
    getId,
  } = useConversation({
    onConnect: () => {
      setErrorMessage(null);
      setMessages([]);
    },
    onDisconnect: () => {
      setMessages((current) =>
        current.length === 0
          ? [
              {
                id: "disconnected-empty",
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
          updated[existingIndex] = { ...updated[existingIndex], text: cleanMessage };
          return updated;
        }

        return [...current, { id: itemId, role, text: cleanMessage }];
      });
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCalendarTick((value) => value + 1);
      setLastRefresh(new Date());
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const statusLabel = useMemo(() => {
    if (status === "connected") {
      return mode === "speaking" ? "Agente falando" : "Agente ouvindo";
    }

    if (status === "connecting") {
      return "Conectando demonstracao";
    }

    if (status === "error") {
      return "Erro na conexao";
    }

    return "Demonstracao pronta";
  }, [mode, status]);

  async function handleStartDemo() {
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
      const fallback =
        "Nao foi possivel acessar o microfone. Verifique a permissao do navegador e tente novamente.";

      if (error instanceof Error && error.message.trim()) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(fallback);
    }
  }

  function handleRefreshCalendar() {
    setCalendarTick((value) => value + 1);
    setLastRefresh(new Date());
  }

  return (
    <div className="grid gap-8 rounded-[34px] border border-slate-200 bg-white/80 p-8 shadow-soft backdrop-blur lg:grid-cols-[1fr_0.95fr] lg:p-12">
      <div>
        <span className="section-kicker">Demonstracao ao vivo</span>
        <h2 className="text-balance text-3xl font-semibold text-slate-950 sm:text-4xl lg:text-5xl">
          Inicie uma conversa real com o agente Consultorio IA.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Toque em testar demonstracao, permita o uso do microfone e converse
          com o agente por voz direto na pagina. A agenda ao lado mostra o mesmo
          estilo de visualizacao publica usado na demonstracao da AgentSet.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {status === "connected" || status === "connecting" ? (
            <button
              type="button"
              onClick={endSession}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Encerrar demonstracao
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartDemo}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Testar demonstracao
            </button>
          )}

          <button
            type="button"
            onClick={() => setMuted(!isMuted)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            {isMuted ? "Ativar microfone" : "Silenciar microfone"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Status da conversa
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-950">
              {statusLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {status === "connected"
                ? `ID da conversa: ${getId() || "conectando"}`
                : "Quando a demonstracao iniciar, o agente vai responder por voz aqui mesmo."}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Modo de conexao atual: {CONNECTION_TYPE}.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Referencia da AgentSet
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-950">
              Agenda demonstrativa publica
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Se preferir testar por telefone como no site institucional, a
              referencia publica atual e {DEMO_PHONE}.
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[22px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
                Conversa em andamento
              </p>
              <p className="mt-2 text-2xl font-semibold">
                Veja a interacao acontecendo na pratica
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80">
              {status}
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
            {messages.length === 0 ? (
              <div className="text-sm leading-6 text-white/75">
                Assim que a demonstracao iniciar, as mensagens trocadas com o
                agente aparecem aqui.
              </div>
            ) : (
              messages.slice(-8).map((item) => (
                <div
                  key={item.id}
                  className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                    item.role === "agent"
                      ? "ml-auto rounded-tr-md bg-brand-400 text-slate-950"
                      : "rounded-tl-md bg-white/10 text-white/85"
                  }`}
                >
                  {item.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Agenda demonstrativa
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                Visualizacao publica no estilo AgentSet
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshCalendar}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Atualizar agora
            </button>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Atualizacao automatica a cada 60 segundos. Ultima atualizacao as{" "}
            {formatTimestamp(lastRefresh)}.
          </p>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
            <iframe
              key={calendarTick}
              src={`${CALENDAR_URL}&cacheBust=${calendarTick}`}
              title="Agenda demonstrativa publica"
              className="h-[480px] w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            O que esta em destaque
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              Conversa por voz iniciada dentro da propria landing.
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              Experiencia publica e estatica, pronta para Cloudflare Pages.
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              Agenda demonstrativa incorporada para reforcar a prova visual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VoiceDemo() {
  return (
    <ConversationProvider>
      <VoiceDemoPanel />
    </ConversationProvider>
  );
}
