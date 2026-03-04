"use client"

import { useState } from "react"

type MenuKey = "about" | "model" | "services" | "media" | null

export default function Header() {
  const [open, setOpen] = useState<MenuKey>(null)

  const linkStyle: React.CSSProperties = {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    letterSpacing: "1px",
    cursor: "pointer",
    padding: "10px 0",
    display: "inline-block"
  }

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",              // attaches directly under the trigger
    left: 0,
    background: "#111",
    padding: "12px",
    border: "1px solid rgba(212,175,55,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "220px",
    marginTop: 0,             // no gap
    zIndex: 999
  }

  const dropdownLinkStyle: React.CSSProperties = {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    opacity: 0.95
  }

  const Menu = ({
    id,
    label,
    items
  }: {
    id: Exclude<MenuKey, null>
    label: string
    items: { href: string; text: string }[]
  }) => (
    <div
      onMouseEnter={() => setOpen(id)}
      onMouseLeave={() => setOpen(null)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <span style={linkStyle}>{label}</span>

      {open === id && (
        <div style={dropdownStyle}>
          {items.map((it) => (
            <a key={it.href} href={it.href} style={dropdownLinkStyle}>
              {it.text}
            </a>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.9)",
        borderBottom: "1px solid rgba(212,175,55,0.4)"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <a href="/" style={{ display: "inline-block" }}>
          <img src="/images/logo.png" style={{ width: "240px", height: "auto" }} />
        </a>

        <nav
          style={{
            display: "flex",
            gap: "22px",
            alignItems: "center"
          }}
        >
          <a href="/" style={linkStyle}>Home</a>

          <Menu
            id="about"
            label="About"
            items={[
              { href: "/about", text: "About Sankofa" },
              { href: "/board_of_advisors", text: "Advisory Board" },
              { href: "/partnership", text: "Partnerships" },
              { href: "/governance", text: "Governance" }
            ]}
          />

          <Menu
            id="model"
            label="Model"
            items={[
              { href: "/model", text: "Our Model" }
            ]}
          />

          <Menu
            id="services"
            label="Services"
            items={[
              { href: "/services", text: "Professional Services" }
            ]}
          />

          <Menu
            id="media"
            label="Media"
            items={[
              { href: "/media", text: "Media & Press" }
            ]}
          />

          <a href="/Q&A" style={linkStyle}>Q&A</a>
          <a href="/contact" style={linkStyle}>Contact</a>

          <a
            href="/submissions"
            style={{
              padding: "8px 16px",
              border: "1px solid #d4af37",
              color: "#d4af37",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Submit
          </a>
        </nav>
      </div>
    </header>
  )
}