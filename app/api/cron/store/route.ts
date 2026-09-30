import { NextResponse } from "next/server";
import { internalKey, stripe } from "@/lib/stripe-server";
import { fulfillSession, storeFn } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const key = internalKey();
  if (!key || (req.headers.get("authorization") || "") !== `Bearer ${key}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const out: unknown[] = [];
  try {
    const since = Math.floor(Date.now() / 1000) - 7 * 86400;
    const list = await stripe(`checkout/sessions?limit=50&created[gte]=${since}`);
    for (const s of list.data || []) {
      if (s.payment_status === "paid" && s.metadata?.kind === "book_order") out.push(await fulfillSession(s));
    }
  } catch (e) {
    out.push({ error: (e as Error).message });
  }
  const retry = await storeFn({ action: "retry" }, true);
  return NextResponse.json({ checked: out.length, results: out, retry: retry.json });
}
