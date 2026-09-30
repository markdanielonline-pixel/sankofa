import { NextResponse } from "next/server";
import { stripe, SITE_URL, anonClient } from "@/lib/stripe-server";
import { storeFn } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const q = (await storeFn({ action: "quote", isbn: b.isbn, qty: b.qty, country: b.country, postcode: b.postcode })).json;
    if (q?.error) return NextResponse.json({ error: q.error }, { status: 400 });
    const opt = (q.options || []).find((o: any) => o.servID === Number(b.servID));
    if (!opt) return NextResponse.json({ error: "Choose a shipping option" }, { status: 400 });

    const { data: book } = await anonClient().from("books").select("cover_url, title").eq("isbn", b.isbn).maybeSingle();
    const cc = String(b.country).toUpperCase();
    const slug = String(q.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const params: Record<string, string> = {
      mode: "payment",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(Math.round(q.unit_usd * 100)),
      "line_items[0][price_data][product_data][name]": q.title,
      "line_items[0][price_data][product_data][description]": "Paperback, printed on demand. Sankofa Publishers",
      "line_items[0][quantity]": String(q.qty),
      "line_items[1][price_data][currency]": "usd",
      "line_items[1][price_data][unit_amount]": String(Math.round(opt.shipping_usd * 100)),
      "line_items[1][price_data][product_data][name]": `Shipping: ${opt.name}`,
      "line_items[1][quantity]": "1",
      "shipping_address_collection[allowed_countries][0]": cc,
      "phone_number_collection[enabled]": "true",
      success_url: `${SITE_URL}/books/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/books/${slug}`,
      "metadata[kind]": "book_order",
      "metadata[isbn]": String(b.isbn),
      "metadata[title]": q.title,
      "metadata[qty]": String(q.qty),
      "metadata[serv_id]": String(opt.servID),
      "metadata[serv_name]": opt.name,
      "metadata[partner]": q.partner,
      "metadata[ship_usd]": String(opt.shipping_usd),
      "metadata[book_usd]": String(q.book_usd),
    };
    if (book?.cover_url) params["line_items[0][price_data][product_data][images][0]"] = book.cover_url;
    const s = await stripe("checkout/sessions", params);
    return NextResponse.json({ url: s.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
