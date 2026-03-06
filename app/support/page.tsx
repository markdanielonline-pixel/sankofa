"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS
═══════════════════════════════════════════════════════════ */

return [ref, visible] as const(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
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

function useFloat(amplitude = 9, hz = 0.38): number {
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      setY(Math.sin(((now - t0) / 1000) * hz * Math.PI * 2) * amplitude)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [amplitude, hz])
  return y
}

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */

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

function GoldWipe({ delay = 0 }: { delay?: number }) {
  const [ref, visible] = useReveal(0.6)
  return (
    <div ref={ref} style={{
      height: 2, background: "#C9A227",
      width: visible ? 48 : 0,
      transition: `width .85s ease ${delay}s`,
    }} />
  )
}

function ScrollBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setPct(scrollTop / (scrollHeight - clientHeight) * 100)
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <div aria-hidden style={{
      position: "fixed", top: 0, left: 0, zIndex: 9999,
      height: 2, width: `${pct}%`,
      background: "#C9A227",
      boxShadow: "0 0 10px rgba(201,162,39,.65)",
      transition: "width .08s linear",
      pointerEvents: "none",
    }} />
  )
}

function SideLabel({ text }: { text: string }) {
  return (
    <div aria-hidden style={{
      position: "fixed", left: 16, top: "50%",
      transform: "translateY(-50%) rotate(-90deg)",
      transformOrigin: "center center",
      zIndex: 100, pointerEvents: "none",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ width: 24, height: 1, background: "#C9A227", opacity: .45, display: "block" }} />
      <span style={{
        fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase",
        color: "rgba(11,11,12,.28)", fontFamily: body.style.fontFamily,
        fontWeight: 500, whiteSpace: "nowrap",
      }}>{text}</span>
      <span style={{ width: 24, height: 1, background: "#C9A227", opacity: .45, display: "block" }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTRIBUTION SELECTOR
═══════════════════════════════════════════════════════════ */
function ContributeSelector() {
  const [type, setType] = useState<"once" | "monthly">("once")
  const [amount, setAmount] = useState<number | null>(25)
  const [custom, setCustom] = useState("")

  const presets = { once: [10, 25, 50, 100, 250], monthly: [5, 10, 25, 50] }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* once vs monthly */}
      <div>
        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "#C9A227", display: "block", marginBottom: 10 }}>
          Contribution Type
        </label>
        <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, padding: 4, gap: 4 }}>
          {(["once", "monthly"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setType(t); setAmount(presets[t][1]); setCustom("") }}
              style={{
                padding: "9px 22px", borderRadius: 999, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: body.style.fontFamily,
                background: type === t ? "#C9A227" : "transparent",
                color: type === t ? "#140F05" : "rgba(11,11,12,.45)",
                transition: "background .2s, color .2s",
                boxShadow: type === t ? "0 4px 14px rgba(201,162,39,.28)" : "none",
              }}
            >
              {t === "once" ? "One Time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* amount presets */}
      <div>
        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.40)", display: "block", marginBottom: 10 }}>
          Select Amount
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {presets[type].map(p => (
            <button
              key={p}
              onClick={() => { setAmount(p); setCustom("") }}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 14, fontWeight: 600,
                fontFamily: body.style.fontFamily,
                background: amount === p && !custom ? "rgba(201,162,39,.12)" : "#fff",
                color: amount === p && !custom ? "#C9A227" : "rgba(11,11,12,.55)",
                border: `1px solid ${amount === p && !custom ? "rgba(201,162,39,.4)" : "var(--line)"}`,
                transition: "all .18s",
              }}
            >
              ${p}
            </button>
          ))}
          {/* custom */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(11,11,12,.40)" }}>$</span>
            <input
              placeholder="Other"
              value={custom}
              onChange={e => { setCustom(e.target.value); setAmount(null) }}
              style={{
                padding: "10px 14px 10px 24px", borderRadius: 10, width: 90,
                border: `1px solid ${custom ? "rgba(201,162,39,.4)" : "var(--line)"}`,
                fontSize: 14, fontFamily: body.style.fontFamily,
                color: "var(--ink)", background: custom ? "rgba(201,162,39,.06)" : "#fff",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* proceed button */}
      <button
        style={{
          padding: "14px 28px", borderRadius: 999, alignSelf: "flex-start",
          background: "#C9A227", color: "#140F05", fontWeight: 600,
          fontSize: 14, border: "none", cursor: "pointer",
          fontFamily: body.style.fontFamily,
          boxShadow: "0 8px 28px rgba(201,162,39,.28)",
          transition: "transform .18s, box-shadow .18s",
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 14px 36px rgba(201,162,39,.38)" }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 8px 28px rgba(201,162,39,.28)" }}
      >
        {type === "once" ? `Contribute $${custom || amount} Once` : `Contribute $${custom || amount} / Month`} →
      </button>

      <p style={{ fontSize: 12, color: "rgba(11,11,12,.38)", margin: 0, lineHeight: 1.7 }}>
        Contributions are voluntary and go directly toward operational costs. They do not influence publishing decisions in any way.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const css = `
  :root { --ink:#0B0B0C; --paper:#F6F3EE; --gold:#C9A227; --line:rgba(11,11,12,.09); }
  *, *::before, *::after { box-sizing:border-box; }
  html, body { margin:0; padding:0; background:#fff; color:var(--ink); overflow-x:hidden; }
  a { color:inherit; text-decoration:none; }

  .pc  { max-width:1080px; margin:0 auto; padding:0 32px; }
  .sec { padding:60px 0; }

  @keyframes shimmer {
    0%  { background-position:-200% center; }
    100%{ background-position: 200% center; }
  }
  .kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:12px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }

  .p { font-size:16px; line-height:1.75; color:rgba(11,11,12,.74); margin:0 0 12px; }
  .p:last-child { margin-bottom:0; }
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:32px; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  /* impact card */
  .impactCard { border:1px solid var(--line); border-radius:16px; padding:24px 20px; background:#fff; transition:box-shadow .22s,transform .22s,border-color .22s; cursor:default; }
  .impactCard:hover { box-shadow:0 12px 40px rgba(0,0,0,.08); transform:translateY(-3px); border-color:rgba(201,162,39,.3); }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }

  /* page title band */
  .ptBand { background:var(--ink); padding:52px 0 44px; position:relative; overflow:hidden; }
  .ptBand::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,#C9A227,transparent 60%); }

  /* film grain */
  .grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  @keyframes ptFade { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  .ptA1 { animation:ptFade .7s ease both .10s; }
  .ptA2 { animation:ptFade .7s ease both .25s; }
  .ptA3 { animation:ptFade .7s ease both .40s; }

  /* page signature */
  .sigSection { background:var(--ink); position:relative; overflow:visible; z-index:1; }
  .sigImg {
    position:absolute; bottom:-110px; left:-24px;
    width:660px; max-width:62vw;
    pointer-events:none; z-index:4;
    filter:drop-shadow(0 -16px 60px rgba(0,0,0,.60));
  }

  @media(max-width:900px){
    .twoCol   { grid-template-columns:1fr !important; gap:24px !important; }
    .threeCol { grid-template-columns:1fr !important; }
    .card { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function SupportPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Support · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Support the Work
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              "We are not fragments. We are foundation."
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY IT MATTERS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">Why This Matters</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  Publishing Infrastructure Costs Money
                </h2>
                <p className="p">Sankofa chose to remove mandatory publishing fees so that capable authors are never blocked by cost. That decision was intentional. It was also a financial commitment that requires collective support to sustain.</p>
                <p className="p">Editorial systems, distribution coordination, platform development, compliance, reporting, production management. All of it costs money. Contributions from people who believe in this work are what make the free model possible.</p>
                <p className="p">This is not charity. This is investment in infrastructure that serves a community.</p>
              </Reveal>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Access for writers without capital" },
                  { label:"Institutional independence from corporate publishing" },
                  { label:"Sustainable infrastructure for the long term" },
                  { label:"Cultural record building that outlasts market trends" },
                  { label:"A press that never has to compromise its standards" },
                ].map(({ label }, i) => (
                  <Reveal key={label} delay={i * 0.07}>
                    <div
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderRadius:12, border:"1px solid var(--line)", background:"#fff", transition:"box-shadow .2s,transform .2s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)"; el.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateX(0)" }}
                    >
                      <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, flexShrink:0 }}>→</span>
                      <span style={{ fontSize:14, color:"var(--ink)" }}>{label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          CONTRIBUTE WIDGET
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:48, alignItems:"start" }} className="twoCol">
            <Reveal>
              <span className="kicker">Contribute</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
                Give With Intention
              </h2>
              <p className="p" style={{ marginBottom:28 }}>
                Choose what works for you. Every contribution goes directly toward keeping this press operational and accessible.
              </p>
              <ContributeSelector />
            </Reveal>

            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Reveal delay={0.1}>
                <div className="card" style={{ background:"var(--ink)", border:"none", color:"white" }}>
                  <span className="kicker">Your Contribution Is Voluntary</span>
                  <p className="p" style={{ color:"rgba(255,255,255,.65)", fontSize:15 }}>
                    Authors who choose not to contribute receive the same editorial respect and publishing commitment as those who do. Contributions never influence publishing decisions.
                  </p>
                  <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,.09)", margin:"16px 0" }} />
                  <p style={{ margin:0, fontSize:14, fontWeight:600, color:"rgba(255,255,255,.82)" }}>
                    Strength is encouraged. It is never coerced.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="card">
                  <span className="kicker">Royalty Contributions</span>
                  <p className="p" style={{ fontSize:14 }}>
                    Published authors may choose to allocate a voluntary portion of their royalties to sustain the press. This is set up through the Author Portal and can be adjusted or stopped at any time.
                  </p>
                  <p style={{ fontSize:13, color:"rgba(11,11,12,.45)", margin:0, lineHeight:1.6 }}>
                    Contact your author account manager or email authors@sankofapublishers.com to set this up.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="card">
                  <span className="kicker">Institutional Giving</span>
                  <p className="p" style={{ fontSize:14 }}>
                    Organizations, foundations, and community groups interested in supporting Sankofa through grants, endowments, or institutional contributions are welcome to reach out directly.
                  </p>
                  <a className="btn btnG" href="mailto:partnerships@sankofapublishers.com" style={{ fontSize:13, padding:"10px 20px", marginTop:4 }}>
                    Contact Us About Institutional Giving →
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          WHAT CONTRIBUTIONS SUPPORT
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Where It Goes</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              What Your Contribution Supports
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>
              Contributions go toward the operational costs of running a professional publishing press. Nothing else.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { title:"Platform Infrastructure",      body:"The systems that power manuscript intake, author accounts, royalty reporting, and the Author Portal. These are not free to build or maintain." },
              { title:"Editorial Operations",         body:"The people and processes behind structured manuscript review. Every submission is read by a person. Every decision is communicated with care." },
              { title:"Distribution Coordination",    body:"Getting accepted titles into global retail systems, ISBN registration, metadata optimization, and retail relationship management." },
              { title:"Compliance and Legal",         body:"Copyright protection, publishing agreements, author rights documentation, and the legal infrastructure that protects every person involved." },
              { title:"Author Access",                body:"Making sure that capable writers who cannot afford upfront publishing costs still get access to the same infrastructure as those who can." },
              { title:"Long Term Record",             body:"Building an institutional archive of African and diasporic narrative that exists beyond market cycles, platform changes, and trend shifts." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="impactCard">
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 10px" }}>{title}</p>
                  <p className="p" style={{ margin:0, fontSize:14 }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CIRCULATION AS CULTURE  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">The Bigger Picture</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 16px", color:"white" }}>
                Circulation Builds Stability
              </h2>
              <p className="p" style={{ color:"rgba(255,255,255,.65)" }}>
                The richest natural continent on Earth remains economically constrained not because of absence, but because of extraction. Resources leave. Wealth does not circulate within.
              </p>
              <p className="p" style={{ color:"rgba(255,255,255,.65)" }}>
                When people within a community invest in the institutions that serve them, those institutions grow strong enough to keep serving. That is how independent infrastructure survives.
              </p>
              <p className="p" style={{ color:"rgba(255,255,255,.65)", marginBottom:0 }}>
                Ownership grows where circulation exists. This press is part of that circulation.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { q:"Is this tax deductible?",           a:"Sankofa Publishers is a private LLC. Contributions are not tax deductible at this time. We will update this clearly if that changes." },
                  { q:"Can I cancel a monthly contribution?", a:"Yes. Monthly contributions can be cancelled at any time with no notice period required." },
                  { q:"Does contributing make me a member?",  a:"No. There is no membership structure. Contributing is simply a way to support the work. Nothing more is implied." },
                  { q:"Is there a minimum contribution?",     a:"No minimum. Give what makes sense for you. Every amount is received with the same gratitude." },
                ].map(({ q, a }, i) => (
                  <Reveal key={q} delay={i * 0.08}>
                    <div style={{ padding:"18px 20px", border:"1px solid rgba(255,255,255,.09)", borderRadius:14, background:"rgba(255,255,255,.03)", transition:"background .2s,border-color .2s", cursor:"default" }}
                      onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.07)"; el.style.borderColor="rgba(201,162,39,.25)" }}
                      onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(255,255,255,.03)"; el.style.borderColor="rgba(255,255,255,.09)" }}
                    >
                      <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.80)", margin:"0 0 6px" }}>{q}</p>
                      <p style={{ fontSize:13, color:"rgba(255,255,255,.52)", margin:0, lineHeight:1.65 }}>{a}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — page_map.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "Ownership grows where circulation exists."
              </p>
              <span style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(11,11,12,.35)" }}>
                Sankofa Publishers
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CLOSING CTA  +  PAGE SIGNATURE
      ══════════════════════════════════════════ */}
      <section className="sigSection" style={{ paddingTop:90, paddingBottom:120 }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 360px at 85% 50%,rgba(201,162,39,.07),transparent 70%)", pointerEvents:"none" }} />

        <div className="pc ctaShift" style={{ position:"relative", zIndex:2, paddingLeft:"clamp(24px, 40vw, 500px)" }}>
          <Reveal>
            <span className="kicker">Ready to Contribute?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Legacy requires structure.<br />Structure requires support.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              If Sankofa has aligned with your values, contribute toward keeping it strong. Every amount matters.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="#contribute">Contribute Now</a>
              <a className="btn btnG" href="/model">Learn About Our Model</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — page_map.png */}
        <img
          src="/images/page_map.png"
          alt=""
          className="sigImg"
          style={{
            transform: `translateY(${sigFloat}px)`,
            transition: "transform .04s linear",
          }}
        />
      </section>

    </main>
  )
}
