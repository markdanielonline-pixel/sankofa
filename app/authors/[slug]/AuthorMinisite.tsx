"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import type { AuthorData, BookData } from "./page"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ── Reveal hook ── */
function useReveal(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties
}) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .72s ease ${delay}s, transform .72s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Social icon SVGs ── */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  website: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

const css = `
  :root { --ink:#0B0B0C; --gold:#C9A227; }
  *, *::before, *::after { box-sizing:border-box; }
  html, body { margin:0; padding:0; background:var(--ink); color:white; overflow-x:hidden; }
  a { color:inherit; text-decoration:none; }

  @keyframes shimmer {
    0%  { background-position:-200% center; }
    100%{ background-position: 200% center; }
  }
  .ms-kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:12px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }

  .ms-grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  .ms-page { min-height:100vh; background:var(--ink); }
  .ms-pc   { max-width:1100px; margin:0 auto; padding:0 32px; }

  /* ══════════ HERO ══════════ */
  .ms-hero {
    min-height: 480px;
    padding: 80px 0 72px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .ms-hero-glow {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 700px 400px at 80% 50%, rgba(201,162,39,.07), transparent 55%),
      radial-gradient(ellipse 500px 300px at 10% 60%, rgba(201,162,39,.05), transparent 55%);
    pointer-events: none;
  }
  .ms-hero-line {
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, #C9A227 30%, rgba(201,162,39,.3) 60%, transparent 100%);
  }
  .ms-hero-inner {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 64px;
    align-items: center;
    width: 100%;
  }

  /* avatar */
  .ms-avatar {
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(201,162,39,.10);
    border: 2px solid rgba(201,162,39,.35);
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    box-shadow: 0 0 0 8px rgba(201,162,39,.06), 0 24px 64px rgba(0,0,0,.45);
  }
  .ms-avatar img { width:100%; height:100%; object-fit:cover; }
  .ms-avatar-init {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 64px; font-weight: 300; color: rgba(201,162,39,.5);
    letter-spacing: -.02em;
  }

  /* back link */
  .ms-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(255,255,255,.32);
    margin-bottom: 24px;
    transition: color .18s;
  }
  .ms-back:hover { color: #C9A227; }

  /* hero name */
  .ms-name {
    font-size: clamp(40px, 5.5vw, 76px);
    font-weight: 300;
    color: white;
    letter-spacing: -0.028em;
    line-height: 1.0;
    margin: 0 0 16px;
  }
  .ms-tagline {
    font-size: clamp(15px, 1.6vw, 18px);
    color: rgba(255,255,255,.50);
    line-height: 1.6;
    margin: 0 0 32px;
    max-width: 520px;
  }

  /* social links */
  .ms-socials {
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .ms-social-link {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.12);
    color: rgba(255,255,255,.55);
    font-size: 12px; font-weight: 500;
    transition: border-color .2s, color .2s, background .2s;
  }
  .ms-social-link:hover {
    border-color: rgba(201,162,39,.5);
    color: #C9A227;
    background: rgba(201,162,39,.06);
  }

  /* ══════════ BIO ══════════ */
  .ms-bio-sec {
    padding: 72px 0;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .ms-bio-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 64px;
    align-items: start;
  }
  .ms-bio-text {
    font-size: clamp(15px,1.4vw,17px);
    color: rgba(255,255,255,.62);
    line-height: 1.82;
    margin: 0;
    white-space: pre-line;
  }
  .ms-divider {
    height: 1px;
    background: rgba(255,255,255,.06);
  }

  /* ══════════ BOOKS ══════════ */
  .ms-books-sec {
    padding: 72px 0;
  }
  .ms-books-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 36px;
  }
  .ms-book-card {
    background: rgba(255,255,255,.036);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border-color .22s, transform .22s;
  }
  .ms-book-card:hover {
    border-color: rgba(201,162,39,.3);
    transform: translateY(-3px);
  }
  .ms-book-cover {
    width: 100%;
    aspect-ratio: 2 / 3;
    background: rgba(201,162,39,.07);
    overflow: hidden;
    position: relative;
  }
  .ms-book-cover img { width:100%; height:100%; object-fit:cover; }
  .ms-book-cover-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px;
  }
  .ms-book-body {
    padding: 18px 20px 22px;
    flex: 1; display: flex; flex-direction: column; gap: 8px;
  }
  .ms-book-genre {
    font-size: 10px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(201,162,39,.7);
  }
  .ms-book-title {
    font-size: clamp(16px,1.5vw,19px); font-weight: 400;
    color: white; letter-spacing: -.014em; line-height: 1.25; margin: 0;
  }
  .ms-book-desc {
    font-size: 13px; color: rgba(255,255,255,.38);
    line-height: 1.6; margin: 0; flex: 1;
  }
  .ms-book-buy {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 10px;
    padding: 9px 18px; border-radius: 999px;
    background: #C9A227; color: #140F05;
    font-size: 12px; font-weight: 700; letter-spacing: .04em;
    text-decoration: none;
    transition: background .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 16px rgba(201,162,39,.28);
    align-self: flex-start;
  }
  .ms-book-buy:hover {
    background: #d4aa2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201,162,39,.40);
  }
  .ms-book-no-buy {
    font-size: 11px; color: rgba(255,255,255,.22);
    margin-top: 10px; letter-spacing: .04em;
  }

  /* ══════════ CLOSING ══════════ */
  .ms-closing {
    padding: 80px 0 100px;
    background: rgba(201,162,39,.03);
    border-top: 1px solid rgba(201,162,39,.12);
  }

  /* ══════════ RESPONSIVE ══════════ */
  @media(max-width:900px) {
    .ms-hero-inner { grid-template-columns: 1fr; gap: 36px; }
    .ms-avatar { width: 140px; height: 140px; }
    .ms-bio-grid { grid-template-columns: 1fr; gap: 32px; }
    .ms-books-grid { grid-template-columns: repeat(2,1fr); }
    .ms-pc { padding: 0 20px; }
  }
  @media(max-width:560px) {
    .ms-books-grid { grid-template-columns: 1fr; }
    .ms-hero { padding: 60px 0 52px; }
  }
`

interface Props {
  author: AuthorData
  books:  BookData[]
}

const SOCIAL_LABELS: Record<string, string> = {
  twitter:   "Twitter / X",
  instagram: "Instagram",
  linkedin:  "LinkedIn",
  website:   "Website",
}

export default function AuthorMinisite({ author, books }: Props) {
  const socials = Object.entries(author.social_links ?? {}).filter(([, v]) => v)

  return (
    <main className={`${body.className} ms-page`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ms-grain" aria-hidden />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="ms-hero">
        <div className="ms-hero-glow" aria-hidden />
        <div className="ms-hero-line" aria-hidden />

        <div className="ms-pc" style={{ width: "100%" }}>
          <div className="ms-hero-inner">
            {/* Left */}
            <div>
              <Link href="/authors" className="ms-back">
                ← All Authors
              </Link>
              <span className="ms-kicker">Sankofa Publishers · Author</span>
              <h1 className={`${display.className} ms-name`}>{author.name}</h1>
              {author.tagline && (
                <p className="ms-tagline">{author.tagline}</p>
              )}
              {socials.length > 0 && (
                <div className="ms-socials">
                  {socials.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-social-link"
                      aria-label={SOCIAL_LABELS[key] ?? key}
                    >
                      {SOCIAL_ICONS[key] ?? null}
                      {SOCIAL_LABELS[key] ?? key}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right — avatar */}
            <div className="ms-avatar">
              {author.photo_url ? (
                <img src={author.photo_url} alt={author.name} />
              ) : (
                <div className={`${display.className} ms-avatar-init`}>
                  {author.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BIO
      ══════════════════════════════════════════ */}
      {author.bio && (
        <section className="ms-bio-sec">
          <div className="ms-pc">
            <div className="ms-bio-grid">
              <Reveal>
                <span className="ms-kicker">About</span>
                <h2
                  className={display.className}
                  style={{
                    fontSize: "clamp(26px,2.6vw,38px)",
                    fontWeight: 300,
                    color: "white",
                    letterSpacing: "-0.022em",
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {author.name}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="ms-bio-text">{author.bio}</p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          BOOKS
      ══════════════════════════════════════════ */}
      {books.length > 0 && (
        <>
          <div className="ms-divider" />
          <section className="ms-books-sec">
            <div className="ms-pc">
              <Reveal>
                <span className="ms-kicker">Published Works</span>
                <h2
                  className={display.className}
                  style={{
                    fontSize: "clamp(28px,3vw,44px)",
                    fontWeight: 300,
                    color: "white",
                    letterSpacing: "-0.022em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  Books
                </h2>
              </Reveal>

              <div className="ms-books-grid">
                {books.map((book, i) => (
                  <Reveal key={book.id} delay={i * 0.08}>
                    <div className="ms-book-card">
                      {/* Cover */}
                      <div className="ms-book-cover">
                        {book.cover_url ? (
                          <img src={book.cover_url} alt={book.title} />
                        ) : (
                          <div className="ms-book-cover-placeholder">
                            <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                              <rect x="1" y="1" width="30" height="38" rx="3" stroke="rgba(201,162,39,.25)" strokeWidth="1.5"/>
                              <line x1="7" y1="12" x2="25" y2="12" stroke="rgba(201,162,39,.2)" strokeWidth="1.2" strokeLinecap="round"/>
                              <line x1="7" y1="18" x2="25" y2="18" stroke="rgba(201,162,39,.15)" strokeWidth="1.2" strokeLinecap="round"/>
                              <line x1="7" y1="24" x2="18" y2="24" stroke="rgba(201,162,39,.15)" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="ms-book-body">
                        {book.genre && (
                          <span className="ms-book-genre">{book.genre}</span>
                        )}
                        <h3 className={`${display.className} ms-book-title`}>{book.title}</h3>
                        {book.description && (
                          <p className="ms-book-desc">
                            {book.description.slice(0, 140)}
                            {book.description.length > 140 ? "…" : ""}
                          </p>
                        )}
                        {book.buy_link ? (
                          <a
                            href={book.buy_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ms-book-buy"
                          >
                            Get the Book →
                          </a>
                        ) : (
                          <p className="ms-book-no-buy">Coming soon</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════
          CLOSING CTA
      ══════════════════════════════════════════ */}
      <section className="ms-closing">
        <div className="ms-pc">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
              <span className="ms-kicker">Sankofa Publishers</span>
              <h2
                className={display.className}
                style={{
                  fontSize: "clamp(24px,2.8vw,40px)",
                  fontWeight: 300,
                  color: "white",
                  letterSpacing: "-0.022em",
                  lineHeight: 1.15,
                  margin: "0 0 16px",
                }}
              >
                Publish with integrity.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.40)", margin: "0 0 28px", lineHeight: 1.7 }}>
                Sankofa Publishers supports authors whose work is built to endure.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/submissions"
                  style={{
                    padding: "11px 24px", borderRadius: 999,
                    background: "#C9A227", color: "#140F05",
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                    transition: "background .18s, transform .18s",
                  }}
                >
                  Submit Your Manuscript
                </Link>
                <Link
                  href="/authors"
                  style={{
                    padding: "11px 22px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)",
                    fontSize: 13, fontWeight: 500, textDecoration: "none",
                    transition: "border-color .18s, color .18s",
                  }}
                >
                  All Authors
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
