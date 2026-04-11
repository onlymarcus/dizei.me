# Landing page do Dizei

Projeto em `Next.js` com `React` e `Tailwind CSS` para a landing page comercial do produto Dizei, da AgentSet.

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

3. Abra `http://localhost:3000`.

## Build estática para Cloudflare Pages

O projeto está configurado para exportação estática.

1. Gere a build:

```bash
npm run build
```

2. O conteúdo final será criado na pasta `out/`.

3. No Cloudflare Pages, use:

- Build command: `npm run build`
- Build output directory: `out`

## Scripts disponíveis

- `npm run dev` para desenvolvimento
- `npm run build` para gerar a versão estática de produção
- `npm run typecheck` para validar TypeScript
