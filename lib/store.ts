import { internalKey } from "@/lib/stripe-server";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const STORE_FN = `${SB_URL}/functions/v1/bookstore`;

export async function storeFn(body: Record<string, unknown>, withKey = false) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withKey) headers["x-sankofa-key"] = internalKey();
  const res = await fetch(STORE_FN, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

// Turns a paid Stripe Checkout Session into a print order (idempotent on the BookVault side)
export async function fulfillSession(s: any) {
  if (s?.payment_status !== "paid" || s?.metadata?.kind !== "book_order") return { skipped: true };
  const ship = s.shipping_details || s.collected_information?.shipping_details || {};
  const a = ship.address || s.customer_details?.address || {};
  const m = s.metadata || {};
  const order = {
    stripe_session: s.id,
    stripe_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id || null,
    isbn: m.isbn,
    book_title: m.title,
    qty: Number(m.qty || 1),
    customer_name: ship.name || s.customer_details?.name || "",
    customer_email: s.customer_details?.email || "",
    customer_phone: s.customer_details?.phone || "",
    address: { name: ship.name, line1: a.line1, line2: a.line2, city: a.city, state: a.state, postal_code: a.postal_code, country: a.country },
    book_usd: Number(m.book_usd || 0),
    shipping_usd: Number(m.ship_usd || 0),
    total_usd: Number(s.amount_total || 0) / 100,
    partner: m.partner,
    serv_id: m.serv_id,
    serv_name: m.serv_name,
  };
  const r = await storeFn({ action: "fulfill", order }, true);
  return r.json;
}
