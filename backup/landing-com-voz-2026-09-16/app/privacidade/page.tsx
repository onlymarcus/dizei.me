import type { Metadata } from "next";

import {
  commercialWhatsappDisplay,
  commercialWhatsappHref,
  companyCnpj,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Politica de Privacidade | Dizei",
  description:
    "Politica de privacidade do Dizei para atendimento, triagem e agendamento com agente de IA.",
};

const sections = [
  {
    title: "1. Dados que podemos tratar",
    body: "Podemos tratar dados informados durante o atendimento, como nome, telefone, mensagens, audio, transcricao, motivo do contato, preferencia de horario e informacoes necessarias para triagem e agendamento. Quando a clinica conecta o WhatsApp Business via autorizacao Meta, podemos tratar identificadores de conta como business_id, waba_id e phone_number_id, alem de tokens de acesso necessarios para operar o canal.",
  },
  {
    title: "2. Finalidade de uso",
    body: "Os dados sao usados para responder contatos, realizar triagem inicial, organizar agendamentos, gerar resumo da conversa para a equipe da clinica, operar canais de mensagens autorizados e melhorar a experiencia de atendimento. Registros de mensagens, transcricoes e metadados de conversas podem ser mantidos para garantir a operacao correta do servico.",
  },
  {
    title: "3. Compartilhamento",
    body: "Os dados podem ser compartilhados com a clinica contratante e com provedores tecnicos necessarios para operar o servico: plataformas de telefonia, mensagens (incluindo Meta/WhatsApp), agenda, inteligencia artificial, hospedagem e automacao. O Dizei nao vende dados pessoais de pacientes ou usuarios.",
  },
  {
    title: "4. Autorizacao via Meta",
    body: "Ao conectar o WhatsApp Business pela janela oficial da Meta (Embedded Signup), a clinica concede ao Dizei um token de acesso que permite enviar e receber mensagens no canal autorizado. Esse token e armazenado de forma segura e utilizado exclusivamente para operar o atendimento contratado. O Dizei nao solicita senha, codigo de verificacao SMS ou acesso direto as credenciais da conta Meta. A autorizacao pode ser revogada a qualquer momento pela propria conta Meta Business da clinica.",
  },
  {
    title: "5. Dados sensiveis",
    body: "Quando o atendimento envolver saude, as informacoes podem ter natureza sensivel. O Dizei deve ser usado pela clinica de forma compativel com a LGPD e com as regras aplicaveis ao seu setor.",
  },
  {
    title: "6. Retencao e seguranca",
    body: "Mantemos dados pelo tempo necessario para prestar o servico, cumprir obrigacoes legais, resolver problemas e apoiar a operacao da clinica. Adotamos controles tecnicos e organizacionais para proteger as informacoes, incluindo tokens de acesso e identificadores de conta.",
  },
  {
    title: "7. Direitos do titular",
    body: "O titular dos dados pode solicitar acesso, correcao, exclusao, revisao ou informacoes sobre o uso de seus dados, conforme previsto na legislacao aplicavel.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="shell">
          <a href="/" className="text-sm font-semibold text-emerald-700">
            Voltar para dizei.me
          </a>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
            Politica de Privacidade
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Esta politica explica como o Dizei pode tratar dados durante
            demonstracoes, atendimento por IA, triagem e agendamento.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            CNPJ: {companyCnpj}. Ultima atualizacao: 18 de junho de 2026.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="shell max-w-4xl">
          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Contato</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Para solicitar informacoes sobre privacidade ou uso de dados,
              entre em contato pelo WhatsApp comercial:{" "}
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
