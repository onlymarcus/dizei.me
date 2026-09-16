// Cloudflare Pages Function — POST /api/meta/capi
//
// Recebe os eventos que o site dispara (lib/meta-pixel.ts) e reenvia para a
// API de Conversoes da Meta a partir do servidor. O access token da CAPI fica
// so aqui: ele nunca entra no bundle do cliente.
//
// Variaveis de ambiente necessarias no Cloudflare:
//   META_PIXEL_ID             — ID do conjunto de dados (mesmo do Pixel)
//   META_CAPI_ACCESS_TOKEN    — token gerado no Gerenciador de Eventos
//   META_GRAPH_API_VERSION    — opcional, padrao v23.0
//   META_CAPI_TEST_EVENT_CODE — opcional; preencher so enquanto estiver
//                               usando "Testar eventos" e remover depois,
//                               senao os eventos nao entram em producao

interface Env {
  META_PIXEL_ID?: string;
  META_CAPI_ACCESS_TOKEN?: string;
  META_GRAPH_API_VERSION?: string;
  META_CAPI_TEST_EVENT_CODE?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface RequestBody {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  fbp?: string;
  fbc?: string;
  user_data?: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
}

// Eventos selecionados no Gerenciador de Eventos. Este endpoint e publico,
// entao qualquer outro nome e recusado para que ninguem use o token da Dizei
// para poluir o conjunto de dados.
const ALLOWED_EVENTS = new Set(["ViewContent", "Contact", "Lead"]);

const ALLOWED_HOSTS = new Set(["dizei.me", "www.dizei.me", "localhost"]);

// Campos que a Meta exige normalizados e em SHA-256.
const HASHED_FIELDS = [
  "em",
  "ph",
  "fn",
  "ln",
  "ct",
  "st",
  "zp",
  "db",
  "external_id",
] as const;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Regras de normalizacao da Meta antes do hash. Hash de valor nao normalizado
// simplesmente nao casa com nenhuma conta, e a metrica de correspondencia cai
// sem dar erro nenhum.
function normalize(field: string, value: string): string {
  const lowered = value.trim().toLowerCase();

  switch (field) {
    // Somente digitos, mantendo o codigo do pais.
    case "ph":
    case "zp":
      return lowered.replace(/\D/g, "");
    // AAAAMMDD.
    case "db":
      return lowered.replace(/\D/g, "");
    // Sem espacos, pontuacao ou acentos.
    case "ct":
    case "st":
      return lowered
        .normalize("NFD")
        .replace(/[^a-z]/g, "");
    // Identificador interno: preserva a caixa original.
    case "external_id":
      return value.trim();
    default:
      return lowered;
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    // *.pages.dev cobre os deploys de preview da Cloudflare.
    return ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".pages.dev");
  } catch {
    return false;
  }
}

export async function onRequestPost({
  request,
  env,
}: PagesContext): Promise<Response> {
  const pixelId = env.META_PIXEL_ID;
  const accessToken = env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error("META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN nao configurado");
    return json({ error: "server_misconfiguration" }, 500);
  }

  if (!originAllowed(request)) {
    return json({ error: "forbidden_origin" }, 403);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const eventName = body.event_name;
  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return json({ error: "event_not_allowed" }, 400);
  }

  const userData: Record<string, unknown> = {};

  for (const field of HASHED_FIELDS) {
    const raw = body.user_data?.[field];
    if (typeof raw !== "string") continue;

    const normalized = normalize(field, raw);
    if (!normalized) continue;

    userData[field] = [await sha256Hex(normalized)];
  }

  // fbc e fbp vao em texto puro — a configuracao no Gerenciador de Eventos
  // marca os dois como "Nao converter em hash".
  if (typeof body.fbc === "string" && body.fbc) userData.fbc = body.fbc;
  if (typeof body.fbp === "string" && body.fbp) userData.fbp = body.fbp;

  // O IP e o user agent so existem aqui no servidor, e sao justamente o que
  // permite casar o evento quando nao ha email nem telefone.
  const userAgent = request.headers.get("User-Agent");
  const clientIp = request.headers.get("CF-Connecting-IP");
  if (userAgent) userData.client_user_agent = userAgent;
  if (clientIp) userData.client_ip_address = clientIp;

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    user_data: userData,
  };

  // Mesmo event_id do Pixel: e por ele que a Meta desduplica os dois envios.
  if (typeof body.event_id === "string" && body.event_id) {
    event.event_id = body.event_id.slice(0, 128);
  }
  if (typeof body.event_source_url === "string" && body.event_source_url) {
    event.event_source_url = body.event_source_url.slice(0, 1000);
  }
  if (body.custom_data && typeof body.custom_data === "object") {
    event.custom_data = body.custom_data;
  }

  const apiVersion = env.META_GRAPH_API_VERSION ?? "v23.0";
  const payload: Record<string, unknown> = { data: [event] };
  if (env.META_CAPI_TEST_EVENT_CODE) {
    payload.test_event_code = env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = (await res.json().catch(() => null)) as {
      events_received?: number;
      error?: { message?: string };
    } | null;

    if (!res.ok) {
      console.error(
        "CAPI recusou o evento",
        eventName,
        data?.error?.message ?? `status ${res.status}`
      );
      return json({ error: "capi_rejected" }, 502);
    }

    return json({ ok: true, events_received: data?.events_received ?? 0 });
  } catch (err) {
    console.error("Erro de rede ao chamar a CAPI:", err);
    return json({ error: "capi_unreachable" }, 502);
  }
}
