import { NextResponse } from "next/server";
import { stripe, SITE_URL, anonClient, internalKey, userFromRequest } from "@/lib/stripe-server";
import { storeFn } from "@/lib/store";

export const dynamic = "force-dynamic";

// Author copies: signed-in authors only, price set on the server (list price less the author-copy discount).
export async function POST(req: Request) {
  try {
    const user = await userFromRequest(req);
    if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    const b = await req.json().catch(() => ({}));

    const { data: info, error } = await anonClient().rpc("author_copy_info", { p_key: internalKey(), p_user: user.id, p_isbn: String(b.isbn || "") });
    if (error) throw new Error(error.message);
    if (!info || info.error) return NextResponse.json({ error: info?.error || "Not available" }, { status: 400 });

    const q = (await storeFn({
      action: "quote_copy", isbn: b.isbn, qty: b.qty, country: b.country, postcode: b.postcode,
      title: info.title, unit_usd: info.unit_usd, page_count: info.page_count,
    }, true)).json;
    if (q?.error) return NextResponse.json({ error: q.error }, { status: 400 });

    if (!b.servID) return NextResponse.json({ ...q, list_usd: info.list_usd, discount_pct: info.discount_pct });

    const opt = (q.options || []).find((o: any) => o.servID === Number(b.servID));
    if (!opt) return NextResponse.json({ error: "Choose a shipping option" }, { status: 400 });
    const cc = String(b.country).toUpperCase();
    const s = await stripe("checkout/sessions", {
      mode: "payment",
      customer_email: user.email || "",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(Math.round(q.unit_usd * 100)),
      "line_items[0][price_data][product_data][name]": `${q.title} (author copy)`,
      "line_items[0][price_data][product_data][description]": `Author price: ${info.discount_pct}% off list. Sankofa Publishers`,
      "line_items[0][quantity]": String(q.qty),
      "line_items[1][price_data][currency]": "usd",
      "line_items[1][price_data][unit_amount]": String(Math.round(opt.shipping_usd * 100)),
      "line_items[1][price_data][product_data][name]": `Shipping: ${opt.name}`,
      "line_items[1][quantity]": "1",
      "shipping_address_collection[allowed_countries][0]": cc,
      "phone_number_collection[enabled]": "true",
      success_url: `${SITE_URL}/books/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/portal`,
      "metadata[kind]": "book_order",
      "metadata[order_kind]": "author_copy",
      "metadata[author_id]": String(info.author_id),
      "metadata[isbn]": String(b.isbn),
      "metadata[title]": q.title,
      "metadata[qty]": String(q.qty),
      "metadata[serv_id]": String(opt.servID),
      "metadata[serv_name]": opt.name,
      "metadata[partner]": q.partner,
      "metadata[ship_usd]": String(opt.shipping_usd),
      "metadata[book_usd]": String(q.book_usd),
    });
    return NextResponse.json({ url: s.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
