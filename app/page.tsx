import { ButtonLink } from "@/components/landing/button-link";
import { FaqItem } from "@/components/landing/faq-item";
import { FeatureCard } from "@/components/landing/feature-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { VoiceDemo } from "@/components/landing/voice-demo";
import {
  benefits,
  faqs,
  painPoints,
  solutions,
  steps,
  triageHighlights,
  voiceHighlights,
} from "@/lib/content";

const badges = [
  "IA por voz",
  "Resposta em milissegundos",
  "Agendamento automatizado",
  "Atendimento multicanal",
];

const stats = [
  { value: "30+", label: "idiomas disponiveis para expandir o atendimento" },
  { value: "ms", label: "de resposta para uma experiencia mais fluida" },
  { value: "24h", label: "de disponibilidade para nao deixar contatos esperando" },
  { value: "4", label: "canais para atender: telefone, WhatsApp, Telegram e site" },
];

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 3C6.477 3 2 6.91 2 11.733c0 2.31 1.03 4.41 2.709 5.982L4 22l4.139-2.217c1.183.315 2.46.483 3.861.483 5.523 0 10-3.91 10-8.533S17.523 3 12 3Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M7 2h2v3H7V2Zm8 0h2v3h-2V2ZM5 5h14a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2Zm0 5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8H5Zm3 3h3v3H8v-3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="m9.55 18.2-5.3-5.3 1.4-1.4 3.9 3.9 8.8-8.8 1.4 1.4-10.2 10.2Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm6.93 9h-3.02a15.56 15.56 0 0 0-1.45-5.02A8.03 8.03 0 0 1 18.93 11ZM12 4.06c.91 1.09 1.98 3.44 2.36 6.94H9.64C10.02 7.5 11.09 5.15 12 4.06ZM4.07 13h3.02a15.56 15.56 0 0 0 1.45 5.02A8.03 8.03 0 0 1 4.07 13Zm3.02-2H4.07a8.03 8.03 0 0 1 4.47-5.02A15.56 15.56 0 0 0 7.09 11Zm1.98 0a13.8 13.8 0 0 1 1.26-5.36A13.8 13.8 0 0 1 11.59 11Zm2.52 2a13.8 13.8 0 0 1-1.26 5.36A13.8 13.8 0 0 1 9.07 13Zm.41 6.94c-.91-1.09-1.98-3.44-2.36-6.94h4.72c-.38 3.5-1.45 5.85-2.36 6.94ZM14.93 13h2.98a8.03 8.03 0 0 1-4.47 5.02A15.56 15.56 0 0 0 14.93 13Zm.34-2c-.38-3.5-1.45-5.85-2.36-6.94.91 1.09 1.98 3.44 2.36 6.94Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main id="top" className="overflow-hidden">
      <section className="relative">
        <div className="hero-orb left-[-80px] top-20 h-40 w-40 bg-brand-300/50" />
        <div className="hero-orb right-[-30px] top-32 h-48 w-48 bg-sky-300/50" />

        <div className="shell relative pb-10 pt-6 sm:pb-16 sm:pt-8">
          <header className="glass-card flex items-center justify-between px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                AgentSet apresenta
              </p>
              <p className="mt-1 font-[var(--font-space-grotesk)] text-2xl font-semibold text-slate-950">
                Dizei
              </p>
            </div>

            <a
              href="https://agentset.com.br"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              agentset.com.br
            </a>
          </header>

          <div className="grid items-center gap-14 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:pt-20">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="mt-8 inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                dizei.me
              </p>

              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
                Voce diz. O Dizei faz.
              </h1>

              <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-slate-600 sm:text-xl">
                O agente de IA que responde seus clientes e agenda automaticamente,
                sem demora e sem perder oportunidades.
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Atendimento por voz com resposta em milissegundos, tom natural e
                suporte a mais de 30 idiomas para oferecer uma experiencia mais
                fluida, moderna e profissional desde o primeiro contato. Alem de
                agendar, o Dizei pode conduzir perguntas de triagem e organizar
                um resumo util para a equipe.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                O agente pode atender o cliente pelo telefone, WhatsApp, Telegram
                ou diretamente no website do consultorio, mantendo a experiencia
                simples para quem entra em contato.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <ButtonLink href="#demonstracao">Testar demonstracao</ButtonLink>
                <ButtonLink href="tel:+558132642080" variant="secondary">
                  Ligar para (81) 3264-2080
                </ButtonLink>
                <ButtonLink
                  href="https://agentset.com.br"
                  variant="secondary"
                  external
                >
                  Falar com a AgentSet
                </ButtonLink>
              </div>

              <div className="mt-10 flex flex-col gap-3 rounded-[26px] border border-slate-200/80 bg-white/70 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Branding
                  </p>
                  <p className="mt-2 text-lg font-medium text-slate-800">
                    Dizei-me, e farei.
                  </p>
                </div>

                <p className="max-w-sm text-sm leading-6 text-slate-500">
                  Conversa natural. Acao imediata.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-brand-100/80 blur-3xl" />
              <div className="absolute -right-8 bottom-10 h-36 w-36 rounded-full bg-sky-100/80 blur-3xl" />

              <div className="glass-card animate-float relative overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-0 bg-hero-grid bg-[size:36px_36px] opacity-50" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Fluxo em destaque
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                        Atendimento por voz com sensacao de conversa real
                      </h2>
                    </div>

                    <div className="animate-pulse-soft rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-glow">
                      Ao vivo
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                          Conversa guiada
                        </p>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                          IA por voz
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="max-w-[85%] rounded-3xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-6 text-white/85">
                          Ola, quero saber se voces atendem esta semana.
                        </div>
                        <div className="ml-auto max-w-[92%] rounded-3xl rounded-tr-md bg-brand-400 px-4 py-3 text-sm font-medium leading-6 text-slate-950">
                          Atendemos sim. Posso seguir com algumas informacoes e te
                          apresentar os proximos horarios disponiveis?
                        </div>
                        <div className="max-w-[82%] rounded-3xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-6 text-white/85">
                          Perfeito. Pode agendar para mim?
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Agenda sugerida
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-medium text-slate-600">
                          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(
                            (day, index) => (
                              <div
                                key={day}
                                className={`rounded-2xl border px-3 py-3 ${
                                  index === 2
                                    ? "border-brand-300 bg-brand-50 text-brand-700"
                                    : "border-slate-200 bg-slate-50"
                                }`}
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900">
                            Proximo passo do fluxo
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Confirmar dados, conduzir a triagem inicial,
                            apresentar janelas de horario e finalizar o
                            agendamento.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Diferencial tecnico
                        </p>

                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                          <li className="flex gap-3">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                            Voz natural, proxima de um atendimento humano.
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                            Mais de 30 idiomas para operacoes mais versateis.
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                            Resposta em milissegundos para fluidez na conversa.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-4 rounded-[30px] border border-slate-200/80 bg-white/70 p-5 shadow-soft sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-slate-200 bg-white px-5 py-5"
              >
                <p className="text-3xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="problema" className="section-space">
        <div className="shell">
          <SectionHeading
            eyebrow="O problema"
            title="Enquanto voce demora para responder, outro lugar agenda."
            description="Quando o atendimento nao acontece na hora, a oportunidade esfria. E em muitos casos, ela desaparece antes mesmo de chegar ate sua equipe."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {painPoints.map((item) => (
              <FeatureCard
                key={item.title}
                icon={<BoltIcon />}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="solucao" className="section-space pt-0">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-10">
              <SectionHeading
                eyebrow="A solucao"
                title="Menos espera. Mais agendamentos."
                description="O Dizei foi pensado para dar velocidade ao primeiro contato, manter a conversa organizada e reduzir o peso do atendimento manual."
              />

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-950 p-7 text-white shadow-glow">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                  Proposta central
                </p>
                <p className="mt-4 text-2xl font-semibold leading-tight">
                  Atendimento imediato para quem nao quer perder oportunidades.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  O Dizei responde, organiza e conduz a conversa para que o cliente
                  nao fique esperando e a equipe nao precise comecar tudo do zero a
                  cada novo contato, seja por telefone, WhatsApp, Telegram ou pelo
                  website do consultorio.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {solutions.map((item, index) => (
                <FeatureCard
                  key={item.title}
                  icon={
                    index % 3 === 0 ? (
                      <ChatIcon />
                    ) : index % 3 === 1 ? (
                      <CalendarIcon />
                    ) : (
                      <CheckIcon />
                    )
                  }
                  title={item.title}
                  description={item.description}
                  accent={index === 0 || index === 3}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="voz" className="section-space pt-0">
        <div className="shell">
          <SectionHeading
            eyebrow="Diferencial do produto"
            title="Voz mais natural, resposta mais rapida e atendimento com alcance global."
            description="O Dizei combina fluidez de conversa, velocidade tecnica e versatilidade de idioma para deixar o atendimento mais proximo, mais eficiente e mais confiavel."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {voiceHighlights.map((item, index) => (
              <FeatureCard
                key={item.title}
                icon={
                  index === 0 ? (
                    <ChatIcon />
                  ) : index === 1 ? (
                    <BoltIcon />
                  ) : index === 2 ? (
                    <GlobeIcon />
                  ) : (
                    <CheckIcon />
                  )
                }
                title={item.title}
                description={item.description}
                accent={index === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="triagem" className="section-space pt-0">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
              <span className="section-kicker">Triagem inteligente</span>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                O agendamento pode chegar acompanhado de contexto, nao so de um horario.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                Antes de oferecer horarios, o Dizei pode seguir perguntas
                predefinidas pela clinica para entender melhor a necessidade do
                paciente. Isso ajuda a qualificar o contato, organizar a triagem
                inicial e preparar melhor o profissional para o atendimento.
              </p>

              <div className="mt-8 rounded-[28px] border border-brand-100 bg-brand-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
                  Valor para a operacao
                </p>
                <p className="mt-4 text-lg font-semibold leading-8 text-slate-950">
                  Medico, fisioterapeuta, dentista ou outro profissional pode
                  receber um resumo da conversa com respostas-chave da triagem,
                  em vez de comecar o atendimento sem contexto.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  A clinica define as perguntas importantes para o fluxo. O
                  Dizei conduz a conversa, registra as respostas e organiza um
                  resumo objetivo para apoiar a equipe.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {triageHighlights.map((item, index) => (
                <FeatureCard
                  key={item.title}
                  icon={
                    index === 0 ? (
                      <ChatIcon />
                    ) : index === 1 ? (
                      <CheckIcon />
                    ) : index === 2 ? (
                      <BoltIcon />
                    ) : (
                      <CalendarIcon />
                    )
                  }
                  title={item.title}
                  description={item.description}
                  accent={index === 2}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section-space pt-0">
        <div className="shell">
          <SectionHeading
            eyebrow="Como funciona"
            title="Um fluxo simples, elegante e facil de entender."
            description="O processo foi apresentado para parecer natural para o cliente e eficiente para a operacao."
            align="center"
          />

          <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
            <div className="absolute left-1/2 top-12 hidden h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block" />

            {steps.map((step) => (
              <article
                key={step.number}
                className="glass-card relative p-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-semibold text-white shadow-glow">
                  {step.number}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {step.number === "02"
                    ? "A IA atende na hora, responde o que for necessario, pode seguir perguntas de triagem definidas pela clinica e organiza as informacoes para o proximo passo."
                    : step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="section-space pt-0">
        <div className="shell">
          <div className="rounded-[34px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 p-8 text-white shadow-soft sm:p-10 lg:p-12">
            <div className="max-w-3xl">
              <span className="section-kicker border-white/10 bg-white/10 text-brand-100">
                Beneficios
              </span>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Mais rapidez para quem entra em contato. Mais controle para quem atende.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
                O valor do Dizei aparece tanto na experiencia do cliente quanto na
                organizacao da operacao.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/85 backdrop-blur"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-brand-300">
                    <CheckIcon />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="demonstracao" className="section-space pt-0">
        <div className="shell">
          <VoiceDemo />
        </div>
      </section>

      <section id="faq" className="section-space pt-0">
        <div className="shell">
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas frequentes"
            description="Respostas curtas para as duvidas mais comuns antes de avancar para a demonstracao."
            align="center"
          />

          <div className="mt-12 grid gap-5">
            {faqs.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-4 sm:pb-24">
        <div className="shell">
          <div className="rounded-[34px] border border-slate-200 bg-gradient-to-r from-brand-50 via-white to-sky-50 p-8 shadow-soft sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
              Chamada final
            </p>
            <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold text-slate-950 sm:text-5xl">
              Transforme perguntas em agendamentos.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Pare de perder clientes por demora no atendimento. Com o Dizei, sua
              operacao ganha velocidade logo no primeiro contato, no canal que o
              cliente preferir usar.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#demonstracao">Testar demonstracao</ButtonLink>
              <ButtonLink href="tel:+558132642080" variant="secondary">
                Ligar para (81) 3264-2080
              </ButtonLink>
              <ButtonLink
                href="https://agentset.com.br"
                variant="secondary"
                external
              >
                Conhecer a AgentSet
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 py-8">
        <div className="shell flex flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-slate-500">
              Dizei
            </p>
            <p className="mt-2 text-slate-600">
              Produto desenvolvido pela AgentSet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="https://dizei.me" target="_blank" rel="noreferrer">
              dizei.me
            </a>
            <a
              href="https://agentset.com.br"
              target="_blank"
              rel="noreferrer"
            >
              agentset.com.br
            </a>
            <span>AgentSet</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
