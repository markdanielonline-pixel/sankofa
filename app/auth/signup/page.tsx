"use client"

import React, { useState, useEffect, useRef } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

function useReveal(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
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
  return [ref, visible] as const
}

function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties
}) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .72s ease ${delay}s, transform .72s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const css = `
  :root { --ink:#0B0B0C; --paper:#F6F3EE; --gold:#C9A227; --line:rgba(11,11,12,.09); }
  *, *::before, *::after { box-sizing:border-box; }
  a { text-decoration:none; }

  @keyframes shimmer {
    0%  { background-position:-200% center; }
    100%{ background-position: 200% center; }
  }
  .su-kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:14px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }

  @keyframes suFadeIn {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* grain overlay */
  .su-grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.018;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  /* page shell */
  .su-page {
    min-height: 100vh;
    background: var(--ink);
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 72px;
  }

  /* ── Left branding panel ── */
  .su-left {
    padding: 72px 64px 72px 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .su-left::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 600px 420px at 15% 65%, rgba(201,162,39,.10), transparent 60%);
    pointer-events: none;
  }

  .su-headline {
    font-size: clamp(32px, 3.2vw, 50px);
    font-weight: 300;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 0 0 20px;
  }
  .su-headline em {
    font-style: normal;
    color: #C9A227;
  }

  .su-lead {
    font-size: 15px;
    line-height: 1.78;
    color: rgba(255,255,255,.50);
    max-width: 380px;
    margin: 0 0 40px;
  }

  .su-feature {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;
  }
  .su-feature-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C9A227;
    flex-shrink: 0;
    margin-top: 7px;
  }
  .su-feature-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,.82);
    margin-bottom: 2px;
  }
  .su-feature-desc {
    font-size: 13px;
    color: rgba(255,255,255,.38);
    line-height: 1.5;
  }

  .su-quote-wrap {
    margin-top: 40px;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,.07);
  }
  .su-quote-text {
    font-size: 14px;
    font-weight: 300;
    font-style: italic;
    color: rgba(255,255,255,.38);
    line-height: 1.65;
    margin: 0 0 8px;
  }
  .su-quote-attr {
    font-size: 10px;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(201,162,39,.45);
  }

  /* ── Right form panel ── */
  .su-right {
    background: #0d0b08;
    border-left: 1px solid rgba(201,162,39,.10);
    padding: 72px 64px 72px 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .su-card {
    max-width: 420px;
    width: 100%;
    animation: suFadeIn .7s ease both .1s;
  }

  .su-form-title {
    font-size: clamp(24px, 2.6vw, 34px);
    font-weight: 400;
    color: white;
    margin: 0 0 6px;
    letter-spacing: -0.022em;
    line-height: 1.15;
  }
  .su-form-sub {
    font-size: 14px;
    color: rgba(255,255,255,.42);
    margin: 0 0 28px;
    line-height: 1.6;
  }

  .su-field { margin-bottom: 18px; }
  .su-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(255,255,255,.38);
    margin-bottom: 7px;
  }
  .su-input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255,255,255,.052);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-family: inherit;
    transition: border-color .2s, background .2s, box-shadow .2s;
    outline: none;
  }
  .su-input::placeholder { color: rgba(255,255,255,.22); }
  .su-input:focus {
    border-color: rgba(201,162,39,.55);
    background: rgba(255,255,255,.07);
    box-shadow: 0 0 0 3px rgba(201,162,39,.08);
  }

  .su-submit {
    width: 100%;
    padding: 14px;
    background: #C9A227;
    color: #140F05;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .03em;
    cursor: pointer;
    transition: background .2s, transform .18s, box-shadow .18s;
    box-shadow: 0 8px 28px rgba(201,162,39,.28);
    margin-top: 8px;
    font-family: inherit;
  }
  .su-submit:hover:not(:disabled) {
    background: #d4aa2e;
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(201,162,39,.42);
  }
  .su-submit:disabled {
    opacity: .58;
    cursor: not-allowed;
  }

  .su-divider {
    height: 1px;
    background: rgba(255,255,255,.07);
    margin: 24px 0;
  }

  .su-msg-ok {
    background: rgba(201,162,39,.10);
    border: 1px solid rgba(201,162,39,.28);
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14px;
    color: #C9A227;
    margin-top: 14px;
    line-height: 1.55;
  }
  .su-msg-err {
    background: rgba(255,70,70,.07);
    border: 1px solid rgba(255,70,70,.22);
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14px;
    color: rgba(255,120,120,.88);
    margin-top: 14px;
    line-height: 1.55;
  }

  .su-footer-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  .su-footer-links p {
    font-size: 13px;
    color: rgba(255,255,255,.32);
    margin: 0;
  }
  .su-footer-links a { color: #C9A227; font-weight: 600; }
  .su-footer-links a:hover { color: #f5d878; }
  .su-footer-tiny {
    font-size: 12px !important;
    color: rgba(255,255,255,.20) !important;
    line-height: 1.6;
  }
  .su-footer-tiny a {
    color: rgba(255,255,255,.38) !important;
    text-decoration: underline;
    font-weight: 400 !important;
  }

  @media (max-width: 820px) {
    .su-page { grid-template-columns: 1fr; }
    .su-left  { display: none; }
    .su-right { padding: 80px 28px 60px; border-left: none; }
    .su-card  { max-width: 100%; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function SignupPage() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [name,     setName]     = useState("")
  const [message,  setMessage]  = useState("")
  const [isError,  setIsError]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    setLoading(false)
    if (error) {
      setIsError(true)
      setMessage(error.message)
    } else {
      setIsError(false)
      setMessage("Welcome to Sankofa. Check your email to confirm your account, then sign in to your portal.")
    }
  }

  const features = [
    { title: "Free to Publish",        desc: "No fees for manuscripts that meet our editorial standard." },
    { title: "Author-Owned",           desc: "You retain all rights. We provide infrastructure." },
    { title: "Professional Services",  desc: "Access editing, design, and production when you need it." },
    { title: "Real Communication",     desc: "We respond. We advise. We do not exploit." },
  ]

  return (
    <div className={`${body.className} su-page`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="su-grain" aria-hidden />

      {/* ── Left branding panel ── */}
      <div className="su-left">
        <div style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <span className="su-kicker">Sankofa Publishers · Author Portal</span>
            <h1 className={`${display.className} su-headline`}>
              You are not<br />starting over.<br />
              <em>You are coming home.</em>
            </h1>
            <p className="su-lead">
              Join a growing family of authors who refuse to compromise their voice. The Sankofa Author Portal is your private space — track your work, connect with our team, and publish entirely on your own terms.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {features.map(f => (
              <div key={f.title} className="su-feature">
                <div className="su-feature-dot" />
                <div>
                  <div className="su-feature-title">{f.title}</div>
                  <div className="su-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <div className="su-quote-wrap">
              <p className={`${display.className} su-quote-text`}>
                "If you have ever felt the pressure to minimize your voice,<br />
                this press exists so you do not have to."
              </p>
              <span className="su-quote-attr">Mark Daniel · Founder, Sankofa Publishers</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="su-right">
        <div className="su-card">
          <span className="su-kicker">Create Account</span>
          <h2 className={`${display.className} su-form-title`}>
            Create Your Author Account
          </h2>
          <p className="su-form-sub">
            Join the Sankofa family. Your portal, your work, your terms.
          </p>

          <form onSubmit={handleSignup}>
            <div className="su-field">
              <label className="su-label">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                required
                className={`su-input ${body.className}`}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="su-field">
              <label className="su-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className={`su-input ${body.className}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="su-field">
              <label className="su-label">Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className={`su-input ${body.className}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`su-submit ${body.className}`}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Join the Sankofa Family →"}
            </button>

            {message && (
              <div className={isError ? "su-msg-err" : "su-msg-ok"}>
                {message}
              </div>
            )}
          </form>

          <div className="su-divider" />

          <div className="su-footer-links">
            <p>
              Already have an account?{" "}
              <Link href="/auth/login">Sign in to your portal</Link>
            </p>
            <p className="su-footer-tiny">
              By creating an account you agree to our{" "}
              <Link href="/policies">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/policies">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
