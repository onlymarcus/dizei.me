import { StartDemoButton } from "@/components/landing/start-demo-button";
import { ArrowIcon, CheckIcon } from "@/components/landing/ui-icons";
import { VoiceDemo } from "@/components/landing/voice-demo";
import {
  commercialWhatsappHref,
  demoPhoneDisplay,
  demoPhoneHref,
  demoWhatsappDisplay,
  demoWhatsappHref,
} from "@/lib/site-config";

const benefits = [
  "Atendimento 24h",
  "Voz natural",
  "Agenda no Google Calendar e Cal.com",
  "Triagem automatica",
  "Mais de 30 idiomas",
  "Resumo enviado ao medico",
];

const audiences = [
  "Clinicas medicas",
  "Dentistas",
  "Clinicas de estetica",
  "Psicologos",
  "Dermatologistas",
  "Consultorios particulares",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <section className="bg-slate-950 text-white">
        <div className="shell">
          <header className="flex items-center justify-between py-5">
            <a
              href="#top"
              className="font-[var(--font-space-grotesk)] text-2xl font-semibold"
            >
              Dizei
            </a>
            <a
              href={demoPhoneHref}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              Teste por telefone
            </a>
          </header>

          <div
            id="top"
            className="grid min-h-[calc(100svh-84px)] gap-10 pb-10 pt-10 lg:grid-cols-[1fr_0.74fr] lg:items-center lg:pt-8"
          >
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                Demonstracao ao vivo em dizei.me
              </p>

              <h1 className="mt-6 text-balance text-5xl font-semibold leading-none tracking-normal text-white sm:text-6xl lg:text-7xl">
                Veja uma IA agendando pacientes ao vivo
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Clique para conversar com a IA dentro da pagina, peca uma
                consulta e acompanhe o agendamento aparecendo na agenda em tempo
                real. Se preferir, teste tambem pelo telefone ou WhatsApp da
                demonstracao.
              </p>

              <div className="mt-8 rounded-3xl border border-white/12 bg-white/8 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Canais de teste da IA
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <a
                    href={demoPhoneHref}
                    className="rounded-2xl border border-white/12 bg-white/8 p-4 transition hover:bg-white/12"
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      Telefone
                    </span>
                    <span className="mt-1 block font-[var(--font-space-grotesk)] text-2xl font-semibold text-emerald-300">
                      {demoPhoneDisplay}
                    </span>
                  </a>
                  <a
                    href={demoWhatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/12 bg-white/8 p-4 transition hover:bg-white/12"
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      WhatsApp da IA
                    </span>
                    <span className="mt-1 block font-[var(--font-space-grotesk)] text-2xl font-semibold text-emerald-300">
                      {demoWhatsappDisplay}
                    </span>
                  </a>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Esses canais conectam voce ao agente de IA da demonstracao.
                  Fale como paciente, escolha um horario e veja o compromisso
                  aparecer na agenda.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <StartDemoButton>Testar na pagina agora</StartDemoButton>
                <a
                  href={demoWhatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/16 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/16 sm:w-auto"
                >
                  Testar pelo WhatsApp
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/8 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Teste em menos de 2 minutos
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Clique para falar com a IA",
                  "Peca um horario de consulta",
                  "Acompanhe a agenda ao vivo",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl bg-white/8 p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300 text-sm font-semibold text-slate-950">
                      {index + 1}
                    </span>
                    <span className="text-base font-semibold text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-300">
                Seu paciente fala. A IA atende. A agenda preenche sozinha.
              </p>
            </div>
          </div>
        </div>
      </section>

      <VoiceDemo />

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="section-kicker">Beneficios diretos</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Menos chamadas perdidas. Mais consultas marcadas.
            </h2>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon />
                </span>
                <p className="text-base font-semibold text-slate-900">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="section-kicker">Para quem e</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Feito para clinicas e consultorios que dependem de agenda cheia.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base font-semibold text-slate-900"
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              O problema
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              Sua recepcao nao consegue atender todos os pacientes o tempo todo.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Cada ligacao perdida pode ser uma consulta que foi para outro
              consultorio. O Dizei atende, orienta e agenda mesmo quando sua
              equipe esta ocupada.
            </p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/8 p-6">
            <p className="text-4xl font-semibold text-emerald-300">24h</p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Atendimento disponivel para reduzir espera, aliviar a recepcao e
              transformar mais contatos em agendamentos.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 py-14 sm:py-16">
        <div className="shell text-center">
          <p className="section-kicker">Proximo passo</p>
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            Quer testar na sua clinica?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Podemos configurar uma demonstracao com o nome, voz e agenda da sua
            clinica.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={commercialWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900 sm:w-auto"
            >
              Quero implementar o Dizei
              <ArrowIcon />
            </a>
            <StartDemoButton>Testar agora na pagina</StartDemoButton>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Atendimento comercial humano para adaptar o Dizei a rotina da sua
            clinica.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="shell flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-700">Dizei</p>
          <a href="https://dizei.me" target="_blank" rel="noreferrer">
            dizei.me
          </a>
        </div>
      </footer>
    </main>
  );
}
