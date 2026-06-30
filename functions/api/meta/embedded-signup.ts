// Cloudflare Pages Function — POST /api/meta/embedded-signup
//
// Valida o token da clinica, troca o authorization code por um access token
// via Meta Graph API e (futuro) envia para o n8n para configuracao do workspace.
//
// Variaveis de ambiente necessarias no Cloudflare:
//   META_APP_ID            — App ID da Meta
//   META_APP_SECRET        — App Secret (nunca exposto ao cliente)
//   ADMIN_SECRET           — mesmo segredo usado em generate-clinic-token
//   META_GRAPH_API_VERSION — opcional, padrao v23.0
//   N8N_WEBHOOK_URL        — URL do webhook n8n (quando implementado)

interface Env {
  META_APP_SECRET?: string;
  META_APP_ID?: string;
  META_GRAPH_API_VERSION?: string;
  ADMIN_SECRET?: string;
  N8N_WEBHOOK_URL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface RequestBody {
  code: string;
  clinic_token: string;
}

interface MetaTokenResponse {
  access_token?: string;
  token_type?: string;
  error?: { message: string; type: string; code: number };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function verifyClinicToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; clinicName?: string }> {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return { valid: false };

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expectedSig = await hmacSign(payload, secret);
  if (signature !== expectedSig) return { valid: false };

  try {
    const binary = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const data = JSON.parse(new TextDecoder().decode(bytes)) as {
      c: string;
      exp: number;
    };
    if (data.exp < Math.floor(Date.now() / 1000)) return { valid: false };
    return { valid: true, clinicName: data.c };
  } catch {
    return { valid: false };
  }
}

export async function onRequestPost({
  request,
  env,
}: PagesContext): Promise<Response> {
  const appId = env.META_APP_ID;
  const appSecret = env.META_APP_SECRET;
  const adminSecret = env.ADMIN_SECRET;

  if (!appId || !appSecret || !adminSecret) {
    console.error("Missing required environment variables");
    return json({ error: "server_misconfiguration" }, 500);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { code, clinic_token } = body;

  if (!code) return json({ error: "code_required" }, 400);
  if (!clinic_token) return json({ error: "clinic_token_required" }, 400);

  const { valid, clinicName } = await verifyClinicToken(clinic_token, adminSecret);
  if (!valid) {
    console.error("Invalid or expired clinic token");
    return json({ error: "invalid_clinic_token" }, 401);
  }

  const apiVersion = env.META_GRAPH_API_VERSION ?? "v23.0";

  const tokenUrl = new URL(
    `https://graph.facebook.com/${apiVersion}/oauth/access_token`
  );
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("code", code);

  let tokenData: MetaTokenResponse;
  try {
    const tokenRes = await fetch(tokenUrl.toString());
    tokenData = (await tokenRes.json()) as MetaTokenResponse;
  } catch (err) {
    console.error("Meta token exchange network error:", err);
    return json({ error: "token_exchange_failed" }, 502);
  }

  if (!tokenData.access_token) {
    const detail = tokenData.error?.message ?? "unknown";
    console.error("Meta token exchange returned no access_token:", detail);
    return json({ error: "token_exchange_failed", detail }, 502);
  }

  // Envia para o n8n quando o webhook estiver configurado
  if (env.N8N_WEBHOOK_URL) {
    try {
      await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_name: clinicName,
          access_token: tokenData.access_token,
          connected_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Falha ao notificar n8n:", err);
      // Nao falha o request — a conexao Meta foi bem-sucedida
    }
  } else {
    console.log("WhatsApp Business autorizado para clinica:", clinicName);
  }

  return json({ ok: true });
}
