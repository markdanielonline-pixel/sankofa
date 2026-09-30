import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Section, Cta, JsonLd } from "../../components/site/Ui"
import { getShelfBooks, bookSlug } from "../../components/site/BookShelf"
import { SITE } from "../../../lib/content"
import BuyPanel from "../../components/site/BuyPanel"

export const revalidate = 300

async function find(slug: string) {
  const books = await getShelfBooks()
  return books.find((b) => bookSlug(b.title) === slug) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const b = await find(slug)
  if (!b) return { title: "Book not found | Sankofa Publishers" }
  const desc = (b.description || "").replace(/\s+/g, " ").slice(0, 160)
  return {
    title: `${b.title} by ${b.authors?.name ?? "Sankofa"} | Sankofa Publishers`,
    description: desc,
    alternates: { canonical: `/books/${slug}` },
    openGraph: { title: b.title, description: desc, images: b.cover_url ? [{ url: b.cover_url }] : [], type: "book" },
  }
}

function fmt(d: string | null) {
  if (!d) return ""
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const b = await find(slug)
  if (!b) notFound()
  const paras = (b.description || "").split(/\n\s*\n/).filter(Boolean)
  const upcoming = b.published_at ? new Date(b.published_at + "T00:00:00") > new Date() : false
  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: b.title,
    author: b.authors ? { "@type": "Person", name: b.authors.name } : undefined,
    publisher: { "@type": "Organization", name: SITE.name },
    isbn: b.isbn || undefined,
    numberOfPages: b.page_count || undefined,
    bookFormat: "https://schema.org/Paperback",
    inLanguage: "en",
    image: b.cover_url || undefined,
    datePublished: b.published_at || undefined,
    description: b.description || undefined,
    offers: b.price_usd ? { "@type": "Offer", price: b.price_usd, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE.url}/books/${slug}` } : undefined,
  }
  return (
    <div className="sk-body">
      <JsonLd data={ld} />
      <style>{`
        .bk-hero{background:radial-gradient(120% 100% at 50% 0%,#23201a 0%,#0b0b0c 75%);color:#fff;padding:56px 0 72px}
        .bk-grid{display:grid;grid-template-columns:minmax(220px,340px) 1fr;gap:56px;align-items:start}
        .bk-cover{border-radius:6px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.55),0 4px 10px rgba(0,0,0,.4);background:#151517;aspect-ratio:2/3}
        .bk-cover img{width:100%;height:100%;object-fit:cover;display:block}
        .bk-crumb{font-size:13px;letter-spacing:.06em;margin-bottom:26px}
        .bk-crumb a{color:var(--sk-gold);text-decoration:none}
        .bk-title{font-family:var(--font-display),Georgia,serif;font-size:clamp(34px,5vw,56px);line-height:1.08;margin:0 0 10px}
        .bk-sub{font-size:19px;line-height:1.5;color:rgba(255,255,255,.78);margin:0 0 18px;max-width:38em}
        .bk-by{font-size:17px;margin:0 0 26px;color:rgba(255,255,255,.85)}
        .bk-by a{color:var(--sk-gold);font-weight:600;text-decoration:none}
        .bk-price{display:flex;gap:22px;align-items:baseline;flex-wrap:wrap;margin:0 0 6px}
        .bk-price b{font-size:34px;font-family:var(--font-display),Georgia,serif}
        .bk-price span{color:rgba(255,255,255,.72);font-size:17px}
        .bk-fine{font-size:13px;color:rgba(255,255,255,.6);margin:0 0 24px;max-width:36em;line-height:1.5}
        .bk-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--sk-line);border:1px solid var(--sk-line);border-radius:8px;overflow:hidden;margin-top:8px}
        .bk-facts div{background:#fff;padding:16px 18px}
        .bk-facts small{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--sk-gold-deep);font-weight:600;margin-bottom:6px}
        .bk-facts span{font-size:16px;color:var(--sk-ink)}
        @media(max-width:760px){.bk-grid{grid-template-columns:1fr;gap:32px}.bk-cover{max-width:260px;margin:0 auto}}
      `}</style>

      <section className="bk-hero">
        <div className="sk-wrap">
          <div className="bk-crumb"><Link href="/books">&larr; All Sankofa books</Link></div>
          <div className="bk-grid">
            <div className="bk-cover">{b.cover_url ? <img src={b.cover_url} alt={`Cover of ${b.title}`} /> : null}</div>
            <div>
              {b.genre && <span className="sk-kicker">{b.genre}</span>}
              <h1 className="bk-title">{b.title}</h1>
              {b.subtitle && <p className="bk-sub">{b.subtitle}</p>}
              {b.authors && <p className="bk-by">by <Link href={`/authors/${b.authors.slug}`}>{b.authors.name}</Link></p>}
              {b.price_usd ? (
                <div className="bk-price">
                  <b>${Number(b.price_usd).toFixed(2)} USD</b>
                  {b.price_gbp ? <span>&pound;{Number(b.price_gbp).toFixed(2)} GBP</span> : null}
                </div>
              ) : null}
              <p className="bk-fine">{b.format || "Paperback"}. Prices shown in US dollars and British pounds. You are charged in US dollars and your bank converts to your local currency.</p>
              <div className="sk-btnrow" style={{ alignItems: "flex-start" }}>
                {b.isbn && b.price_usd ? <BuyPanel isbn={b.isbn} unit={Number(b.price_usd)} /> : null}
                {b.authors && <Link className="sk-btn ghost" href={`/authors/${b.authors.slug}`}>About the author</Link>}
              </div>
              <p className="bk-fine" style={{ marginTop: 14 }}>Printed on demand and shipped worldwide. Secure checkout by Stripe. Shipping is charged at cost and shown before you pay.</p>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper" narrow>
        <span className="sk-kicker">About the book</span>
        {paras.map((p, i) => (
          <p key={i} className="sk-p" style={i === 0 ? { fontSize: 21, color: "var(--sk-ink)", fontWeight: 600, lineHeight: 1.5 } : undefined}>{p}</p>
        ))}
        <div className="bk-facts">
          {b.format && <div><small>Format</small><span>{b.format}</span></div>}
          {b.page_count ? <div><small>Pages</small><span>{b.page_count}</span></div> : null}
          {b.trim_size && <div><small>Trim size</small><span>{b.trim_size}</span></div>}
          {b.isbn && <div><small>ISBN</small><span>{b.isbn}</span></div>}
          {b.published_at && <div><small>{upcoming ? "Publishes" : "Published"}</small><span>{fmt(b.published_at)}</span></div>}
          <div><small>Publisher</small><span>Sankofa Publishers</span></div>
        </div>
      </Section>

      <Cta
        title="Have a book that belongs on this shelf?"
        body="Submission is free and needs no payment details. If we accept your book, you pay nothing to publish it."
        secondary={{ href: "/books", label: "Browse all books" }}
      />
    </div>
  )
}
