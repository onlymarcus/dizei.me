// Cloudflare Pages Function — GET /api/admin/generate-clinic-token
//
// Gera um link de onboarding assinado para uma clinica especifica.
// Apenas Marcus usa esse endpoint; o ADMIN_SECRET nunca vai ao cliente.
//
// Uso:
//   GET /api/admin/generate-clinic-token?secret=SEU_ADMIN_SECRET&clinic=Clinica+X&days=30
//
// Resposta:
//   { clinic, link, expires_at, token }
//
// Variaveis de ambiente necessarias no Cloudflare:
//   ADMIN_SECRET — segredo para proteger este endpoint

interface Env {
  ADMIN_SECRET?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
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

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function onRequestGet({
  request,
  env,
}: PagesContext): Promise<Response> {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const clinicName = url.searchParams.get("clinic")?.trim();
  const clinicId = url.searchParams.get("id")?.trim().toLowerCase();
  const days = Math.min(
    Math.max(parseInt(url.searchParams.get("days") ?? "30", 10), 1),
    365
  );

  if (!env.ADMIN_SECRET || secret !== env.ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!clinicName) {
    return new Response(
      JSON.stringify({ error: "Parametro 'clinic' e obrigatorio" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!clinicId) {
    return new Response(
      JSON.stringify({ error: "Parametro 'id' e obrigatorio (ex: clinica_werneck)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const expiresAt = Math.floor(Date.now() / 1000) + days * 86400;
  const payload = toBase64Url(
    JSON.stringify({ c: clinicName, id: clinicId, exp: expiresAt })
  );
  const signature = await hmacSign(payload, env.ADMIN_SECRET);
  const token = `${payload}.${signature}`;
  const link = `https://dizei.me/?token=${encodeURIComponent(token)}`;

  const expiresDisplay = new Date(expiresAt * 1000)
    .toISOString()
    .replace("T", " ")
    .replace(".000Z", " UTC");

  return new Response(
    JSON.stringify({ clinic: clinicName, clinic_id: clinicId, link, expires_at: expiresDisplay, token }, null, 2),
    { headers: { "Content-Type": "application/json" } }
  );
}
