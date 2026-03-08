"use client"

import React, { useEffect, useState, useRef } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   NAV STRUCTURE
═══════════════════════════════════════════════════════════ */
const NAV = [
  {
    label: "About",
    href:  "/about",
    children: [],
  },
  {
    label: "Publish",
    href:  "/submissions",
    children: [
      { label: "Submit a Manuscript",     href: "/submissions",  desc: "Two pathways. One standard." },
      { label: "Our Publishing Model",    href: "/model",        desc: "Free. Author-owned. No compromise." },
      { label: "Professional Services",   href: "/services",     desc: "Editorial, design, and production." },
    ],
  },
  {
    label: "Governance",
    href:  "/governance",
    children: [
      { label: "Governance & Compliance", href: "/governance",        desc: "How we hold ourselves accountable." },
      { label: "Board of Advisors",       href: "/board_of_advisors", desc: "The council that guides us." },
      { label: "Policies",               href: "/policies",           desc: "Clear terms. No hidden conditions." },
    ],
  },
  {
    label: "Connect",
    href:  "/contact",
    children: [
      { label: "Media & Press",   href: "/media",        desc: "Interviews, press kits, appearances." },
      { label: "Partnerships",    href: "/partnership",  desc: "Build something that lasts." },
      { label: "Q&A",             href: "/qa",           desc: "Honest answers to hard questions." },
      { label: "Contact",         href: "/contact",      desc: "We respond to every inquiry." },
    ],
  },
  {
    label: "Support",
    href:  "/support",
    children: [],
  },
]

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const css = `
  :root {
    --ink:#0B0B0C; --paper:#F6F3EE; --gold:#C9A227;
    --header-h: 72px;
  }

  /* ── base reset ── */
  *, *::before, *::after { box-sizing:border-box; }

  /* ── scroll lock ── */
  body.nav-open { overflow:hidden; }

  /* ══════════════════════════════════════════
     HEADER SHELL
  ══════════════════════════════════════════ */
  .spHeader {
    position: fixed; top:0; left:0; right:0; z-index: 1000;
    height: var(--header-h);
    transition: background .35s ease, box-shadow .35s ease, height .35s ease;
  }

  /* scrolled state */
  .spHeader.scrolled {
    background: rgba(11,11,12,.96);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    box-shadow: 0 1px 0 rgba(201,162,39,.18), 0 8px 40px rgba(0,0,0,.35);
  }

  /* top of page — fully transparent */
  .spHeader.top {
    background: transparent;
    box-shadow: none;
  }

  /* ── inner layout ── */
  .spInner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 32px;
    height: 100%;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 2;
  }

  /* ── gold line at very top ── */
  .spTopLine {
    position: absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent 0%, #C9A227 30%, #f5d878 50%, #C9A227 70%, transparent 100%);
    opacity: 0;
    transition: opacity .4s ease;
  }
  .spHeader.scrolled .spTopLine { opacity: 1; }

  /* ══════════════════════════════════════════
     LOGO
  ══════════════════════════════════════════ */
  .spLogo {
    display: flex; align-items: center; gap: 11px;
    text-decoration: none; flex-shrink: 0;
    transition: opacity .2s;
  }
  .spLogo:hover { opacity: .85; }

  .spLogoImg {
    height: 38px; width: auto;
    transition: height .35s ease;
  }
  .spHeader.scrolled .spLogoImg { height: 32px; }

  .spLogoText {
    display: flex; flex-direction: column; gap: 1px;
  }
  .spLogoName {
    font-size: 15px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: white; line-height: 1;
    transition: font-size .35s ease;
  }
  .spHeader.scrolled .spLogoName { font-size: 13px; }

  .spLogoSub {
    font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
    color: rgba(201,162,39,.75); line-height: 1; font-weight: 500;
  }

  /* ══════════════════════════════════════════
     DESKTOP NAV
  ══════════════════════════════════════════ */
  .spNav {
    display: flex; align-items: center; gap: 4px;
    list-style: none; margin: 0; padding: 0;
  }

  /* nav item wrapper */
  .spNavItem { position: relative; }

  /* nav trigger button */
  .spNavTrigger {
    display: flex; align-items: center; gap: 5px;
    padding: 8px 14px; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; font-weight: 500; letter-spacing: .03em;
    color: rgba(255,255,255,.72);
    font-family: inherit;
    transition: color .18s, background .18s;
    text-decoration: none;
    white-space: nowrap;
  }
  .spNavTrigger:hover,
  .spNavTrigger.active { color: white; background: rgba(255,255,255,.07); }
  .spNavTrigger.current { color: #C9A227; }

  /* chevron */
  .spChevron {
    width: 10px; height: 10px; flex-shrink: 0;
    transition: transform .25s ease;
    opacity: .55;
  }
  .spNavItem.open .spChevron { transform: rotate(180deg); opacity: 1; }

  /* ── AUTHOR LOGIN pill ── */
  .spLoginBtn {
    margin-left: 4px;
    padding: 9px 18px !important;
    background: transparent !important;
    border: 1px solid rgba(255,255,255,.18) !important;
    border-radius: 999px !important;
    color: rgba(255,255,255,.72) !important;
    font-weight: 500 !important;
    transition: background .2s, border-color .2s, color .2s !important;
  }
  .spLoginBtn:hover {
    background: rgba(255,255,255,.08) !important;
    border-color: rgba(255,255,255,.38) !important;
    color: white !important;
  }

  /* ── SUPPORT special pill ── */
  .spSupportBtn {
    margin-left: 8px;
    padding: 9px 20px !important;
    background: rgba(201,162,39,.12) !important;
    border: 1px solid rgba(201,162,39,.35) !important;
    border-radius: 999px !important;
    color: #C9A227 !important;
    font-weight: 600 !important;
    transition: background .2s, border-color .2s, transform .18s, box-shadow .18s !important;
  }
  .spSupportBtn:hover {
    background: rgba(201,162,39,.22) !important;
    border-color: rgba(201,162,39,.65) !important;
    color: #f5d878 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201,162,39,.22);
  }

  /* ── SUBMIT CTA ── */
  .spCta {
    margin-left: 6px;
    padding: 9px 22px;
    background: #C9A227;
    color: #140F05 !important;
    border-radius: 999px;
    font-size: 13px; font-weight: 700;
    letter-spacing: .02em;
    text-decoration: none;
    border: none; cursor: pointer;
    transition: transform .18s, box-shadow .18s, background .18s;
    box-shadow: 0 4px 18px rgba(201,162,39,.30);
    white-space: nowrap;
    font-family: inherit;
  }
  .spCta:hover {
    background: #d4aa2e;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(201,162,39,.42);
  }

  /* ══════════════════════════════════════════
     DROPDOWN
  ══════════════════════════════════════════ */
  .spDropdown {
    position: absolute; top: calc(100% + 10px); left: 50%;
    transform: translateX(-50%) translateY(6px);
    min-width: 260px;
    background: rgba(14,13,12,.97);
    border: 1px solid rgba(201,162,39,.18);
    border-radius: 16px;
    padding: 8px;
    opacity: 0; pointer-events: none;
    transition: opacity .22s ease, transform .22s ease;
    box-shadow: 0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(201,162,39,.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .spNavItem.open .spDropdown {
    opacity: 1; pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  /* dropdown item */
  .spDropItem {
    display: flex; flex-direction: column; gap: 3px;
    padding: 12px 14px; border-radius: 10px;
    text-decoration: none;
    transition: background .18s;
    cursor: pointer;
  }
  .spDropItem:hover { background: rgba(255,255,255,.06); }

  .spDropLabel {
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,.88);
    letter-spacing: .02em;
    transition: color .18s;
  }
  .spDropItem:hover .spDropLabel { color: #C9A227; }

  .spDropDesc {
    font-size: 11px; color: rgba(255,255,255,.35);
    line-height: 1.4; letter-spacing: .01em;
  }

  /* dropdown divider */
  .spDropDivider {
    height: 1px; background: rgba(255,255,255,.07);
    margin: 4px 6px;
  }

  /* ══════════════════════════════════════════
     MOBILE HAMBURGER
  ══════════════════════════════════════════ */
  .spBurger {
    display: none;
    flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer;
    padding: 8px; border-radius: 8px;
    transition: background .18s;
  }
  .spBurger:hover { background: rgba(255,255,255,.08); }
  .spBurger span {
    display: block; width: 22px; height: 1.5px;
    background: white; border-radius: 2px;
    transition: transform .3s ease, opacity .3s ease, width .3s ease;
    transform-origin: center;
  }
  /* open state */
  .spBurger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .spBurger.open span:nth-child(2) { opacity: 0; width: 12px; }
  .spBurger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ══════════════════════════════════════════
     MOBILE DRAWER
  ══════════════════════════════════════════ */
  .spDrawer {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(11,11,12,.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    display: flex; flex-direction: column;
    padding: 0;
    transform: translateX(100%);
    transition: transform .38s cubic-bezier(.4,0,.2,1);
    overflow-y: auto;
  }
  .spDrawer.open { transform: translateX(0); }

  .spDrawerHead {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,.07);
    flex-shrink: 0;
  }

  .spDrawerClose {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,.07); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 18px; transition: background .18s;
  }
  .spDrawerClose:hover { background: rgba(255,255,255,.14); }

  .spDrawerNav {
    flex: 1; padding: 16px 24px 32px;
    display: flex; flex-direction: column; gap: 4px;
  }

  .spDrawerSection { margin-bottom: 8px; }

  .spDrawerGroup {
    font-size: 9px; font-weight: 700; letter-spacing: .28em;
    text-transform: uppercase; color: rgba(201,162,39,.55);
    padding: 14px 8px 8px; display: block;
  }

  .spDrawerLink {
    display: flex; flex-direction: column; gap: 3px;
    padding: 13px 12px; border-radius: 12px;
    text-decoration: none;
    transition: background .18s;
  }
  .spDrawerLink:hover { background: rgba(255,255,255,.05); }
  .spDrawerLink span:first-child {
    font-size: 15px; font-weight: 600;
    color: rgba(255,255,255,.85); letter-spacing: .01em;
  }
  .spDrawerLink span:last-child {
    font-size: 12px; color: rgba(255,255,255,.32); line-height: 1.4;
  }

  .spDrawerCtas {
    padding: 20px 24px 36px;
    display: flex; flex-direction: column; gap: 12px;
    border-top: 1px solid rgba(255,255,255,.07);
    flex-shrink: 0;
  }

  .spDrawerCtaP {
    display: flex; align-items: center; justify-content: center;
    padding: 15px; border-radius: 999px;
    background: #C9A227; color: #140F05;
    font-size: 14px; font-weight: 700; text-decoration: none;
    letter-spacing: .02em;
    transition: background .18s, transform .18s;
  }
  .spDrawerCtaP:hover { background: #d4aa2e; transform: scale(1.01); }

  .spDrawerCtaG {
    display: flex; align-items: center; justify-content: center;
    padding: 15px; border-radius: 999px;
    border: 1px solid rgba(201,162,39,.4);
    color: #C9A227; background: transparent;
    font-size: 14px; font-weight: 600; text-decoration: none;
    transition: background .18s, border-color .18s;
  }
  .spDrawerCtaG:hover { background: rgba(201,162,39,.08); border-color: rgba(201,162,39,.65); }

  /* ══════════════════════════════════════════
     ACTIVE INDICATOR
  ══════════════════════════════════════════ */
  .spNavTrigger.current::after {
    content: '';
    position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%;
    background: #C9A227;
  }

  /* ══════════════════════════════════════════
     KEYBOARD / FOCUS
  ══════════════════════════════════════════ */
  .spNavTrigger:focus-visible,
  .spDropItem:focus-visible,
  .spCta:focus-visible {
    outline: 2px solid #C9A227;
    outline-offset: 2px;
  }

  /* ══════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════ */
  @media(max-width:960px) {
    .spNav, .spCta { display:none !important; }
    .spBurger { display:flex; }
  }
  @media(min-width:961px) {
    .spDrawer { display:none !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Header() {
  const pathname  = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [open, setOpen]           = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  /* scroll detection */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    fn()
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* lock body scroll when mobile nav open */
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileOpen)
    return () => document.body.classList.remove("nav-open")
  }, [mobileOpen])

  /* close dropdown on route change */
  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [pathname])

  /* close on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  /* is a nav item "current" */
  const isCurrent = (item: typeof NAV[0]) => {
    if (item.href === pathname) return true
    return item.children.some(c => c.href === pathname)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header
        ref={headerRef}
        className={`spHeader ${scrolled ? "scrolled" : "top"} ${body.className}`}
        role="banner"
      >
        <div className="spTopLine" aria-hidden />

        <div className="spInner">

          {/* ── LOGO ── */}
          <Link href="/" className="spLogo" aria-label="Sankofa Publishers — Home">
            <img
              src="/images/logo.png"
              alt="Sankofa Publishers"
              className="spLogoImg"
            />
            <div className="spLogoText">
              <span className={`spLogoName ${display.className}`}>Sankofa</span>
              <span className="spLogoSub">Publishers</span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav aria-label="Main navigation">
            <ul className="spNav" role="list">
              {NAV.map(item => {
                const hasChildren = item.children.length > 0
                const current     = isCurrent(item)
                const isOpen      = open === item.label
                const isSupport   = item.label === "Support"

                return (
                  <li
                    key={item.label}
                    className={`spNavItem ${isOpen ? "open" : ""}`}
                    onMouseEnter={() => hasChildren && setOpen(item.label)}
                    onMouseLeave={() => setOpen(null)}
                  >
                    {hasChildren ? (
                      <button
                        className={`spNavTrigger ${current ? "current" : ""} ${isOpen ? "active" : ""}`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpen(isOpen ? null : item.label)}
                      >
                        {item.label}
                        <svg className="spChevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 3.5l3 3 3-3" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`spNavTrigger ${current ? "current" : ""} ${isSupport ? "spSupportBtn" : ""}`}
                      >
                        {isSupport && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight:2 }}>
                            <path d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.75L6 7.26 3.53 8.63 4 5.88 2 3.93l2.76-.42L6 1z" fill="#C9A227"/>
                          </svg>
                        )}
                        {item.label}
                      </Link>
                    )}

                    {/* dropdown */}
                    {hasChildren && (
                      <div className="spDropdown" role="menu" aria-label={`${item.label} menu`}>
                        {item.children.map((child, idx) => (
                          <React.Fragment key={child.href}>
                            {idx > 0 && <div className="spDropDivider" aria-hidden />}
                            <Link
                              href={child.href}
                              className="spDropItem"
                              role="menuitem"
                              onClick={() => setOpen(null)}
                            >
                              <span className="spDropLabel">{child.label}</span>
                              <span className="spDropDesc">{child.desc}</span>
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}

              {/* Author Login */}
              <li>
                <Link href="/auth/login" className="spNavTrigger spLoginBtn">
                  Author Login
                </Link>
              </li>

              {/* Submit CTA */}
              <li>
                <Link href="/submissions" className="spCta">
                  Submit Manuscript
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className={`spBurger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <nav
        className={`spDrawer ${mobileOpen ? "open" : ""} ${body.className}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {/* drawer header */}
        <div className="spDrawerHead">
          <Link href="/" className="spLogo" onClick={() => setMobileOpen(false)}>
            <img src="/images/logo.png" alt="Sankofa Publishers" style={{ height:32, width:"auto" }} />
            <div className="spLogoText">
              <span className={`spLogoName ${display.className}`} style={{ fontSize:13 }}>Sankofa</span>
              <span className="spLogoSub">Publishers</span>
            </div>
          </Link>
          <button
            className="spDrawerClose"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* drawer links */}
        <div className="spDrawerNav">

          {/* flat top links */}
          <div className="spDrawerSection">
            <Link href="/about" className="spDrawerLink" onClick={() => setMobileOpen(false)}>
              <span>About</span>
              <span>Who we are and why we exist</span>
            </Link>
            <Link href="/support" className="spDrawerLink" onClick={() => setMobileOpen(false)} style={{ background:"rgba(201,162,39,.06)", border:"1px solid rgba(201,162,39,.15)", borderRadius:12 }}>
              <span style={{ color:"#C9A227" }}>Support the Work</span>
              <span>Invest in the infrastructure</span>
            </Link>
          </div>

          {/* publish group */}
          <div className="spDrawerSection">
            <span className="spDrawerGroup">Publish</span>
            {[
              { label:"Submit a Manuscript",  href:"/submissions",  desc:"Two pathways. One standard." },
              { label:"Our Publishing Model", href:"/model",        desc:"Free. Author-owned. No compromise." },
              { label:"Professional Services",href:"/services",     desc:"Editorial, design, and production." },
            ].map(l => (
              <Link key={l.href} href={l.href} className="spDrawerLink" onClick={() => setMobileOpen(false)}>
                <span>{l.label}</span>
                <span>{l.desc}</span>
              </Link>
            ))}
          </div>

          {/* governance group */}
          <div className="spDrawerSection">
            <span className="spDrawerGroup">Governance</span>
            {[
              { label:"Governance & Compliance", href:"/governance",        desc:"How we hold ourselves accountable." },
              { label:"Board of Advisors",        href:"/board_of_advisors",desc:"The council that guides us." },
              { label:"Policies",                href:"/policies",          desc:"Clear terms. No hidden conditions." },
            ].map(l => (
              <Link key={l.href} href={l.href} className="spDrawerLink" onClick={() => setMobileOpen(false)}>
                <span>{l.label}</span>
                <span>{l.desc}</span>
              </Link>
            ))}
          </div>

          {/* connect group */}
          <div className="spDrawerSection">
            <span className="spDrawerGroup">Connect</span>
            {[
              { label:"Media & Press",  href:"/media",       desc:"Interviews, press kits, appearances." },
              { label:"Partnerships",   href:"/partnership", desc:"Build something that lasts." },
              { label:"Q&A",            href:"/qa",          desc:"Honest answers to hard questions." },
              { label:"Contact",        href:"/contact",     desc:"We respond to every inquiry." },
            ].map(l => (
              <Link key={l.href} href={l.href} className="spDrawerLink" onClick={() => setMobileOpen(false)}>
                <span>{l.label}</span>
                <span>{l.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* drawer CTAs */}
        <div className="spDrawerCtas">
          <Link href="/submissions" className="spDrawerCtaP" onClick={() => setMobileOpen(false)}>
            Submit Your Manuscript
          </Link>
          <Link href="/auth/login" className="spDrawerCtaG" onClick={() => setMobileOpen(false)}>
            Author Login
          </Link>
          <Link href="/model" className="spDrawerCtaG" onClick={() => setMobileOpen(false)}>
            Learn About Our Model
          </Link>
        </div>
      </nav>
    </>
  )
}
