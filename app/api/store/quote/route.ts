import { NextResponse } from "next/server";
import { storeFn } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const r = await storeFn({ action: "quote", isbn: b.isbn, qty: b.qty, country: b.country, postcode: b.postcode });
  return NextResponse.json(r.json, { status: r.ok ? 200 : 502 });
}
