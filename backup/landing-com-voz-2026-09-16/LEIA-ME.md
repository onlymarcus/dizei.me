# Backup — landing com demonstracao de voz (ElevenLabs)

Snapshot tirado em 16/09/2026, antes de remover a demo de voz em tempo real
e o telefone de demonstracao do site.

## O que esta aqui

Copia de `app/`, `components/`, `lib/`, `next.config.ts` e `package.json`
exatamente como estavam no commit `cd0ed64`.

## O que foi removido da versao nova

- `components/landing/voice-demo.tsx` — painel de conversa por voz com o
  agente ElevenLabs (agent widget + transcricao + calendario embutido)
- `components/landing/start-demo-button.tsx` — botao que disparava o evento
  `dizei:start-demo`
- Telefone de demonstracao `(81) 3264-2080` (`demoPhoneDisplay` /
  `demoPhoneHref` em `lib/site-config.ts`)
- Dependencia `@elevenlabs/react`

O texto de marketing sobre atendimento por voz e multiplos idiomas **foi
mantido** no site. So a demonstracao ao vivo saiu.

## Como restaurar

```bash
cp -r backup/landing-com-voz-2026-09-16/app .
cp -r backup/landing-com-voz-2026-09-16/components .
cp -r backup/landing-com-voz-2026-09-16/lib .
npm install @elevenlabs/react
```

Ou, pelo git:

```bash
git checkout landing-com-voz-2026-09-16 -- app components lib
```

Tag git equivalente: `landing-com-voz-2026-09-16`
