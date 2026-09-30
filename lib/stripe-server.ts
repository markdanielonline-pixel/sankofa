import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sankofapublishers.com";

export function internalKey() {
  return process.env.CRON_SECRET || "";
}

export function anonClient() {
  return createClient(SB_URL, SB_ANON, { auth: { persistSession: false } });
}

export async function userFromRequest(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const sb = anonClient();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function stripe(path: string, params?: Record<string, string>, opts?: { method?: string; idem?: string }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  const method = opts?.method || (params ? "POST" : "GET");
  const headers: Record<string, string> = { Authorization: `Bearer ${key}` };
  if (params) headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (opts?.idem) headers["Idempotency-Key"] = opts.idem;
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers,
    body: params ? new URLSearchParams(params).toString() : undefined,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe error ${res.status}`);
  return json;
}
