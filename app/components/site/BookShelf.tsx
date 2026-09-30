import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

export interface ShelfBook {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  genre: string | null
  buy_link: string | null
  published_at: string | null
  authors: { name: string; slug: string } | null
}

export async function getShelfBooks(): Promise<ShelfBook[]> {
  try {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await db
      .from("books")
      .select("id, title, description, cover_url, genre, buy_link, published_at, authors!books_author_id_fkey(name, slug)")
      .order("published_at", { ascending: false })
    return ((data ?? []) as unknown) as ShelfBook[]
  } catch {
    return []
  }
}

const SOON = [
  { tag: "Caribbean memoir", line: "A life told without apology." },
  { tag: "Diaspora fiction", line: "Stories carried across oceans." },
  { tag: "History and ideas", line: "The past, read with open eyes." },
]

function blurb(s: string | null, n = 190) {
  if (!s) return ""
  const t = s.replace(/\s+/g, " ").trim()
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "..." : t
}

function dateLabel(d: string | null) {
  if (!d) return ""
  const dt = new Date(d + "T00:00:00")
  const out = dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  return dt > new Date() ? "Publishes " + out : out
}

export default function BookShelf({ books, slots = 4 }: { books: ShelfBook[]; slots?: number }) {
  const soon = Math.max(0, slots - books.length)
  return (
    <>
      <style>{`
        .sk-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:28px}
        .sk-bk{display:flex;flex-direction:column;gap:14px}
        .sk-bk-cover{aspect-ratio:2/3;border-radius:6px;overflow:hidden;background:#151517;box-shadow:0 18px 40px rgba(0,0,0,.28),0 2px 6px rgba(0,0,0,.2);transition:transform .35s ease,box-shadow .35s ease}
        .sk-bk:hover .sk-bk-cover{transform:translateY(-6px);box-shadow:0 26px 50px rgba(0,0,0,.34),0 3px 8px rgba(0,0,0,.22)}
        .sk-bk-cover img{width:100%;height:100%;object-fit:cover;display:block}
        .sk-bk h3{font-family:var(--font-display),Georgia,serif;font-size:22px;line-height:1.2;margin:0}
        .sk-bk .by{font-size:14px;color:var(--sk-muted);margin:0}
        .sk-bk .by a{color:var(--sk-gold-deep);font-weight:600;text-decoration:none}
        .sk-bk .meta{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sk-gold-deep);font-weight:600}
        .sk-bk p.d{font-size:15px;line-height:1.6;color:var(--sk-muted);margin:0}
        .sk-bk-soon{aspect-ratio:2/3;border-radius:6px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px;color:#fff;
          background:radial-gradient(120% 90% at 50% 0%,#23201a 0%,#0b0b0c 70%);border:1px solid rgba(201,162,39,.55)}
        .sk-bk-soon::before{content:"";position:absolute;inset:10px;border:1px solid rgba(201,162,39,.28);border-radius:3px;pointer-events:none}
        .sk-bk-soon .mark{font-size:34px;color:var(--sk-gold);line-height:1;margin-bottom:14px}
        .sk-bk-soon .tag{letter-spacing:.22em;text-transform:uppercase;font-size:11px;color:var(--sk-gold);font-weight:600}
        .sk-bk-soon .ln{font-family:var(--font-display),Georgia,serif;font-size:19px;line-height:1.3;margin:12px 0 18px;color:#f3efe6}
        .sk-bk-soon .cs{font-size:11px;letter-spacing:.3em;text-transform:uppercase;border-top:1px solid rgba(201,162,39,.4);padding-top:12px;color:rgba(255,255,255,.7)}
        .sk-bk-link{font-weight:600;color:var(--sk-gold-deep);text-decoration:none;font-size:15px}
        .sk-bk-link:hover{text-decoration:underline}
      `}</style>
      <div className="sk-shelf">
        {books.map((b) => (
          <article className="sk-bk" key={b.id}>
            <div className="sk-bk-cover">
              {b.cover_url ? <img src={b.cover_url} alt={`Cover of ${b.title}`} loading="lazy" /> : null}
            </div>
            <div>
              {b.genre && <span className="meta">{b.genre}</span>}
              <h3>{b.title}</h3>
              {b.authors && <p className="by">by <Link href={`/authors/${b.authors.slug}`}>{b.authors.name}</Link></p>}
            </div>
            <p className="d">{blurb(b.description)}</p>
            {b.published_at && <span className="meta">{dateLabel(b.published_at)}</span>}
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {b.buy_link && <a className="sk-bk-link" href={b.buy_link} target="_blank" rel="noopener noreferrer">Buy the book</a>}
              {b.authors && <Link className="sk-bk-link" href={`/authors/${b.authors.slug}`}>About the author</Link>}
            </div>
          </article>
        ))}
        {Array.from({ length: soon }).map((_, i) => {
          const s = SOON[i % SOON.length]
          return (
            <article className="sk-bk" key={"soon" + i} aria-label="Coming soon">
              <div className="sk-bk-soon">
                <div className="mark">&#10022;</div>
                <span className="tag">{s.tag}</span>
                <div className="ln">{s.line}</div>
                <div className="cs">Coming soon</div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
