"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

function useReveal(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null!)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible] as const
}

function Reveal({ children, delay = 0, style = {}, className = "" }: {
  children: React.ReactNode; delay?: number
  style?: React.CSSProperties; className?: string
}) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .72s ease ${delay}s, transform .72s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function PortalPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth/login")
      } else {
        setSession(data.session)
      }
      setChecked(true)
    })
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (!checked || !session) return null

  const fullName = session.user.user_metadata?.full_name || session.user.email || "Author"
  const email = session.user.email || ""
  const memberSince = formatDate(session.user.created_at)

  return (
    <div className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: `
        .portal-page {
          min-height: calc(100vh - 72px);
          background: #0b0b0c;
          color: #f6f3ee;
        }
        .portal-topbar {
          border-bottom: 1px solid rgba(255,255,255,.07);
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .portal-logo {
          font-family: ${display.style.fontFamily};
          font-size: 20px;
          font-weight: 400;
          color: #f6f3ee;
          letter-spacing: -0.01em;
        }
        .portal-logo span {
          color: #C9A227;
        }
        .logout-btn {
          padding: 9px 22px;
          background: transparent;
          border: 1px solid rgba(201,162,39,.5);
          color: #C9A227;
          border-radius: 999px;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: background .2s, opacity .2s;
          letter-spacing: .04em;
        }
        .logout-btn:hover {
          background: rgba(201,162,39,.08);
        }
        .portal-hero {
          padding: 72px 32px 48px;
          max-width: 900px;
          margin: 0 auto;
        }
        .portal-kicker {
          display: block;
          font-size: 11px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #C9A227;
          margin-bottom: 18px;
        }
        .portal-heading {
          font-family: ${display.style.fontFamily};
          font-weight: 400;
          font-size: clamp(32px, 4vw, 52px);
          letter-spacing: -0.02em;
          color: #f6f3ee;
          margin: 0 0 12px;
          line-height: 1.08;
        }
        .portal-sub {
          font-size: 16px;
          color: rgba(246,243,238,.5);
          margin: 0;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }
        @media (max-width: 768px) {
          .portal-grid { grid-template-columns: 1fr; }
          .portal-topbar { padding: 16px 20px; }
          .portal-hero { padding: 48px 20px 32px; }
          .portal-grid { padding: 0 20px 60px; }
        }
        .dash-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 22px;
          padding: 32px 28px;
        }
        .dash-card-label {
          font-size: 11px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(246,243,238,.4);
          margin: 0 0 20px;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,162,39,.1);
          border: 1px solid rgba(201,162,39,.25);
          border-radius: 999px;
          padding: 7px 16px;
          font-size: 14px;
          color: #C9A227;
          font-weight: 500;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C9A227;
          flex-shrink: 0;
        }
        .royalty-amount {
          font-family: ${display.style.fontFamily};
          font-size: 38px;
          font-weight: 300;
          color: #f6f3ee;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
          line-height: 1;
        }
        .royalty-note {
          font-size: 13px;
          color: rgba(246,243,238,.38);
          margin: 0;
          line-height: 1.5;
        }
        .account-email {
          font-size: 15px;
          color: #f6f3ee;
          margin: 0 0 10px;
          word-break: break-all;
        }
        .account-since {
          font-size: 13px;
          color: rgba(246,243,238,.38);
          margin: 0;
        }
        .rule {
          height: 1px;
          background: rgba(255,255,255,.07);
          border: none;
          margin: 16px 0;
        }
      ` }} />

      <div className="portal-page">
        <div className="portal-topbar">
          <span className="portal-logo">Sankofa <span>Publishers</span></span>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>

        <div className="portal-hero">
          <Reveal>
            <span className="portal-kicker">Author Portal</span>
            <h1 className="portal-heading">Welcome, {fullName}</h1>
            <p className="portal-sub">Here&apos;s an overview of your publishing journey.</p>
          </Reveal>
        </div>

        <div className="portal-grid">
          <Reveal delay={0.1}>
            <div className="dash-card">
              <p className="dash-card-label">Manuscript Status</p>
              <div className="status-pill">
                <span className="status-dot" />
                Under Review
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="dash-card">
              <p className="dash-card-label">Royalties</p>
              <p className="royalty-amount">$0.00</p>
              <p className="royalty-note">Royalty tracking coming soon</p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="dash-card">
              <p className="dash-card-label">Account</p>
              <p className="account-email">{email}</p>
              <hr className="rule" />
              <p className="account-since">Member since {memberSince}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
