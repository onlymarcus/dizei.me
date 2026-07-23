import { ConnectWhatsappButton } from "@/components/landing/connect-whatsapp-button";
import { StartDemoButton } from "@/components/landing/start-demo-button";
import { ArrowIcon, CheckIcon } from "@/components/landing/ui-icons";
import { VoiceDemo } from "@/components/landing/voice-demo";
import {
  commercialWhatsappDisplay,
  commercialWhatsappHref,
  companyCnpj,
  demoPhoneDisplay,
  demoPhoneHref,
  demoWhatsappDisplay,
  demoWhatsappHref,
} from "@/lib/site-config";

type Locale = "pt" | "en";

const COPY = {
  pt: {
    testByPhone: "Teste por telefone",
    heroBadge: "Demonstracao ao vivo em dizei.me",
    heroHeading: "Veja uma IA agendando pacientes ao vivo",
    heroParagraph:
      "Clique para conversar com a IA dentro da pagina, peca uma consulta e acompanhe o agendamento aparecendo na agenda em tempo real. Se preferir, teste tambem pelo telefone ou WhatsApp da demonstracao.",
    channelsKicker: "Canais de teste da IA",
    phoneLabel: "Telefone",
    whatsappLabel: "WhatsApp da IA",
    channelsParagraph:
      "Esses canais conectam voce ao agente de IA da demonstracao. Fale como paciente, escolha um horario e veja o compromisso aparecer na agenda.",
    testOnPageNow: "Testar na pagina agora",
    testViaWhatsapp: "Testar pelo WhatsApp",
    cardKicker: "Teste em menos de 2 minutos",
    cardSteps: [
      "Clique para falar com a IA",
      "Peca um horario de consulta",
      "Acompanhe a agenda ao vivo",
    ],
    cardFooter: "Seu paciente fala. A IA atende. A agenda preenche sozinha.",
    aboutKicker: "O que e o Dizei",
    aboutHeading:
      "Uma recepcao inteligente para clinicas que precisam responder e agendar mais rapido.",
    aboutParagraph1:
      "O Dizei e um agente de IA para atendimento de pacientes e clientes. Ele conversa com voz natural, pode responder mensagens via WhatsApp, coletar informacoes iniciais e conduzir o agendamento na agenda da clinica.",
    aboutParagraph2:
      "O produto e voltado para clinicas, consultorios, odontologia, estetica, psicologia e empresas de servicos que perdem oportunidades por demora no atendimento.",
    servicePoints: [
      "Atendimento por telefone, WhatsApp e website",
      "Agendamento em Google Calendar ou Cal.com",
      "Triagem com perguntas predefinidas",
      "Resumo da conversa para a equipe",
    ],
    benefitsKicker: "Beneficios diretos",
    benefitsHeading: "Menos chamadas perdidas. Mais consultas marcadas.",
    benefits: [
      "Atendimento 24h",
      "Voz natural",
      "Agenda no Google Calendar e Cal.com",
      "Triagem automatica",
      "Mais de 30 idiomas",
      "Resumo enviado ao medico",
    ],
    audienceKicker: "Para quem e",
    audienceHeading:
      "Feito para clinicas e consultorios que dependem de agenda cheia.",
    audiences: [
      "Clinicas medicas",
      "Dentistas",
      "Clinicas de estetica",
      "Psicologos",
      "Dermatologistas",
      "Consultorios particulares",
    ],
    problemKicker: "O problema",
    problemHeading:
      "Sua recepcao nao consegue atender todos os pacientes o tempo todo.",
    problemParagraph:
      "Cada ligacao perdida pode ser uma consulta que foi para outro consultorio. O Dizei atende, orienta e agenda mesmo quando sua equipe esta ocupada.",
    problemStat: "24h",
    problemStatCaption:
      "Atendimento disponivel para reduzir espera, aliviar a recepcao e transformar mais contatos em agendamentos.",
    ctaKicker: "Proximo passo",
    ctaHeading: "Quer testar na sua clinica?",
    ctaParagraph:
      "Podemos configurar uma demonstracao com o nome, voz e agenda da sua clinica.",
    ctaImplement: "Quero implementar o Dizei",
    ctaTestNow: "Testar agora na pagina",
    ctaFooter: "Atendimento comercial humano para adaptar o Dizei a rotina da sua clinica. Contato comercial:",
    whatsappSectionKicker: "WhatsApp Business",
    whatsappSectionHeading: "Conecte o canal oficial da sua clinica",
    whatsappSectionParagraph:
      "Autorize o Dizei a operar no WhatsApp Business da sua clinica pela janela oficial da Meta. O processo e seguro e acontece inteiramente dentro do ambiente da Meta.",
    whatsappFeatures: [
      "Janela oficial da Meta",
      "Nao solicitamos sua senha",
      "Controle total na sua conta Meta",
      "Sem armazenamento de credenciais",
    ],
    footerTagline:
      "Agente de IA para atendimento, triagem e agendamento em clinicas e consultorios. WhatsApp e Meta sao marcas de seus respectivos titulares; o Dizei nao declara afiliacao oficial ou propriedade dessas marcas.",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos de uso",
    footerContact: "Contato comercial",
  },
  en: {
    testByPhone: "Test by phone",
    heroBadge: "Live demo at dizei.me",
    heroHeading: "Watch an AI schedule patients live",
    heroParagraph:
      "Click to talk to the AI right on this page, request an appointment, and watch it appear on the calendar in real time. You can also test it by phone or via the demo WhatsApp.",
    channelsKicker: "AI testing channels",
    phoneLabel: "Phone",
    whatsappLabel: "AI WhatsApp",
    channelsParagraph:
      "These channels connect you to the demo AI agent. Speak as a patient, pick a time, and watch the appointment show up on the calendar.",
    testOnPageNow: "Test on this page now",
    testViaWhatsapp: "Test via WhatsApp",
    cardKicker: "Test it in under 2 minutes",
    cardSteps: [
      "Click to talk to the AI",
      "Request an appointment time",
      "Watch the calendar update live",
    ],
    cardFooter: "Your patient talks. The AI handles it. The calendar fills itself.",
    aboutKicker: "What is Dizei",
    aboutHeading:
      "A smart front desk for clinics that need to respond and book faster.",
    aboutParagraph1:
      "Dizei is an AI agent for patient and customer support. It speaks with a natural voice, can reply to WhatsApp messages, collect initial information, and handle scheduling on the clinic's calendar.",
    aboutParagraph2:
      "The product is built for clinics, medical offices, dentistry, aesthetics, psychology, and service businesses that lose opportunities due to slow response times.",
    servicePoints: [
      "Support by phone, WhatsApp, and website",
      "Scheduling in Google Calendar or Cal.com",
      "Intake with predefined questions",
      "Conversation summary for the team",
    ],
    benefitsKicker: "Direct benefits",
    benefitsHeading: "Fewer missed calls. More booked appointments.",
    benefits: [
      "24/7 support",
      "Natural voice",
      "Scheduling on Google Calendar and Cal.com",
      "Automatic intake",
      "30+ languages",
      "Summary sent to the doctor",
    ],
    audienceKicker: "Who it's for",
    audienceHeading:
      "Built for clinics and practices that depend on a full schedule.",
    audiences: [
      "Medical clinics",
      "Dentists",
      "Aesthetic clinics",
      "Psychologists",
      "Dermatologists",
      "Private practices",
    ],
    problemKicker: "The problem",
    problemHeading: "Your front desk can't answer every patient, all the time.",
    problemParagraph:
      "Every missed call could be an appointment that went to another practice. Dizei answers, guides, and schedules even when your team is busy.",
    problemStat: "24/7",
    problemStatCaption:
      "Support available to cut wait times, ease the front desk workload, and turn more contacts into booked appointments.",
    ctaKicker: "Next step",
    ctaHeading: "Want to test it in your clinic?",
    ctaParagraph:
      "We can set up a demo using your clinic's name, voice, and calendar.",
    ctaImplement: "I want to implement Dizei",
    ctaTestNow: "Test now on this page",
    ctaFooter: "Human sales support to adapt Dizei to your clinic's routine. Sales contact:",
    whatsappSectionKicker: "WhatsApp Business",
    whatsappSectionHeading: "Connect your clinic's official channel",
    whatsappSectionParagraph:
      "Authorize Dizei to operate your clinic's WhatsApp Business through Meta's official window. The process is secure and happens entirely within Meta's environment.",
    whatsappFeatures: [
      "Meta's official window",
      "We never ask for your password",
      "Full control from your Meta account",
      "No credentials stored",
    ],
    footerTagline:
      "AI agent for patient support, intake, and scheduling for clinics and medical offices. WhatsApp and Meta are trademarks of their respective owners; Dizei does not claim official affiliation with or ownership of these trademarks.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerContact: "Sales contact",
  },
} satisfies Record<Locale, unknown>;

export function HomePage({ locale = "pt" }: { locale?: Locale }) {
  const t = COPY[locale];

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
              {t.testByPhone}
            </a>
          </header>

          <div
            id="top"
            className="grid min-h-[calc(100svh-84px)] gap-10 pb-10 pt-10 lg:grid-cols-[1fr_0.74fr] lg:items-center lg:pt-8"
          >
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                {t.heroBadge}
              </p>

              <h1 className="mt-6 text-balance text-5xl font-semibold leading-none tracking-normal text-white sm:text-6xl lg:text-7xl">
                {t.heroHeading}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                {t.heroParagraph}
              </p>

              <div className="mt-8 rounded-3xl border border-white/12 bg-white/8 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {t.channelsKicker}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <a
                    href={demoPhoneHref}
                    className="rounded-2xl border border-white/12 bg-white/8 p-4 transition hover:bg-white/12"
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      {t.phoneLabel}
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
                      {t.whatsappLabel}
                    </span>
                    <span className="mt-1 block font-[var(--font-space-grotesk)] text-2xl font-semibold text-emerald-300">
                      {demoWhatsappDisplay}
                    </span>
                  </a>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {t.channelsParagraph}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <StartDemoButton>{t.testOnPageNow}</StartDemoButton>
                <a
                  href={demoWhatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/16 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/16 sm:w-auto"
                >
                  {t.testViaWhatsapp}
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/8 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                {t.cardKicker}
              </p>
              <div className="mt-5 space-y-4">
                {t.cardSteps.map((item, index) => (
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
                {t.cardFooter}
              </p>
            </div>
          </div>
        </div>
      </section>

      <VoiceDemo locale={locale} />

      <section className="bg-white py-14 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="section-kicker">{t.aboutKicker}</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {t.aboutHeading}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              {t.aboutParagraph1}
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t.aboutParagraph2}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {t.servicePoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon />
                </span>
                <p className="text-sm font-semibold leading-6 text-slate-900">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="section-kicker">{t.benefitsKicker}</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {t.benefitsHeading}
            </h2>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.benefits.map((benefit) => (
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
            <p className="section-kicker">{t.audienceKicker}</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {t.audienceHeading}
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {t.audiences.map((audience) => (
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
              {t.problemKicker}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              {t.problemHeading}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {t.problemParagraph}
            </p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/8 p-6">
            <p className="text-4xl font-semibold text-emerald-300">
              {t.problemStat}
            </p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {t.problemStatCaption}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 py-14 sm:py-16">
        <div className="shell text-center">
          <p className="section-kicker">{t.ctaKicker}</p>
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            {t.ctaHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {t.ctaParagraph}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={commercialWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900 sm:w-auto"
            >
              {t.ctaImplement}
              <ArrowIcon />
            </a>
            <StartDemoButton>{t.ctaTestNow}</StartDemoButton>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            {t.ctaFooter} {commercialWhatsappDisplay}.
          </p>
        </div>
      </section>

      <section id="whatsapp-connect-section" className="bg-white py-14 sm:py-16">
        <div className="shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">{t.whatsappSectionKicker}</p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {t.whatsappSectionHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {t.whatsappSectionParagraph}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.whatsappFeatures.map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon />
                </span>
                <p className="text-sm font-semibold leading-5 text-slate-900">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <ConnectWhatsappButton locale={locale} />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="shell grid gap-5 text-sm text-slate-500 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="font-semibold text-slate-700">Dizei</p>
            <p className="mt-1 text-slate-500">CNPJ: {companyCnpj}</p>
            <p className="mt-2 max-w-2xl leading-6">{t.footerTagline}</p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <a href="https://dizei.me" target="_blank" rel="noreferrer">
              dizei.me
            </a>
            <a href="/privacidade.html">{t.footerPrivacy}</a>
            <a href="/termos.html">{t.footerTerms}</a>
            <a href={commercialWhatsappHref} target="_blank" rel="noreferrer">
              {t.footerContact}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
