"use client"

import React from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] })

const linkStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,.72)",
  textDecoration: "none",
  fontSize: "13px",
  marginBottom: "10px",
  letterSpacing: ".01em",
  transition: "color .18s ease, padding-left .18s ease",
}

export default function Footer() {
  return (
    <footer
      className={body.className}
      style={{
        position: "relative",          /* ← allows page signature to overlap */
        zIndex: 0,                     /* ← sits below the sigImg z-index:4   */
        background: "#050505",
        color: "white",
        paddingTop: "160px",           /* ← space for the overlapping image   */
      }}
    >
      <style>{`
        .fLink:hover {
          color: #C9A227 !important;
          padding-left: 5px !important;
        }
        .fLink { transition: color .18s ease, padding-left .18s ease; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .fKicker {
          font-size: 9px;
          letter-spacing: .26em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 14px;
          background: linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ── TOP GOLD LINE ── */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, #C9A227 0%, rgba(201,162,39,.3) 50%, transparent 100%)",
        marginBottom: 0,
      }} />

      {/* ── MAIN FOOTER GRID ── */}
      <div style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "56px 32px 48px",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gap: 48,
      }}>

        {/* ── BRAND COLUMN ── */}
        <div>
          <img
            src="/images/logo_white_text.png"
            alt="Sankofa Publishers"
            style={{ width: 220, marginBottom: 20, display: "block" }}
          />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.50)", lineHeight: 1.75, maxWidth: 280, margin: "0 0 24px" }}>
            Academic publishing with cultural responsibility, global distribution, and institutional standards.
          </p>

          {/* contact emails */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "General",     href: "mailto:contact@sankofapublishers.com",     val: "contact@sankofapublishers.com" },
              { label: "Submissions", href: "mailto:submissions@sankofapublishers.com", val: "submissions@sankofapublishers.com" },
              { label: "Press",       href: "mailto:press@sankofapublishers.com",        val: "press@sankofapublishers.com" },
            ].map(({ label, href, val }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(201,162,39,.6)", minWidth: 70 }}>{label}</span>
                <a href={href} style={{ fontSize: 12, color: "rgba(255,255,255,.45)", textDecoration: "none", transition: "color .18s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A227")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}
                >{val}</a>
              </div>
            ))}
          </div>
        </div>

        {/* ── NAVIGATION COLUMN ── */}
        <div>
          <span className="fKicker">Navigation</span>
          {[
            { label: "About",                href: "/about" },
            { label: "Publishing Model",     href: "/model" },
            { label: "Services",             href: "/services" },
            { label: "Media",                href: "/media" },
            { label: "Partnerships",         href: "/partnership" },
            { label: "Board of Advisors",    href: "/board_of_advisors" },
            { label: "Submit",               href: "/submissions" },
            { label: "Support / Contribute", href: "/support" },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="fLink" style={linkStyle}>{label}</a>
          ))}
        </div>

        {/* ── POLICIES + ADDRESS COLUMN ── */}
        <div>
          <span className="fKicker">Policies</span>
          <a href="/policies" className="fLink" style={linkStyle}>Policies &amp; Compliance</a>

          <div style={{ marginTop: 32 }}>
            <span className="fKicker">Address</span>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.42)", lineHeight: 1.8, margin: 0 }}>
              Sankofa Publishers, LLC<br />
              102 Marquez Place<br />
              Santa Fe, NM 87505<br />
              USA
            </p>
          </div>

          {/* social / contact pill */}
          <div style={{ marginTop: 28 }}>
            <a
              href="/submissions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(201,162,39,.4)",
                borderRadius: 999,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 600,
                color: "#C9A227",
                textDecoration: "none",
                letterSpacing: ".04em",
                transition: "background .18s, border-color .18s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,162,39,.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A227" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,162,39,.4)" }}
            >
              Submit Your Manuscript →
            </a>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,.07)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1080,
        margin: "0 auto",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.28)", letterSpacing: ".04em" }}>
          © 2026 SANKOFA PUBLISHERS, LLC · ALL RIGHTS RESERVED
        </p>
        <p className={display.className} style={{ margin: 0, fontSize: 12, color: "rgba(201,162,39,.35)", fontWeight: 300, letterSpacing: ".06em" }}>
          Substance over spectacle.
        </p>
      </div>

    </footer>
  )
}
