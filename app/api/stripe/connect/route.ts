import { NextResponse } from "next/server";
import { anonClient, internalKey, SITE_URL, stripe, userFromRequest } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await userFromRequest(req);
    if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    const sb = anonClient();
    const key = internalKey();
    const { data: author, error } = await sb.rpc("stripe_author_for_user", { p_key: key, p_user: user.id });
    if (error) throw new Error(error.message);
    const row = Array.isArray(author) ? author[0] : author;
    if (!row?.author_id) return NextResponse.json({ error: "No author record found for this account." }, { status: 404 });

    let acct: string | null = row.stripe_account_id || null;
    if (!acct) {
      const created = await stripe("accounts", {
        type: "express",
        email: user.email || "",
        "capabilities[transfers][requested]": "true",
        business_type: "individual",
        "metadata[author_id]": String(row.author_id),
      });
      acct = created.id as string;
      const { error: e2 } = await sb.rpc("stripe_link_author", { p_key: key, p_author: row.author_id, p_acct: acct, p_ready: false });
      if (e2) throw new Error(e2.message);
    }
    const link = await stripe("account_links", {
      account: acct!,
      type: "account_onboarding",
      return_url: `${SITE_URL}/portal?payments=done`,
      refresh_url: `${SITE_URL}/portal?payments=retry`,
    });
    return NextResponse.json({ url: link.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
