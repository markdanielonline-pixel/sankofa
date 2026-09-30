import { NextResponse } from "next/server";
import { anonClient, internalKey, stripe } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Due = { payout_id: string; amount: number; stripe_account_id: string; period: string };

export async function GET(req: Request) {
  const key = internalKey();
  const auth = req.headers.get("authorization") || "";
  if (!key || auth !== `Bearer ${key}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = anonClient();
  const { data, error } = await sb.rpc("payouts_due", { p_key: key });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const due = (data || []) as Due[];
  const results: { id: string; ok: boolean; ref?: string; reason?: string }[] = [];
  for (const p of due) {
    try {
      const cents = Math.round(Number(p.amount) * 100);
      const t = await stripe(
        "transfers",
        {
          amount: String(cents),
          currency: "usd",
          destination: p.stripe_account_id,
          description: `Sankofa Publishers royalties ${p.period}`,
          "metadata[payout_id]": p.payout_id,
        },
        { idem: `sankofa-payout-${p.payout_id}` },
      );
      await sb.rpc("payout_result", { p_key: key, p_id: p.payout_id, p_ok: true, p_ref: t.id, p_reason: null });
      results.push({ id: p.payout_id, ok: true, ref: t.id });
    } catch (e) {
      const reason = (e as Error).message;
      await sb.rpc("payout_result", { p_key: key, p_id: p.payout_id, p_ok: false, p_ref: "", p_reason: reason });
      results.push({ id: p.payout_id, ok: false, reason });
    }
  }
  return NextResponse.json({ processed: results.length, results });
}
