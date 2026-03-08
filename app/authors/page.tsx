"use client"

import React, { useEffect, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

interface Author {
  id:        string
  slug:      string
  name:      string
  tagline:   string | null
  photo_url: string | null
  bio:       string | null
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
  .au-kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:12px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }

  .au-grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  .au-page { min-height:100vh; background:var(--ink); }
  .au-pc   { max-width:1100px; margin:0 auto; padding:0 32px; }

  /* ── Band ── */
  .au-band {
    padding: 64px 0 52px;
    position: relative;
    overflow: hidden;
  }
  .au-band::after {
    content:'';
    position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, #C9A227 0%, rgba(201,162,39,.2) 40%, transparent 70%);
  }
  .au-band-glow {
    position:absolute; inset:0;
    background:radial-gradient(ellipse 600px 320px at 10% 80%, rgba(201,162,39,.09), transparent 55%);
    pointer-events:none;
  }

  /* ── Grid ── */
  .au-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 52px 0 90px;
  }

  /* ── Card ── */
  .au-card {
    background: rgba(255,255,255,.036);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: border-color .25s, transform .25s, box-shadow .25s;
  }
  .au-card:hover {
    border-color: rgba(201,162,39,.38);
    transform: translateY(-5px);
    box-shadow: 0 24px 64px rgba(0,0,0,.38), 0 0 0 1px rgba(201,162,39,.12);
  }

  .au-card-photo {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: rgba(201,162,39,.07);
    overflow: hidden;
    position: relative;
  }
  .au-card-photo img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .55s ease;
  }
  .au-card:hover .au-card-photo img { transform: scale(1.05); }

  .au-card-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(201,162,39,.07) 0%, rgba(201,162,39,.03) 100%);
  }
  .au-card-initials {
    font-size: 54px; font-weight: 300;
    color: rgba(201,162,39,.38);
    letter-spacing: -.02em;
  }

  .au-card-body {
    padding: 22px 24px 26px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .au-card-name {
    font-size: clamp(18px,1.8vw,22px); font-weight: 400;
    color: white; letter-spacing: -.018em; line-height: 1.2; margin: 0;
  }
  .au-card-tagline {
    font-size: 13px; color: rgba(255,255,255,.42);
    line-height: 1.55; margin: 0; flex: 1;
  }
  .au-card-cta {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; color: #C9A227;
    letter-spacing: .08em; text-transform: uppercase;
    margin-top: 10px;
    transition: gap .18s;
  }
  .au-card:hover .au-card-cta { gap: 10px; }

  /* ── Empty ── */
  .au-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 90px 0;
  }

  @media(max-width:960px) {
    .au-grid { grid-template-columns: repeat(2,1fr); }
    .au-pc   { padding: 0 20px; }
  }
  @media(max-width:560px) {
    .au-grid { grid-template-columns: 1fr; }
  }
`

export default function AuthorsDirectoryPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("authors")
      .select("id, slug, name, tagline, photo_url, bio")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setAuthors((data ?? []) as Author[])
        setLoading(false)
      })
  }, [])

  return (
    <main className={`${body.className} au-page`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="au-grain" aria-hidden />

      {/* ── Band ── */}
      <section className="au-band">
        <div className="au-band-glow" aria-hidden />
        <div className="au-pc" style={{ position: "relative", zIndex: 2 }}>
          <span className="au-kicker">Sankofa Publishers</span>
          <h1
            className={display.className}
            style={{
              fontSize: "clamp(38px,5vw,68px)",
              fontWeight: 300,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              margin: "0 0 16px",
              maxWidth: 620,
            }}
          >
            Our Authors
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.42)", margin: 0, maxWidth: 500, lineHeight: 1.7 }}>
            Published voices. Uncompromised standards. Each author selected for the
            integrity and significance of their work.
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <div className="au-pc">
        <div className="au-grid">
          {loading ? (
            <div className="au-empty">
              <p style={{ color: "rgba(255,255,255,.28)", fontSize: 15, margin: 0 }}>
                Loading authors…
              </p>
            </div>
          ) : authors.length === 0 ? (
            <div className="au-empty">
              <p style={{ color: "rgba(255,255,255,.35)", fontSize: 17, margin: "0 0 10px" }}>
                No published authors yet.
              </p>
              <p style={{ color: "rgba(255,255,255,.2)", fontSize: 13, margin: 0 }}>
                Check back soon as we announce our inaugural list.
              </p>
            </div>
          ) : (
            authors.map(author => (
              <Link key={author.id} href={`/authors/${author.slug}`} className="au-card">
                <div className="au-card-photo">
                  {author.photo_url ? (
                    <img src={author.photo_url} alt={author.name} />
                  ) : (
                    <div className="au-card-placeholder">
                      <span className={`${display.className} au-card-initials`}>
                        {author.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="au-card-body">
                  <h2 className={`${display.className} au-card-name`}>{author.name}</h2>
                  <p className="au-card-tagline">
                    {author.tagline
                      ?? (author.bio
                          ? author.bio.slice(0, 110) + (author.bio.length > 110 ? "…" : "")
                          : "")}
                  </p>
                  <span className="au-card-cta">
                    View Profile <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
