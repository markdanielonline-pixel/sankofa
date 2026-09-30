import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { fulfillSession } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return NextResponse.json({ error: "bad session" }, { status: 400 });
  try {
    const s = await stripe(`checkout/sessions/${id}`);
    if (s.payment_status !== "paid") return NextResponse.json({ paid: false });
    const r = await fulfillSession(s);
    return NextResponse.json({ paid: true, order_no: r?.order_no ?? null, status: r?.status ?? "processing", email: s.customer_details?.email ?? null });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
