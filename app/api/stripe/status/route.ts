import { NextResponse } from "next/server";
import { anonClient, internalKey, stripe, userFromRequest } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await userFromRequest(req);
    if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    const sb = anonClient();
    const key = internalKey();
    const { data } = await sb.rpc("stripe_author_for_user", { p_key: key, p_user: user.id });
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.author_id) return NextResponse.json({ status: "no_author" });
    if (!row.stripe_account_id) return NextResponse.json({ status: "not_started" });
    const acct = await stripe(`accounts/${row.stripe_account_id}`);
    const ready = !!acct.payouts_enabled && !!acct.details_submitted;
    if (ready !== !!row.stripe_ready) {
      await sb.rpc("stripe_link_author", { p_key: key, p_author: row.author_id, p_acct: row.stripe_account_id, p_ready: ready });
    }
    return NextResponse.json({ status: ready ? "ready" : "incomplete" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
