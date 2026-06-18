// Cloudflare Pages Function — edge runtime, not included in the Next.js build.
// Handles POST /api/meta/embedded-signup
//
// Required Cloudflare environment variables (set in the Pages dashboard):
//   META_APP_ID          — your Meta App ID (same value as NEXT_PUBLIC_META_APP_ID)
//   META_APP_SECRET      — your Meta App Secret (secret, never exposed to the client)
//   META_GRAPH_API_VERSION — optional, defaults to v23.0

interface Env {
  META_APP_SECRET?: string;
  META_APP_ID?: string;
  META_GRAPH_API_VERSION?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface RequestBody {
  code: string;
  business_id?: string;
  waba_id?: string;
  phone_number_id?: string;
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

export async function onRequestPost({
  request,
  env,
}: PagesContext): Promise<Response> {
  const appId = env.META_APP_ID;
  const appSecret = env.META_APP_SECRET;

  if (!appId || !appSecret) {
    console.error("Missing META_APP_ID or META_APP_SECRET environment variable");
    return json({ error: "server_misconfiguration" }, 500);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { code, business_id, waba_id, phone_number_id } = body;

  if (!code) {
    return json({ error: "code_required" }, 400);
  }

  const apiVersion = env.META_GRAPH_API_VERSION ?? "v23.0";

  // Exchange authorization code for a System User access token via Meta Graph API.
  // The redirect_uri is not required for the Embedded Signup code exchange.
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

  // TODO: Persist the connection to a database (e.g. Cloudflare D1, Supabase, or Neon).
  // Schema to implement:
  //   clinic_name        TEXT       — collect in a future onboarding step
  //   contact_name       TEXT       — collect in a future onboarding step
  //   contact_phone      TEXT       — collect in a future onboarding step
  //   business_id        TEXT       — from Meta Embedded Signup event
  //   waba_id            TEXT       — from Meta Embedded Signup event
  //   phone_number_id    TEXT       — from Meta Embedded Signup event
  //   access_token       TEXT       — store encrypted or in a secret vault
  //   status             TEXT       — "pending_configuration" at creation
  //   created_at         TIMESTAMP  — new Date().toISOString()
  console.log("WhatsApp Business connection authorized:", {
    business_id,
    waba_id,
    phone_number_id,
    has_token: true,
  });

  return json({ ok: true });
}
