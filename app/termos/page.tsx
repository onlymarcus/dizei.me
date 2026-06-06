import type { Metadata } from "next";

import {
  commercialWhatsappDisplay,
  commercialWhatsappHref,
  companyCnpj,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de Uso | Dizei",
  description:
    "Termos de uso do Dizei para atendimento, triagem e agendamento com agente de IA.",
};

const terms = [
  {
    title: "1. Servico",
    body: "O Dizei oferece agente de IA para atendimento, triagem inicial e agendamento em canais como telefone, website e mensagens. O servico pode ser configurado conforme a rotina da clinica contratante.",
  },
  {
    title: "2. Uso adequado",
    body: "A clinica contratante deve configurar fluxos, perguntas e informacoes de forma correta, respeitando normas profissionais, privacidade dos pacientes e legislacao aplicavel.",
  },
  {
    title: "3. Atendimento por IA",
    body: "O Dizei automatiza partes do atendimento, mas nao substitui avaliacao profissional, diagnostico, conduta clinica ou atendimento humano quando necessario.",
  },
  {
    title: "4. Agenda e integracoes",
    body: "O Dizei pode usar integracoes com ferramentas de agenda, mensagens, telefonia e automacao. A disponibilidade dessas integracoes pode depender de provedores externos.",
  },
  {
    title: "5. Responsabilidades da clinica",
    body: "A clinica e responsavel por revisar informacoes, confirmar atendimentos, manter dados corretos, orientar sua equipe e garantir que o uso do sistema esteja alinhado as suas obrigacoes profissionais.",
  },
  {
    title: "6. Marcas de terceiros",
    body: "WhatsApp, Meta, Google Calendar, Cal.com e outras marcas citadas pertencem aos seus respectivos titulares. O Dizei nao declara afiliacao oficial, propriedade ou parceria aprovada por essas marcas, salvo quando expressamente informado.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="shell">
          <a href="/" className="text-sm font-semibold text-emerald-700">
            Voltar para dizei.me
          </a>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Estes termos descrevem as condicoes gerais de uso do Dizei em
            demonstracoes e em configuracoes comerciais para clinicas e
            consultorios.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            CNPJ: {companyCnpj}. Ultima atualizacao: 6 de junho de 2026.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="shell max-w-4xl">
          <div className="space-y-5">
            {terms.map((term) => (
              <article
                key={term.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {term.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {term.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Contato</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Para falar sobre contratacao, suporte comercial ou duvidas sobre
              estes termos, entre em contato pelo WhatsApp comercial:{" "}
              <a
                href={commercialWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-950 underline decoration-emerald-300 underline-offset-4"
              >
                {commercialWhatsappDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
