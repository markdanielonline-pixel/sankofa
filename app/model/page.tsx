"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS  ← identical on every page
═══════════════════════════════════════════════════════════ */

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
   SHARED COMPONENTS  ← identical on every page
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
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:36px; }

  .btn  { display:inline-flex; align-items:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  /* check rows */
  .cr { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--line); font-size:15px; color:rgba(11,11,12,.74); transition:padding-left .18s,color .18s; cursor:default; }
  .cr:hover { padding-left:5px; color:var(--ink); }
  .cr:last-child { border-bottom:none; }

  /* royalty breakdown rows */
  .rr { display:flex; justify-content:space-between; align-items:center; padding:13px 0; border-bottom:1px solid var(--line); font-size:14px; }
  .rr:last-child { border-bottom:none; }

  /* service cards */
  .sc { border:1px solid var(--line); border-radius:14px; padding:22px 20px; background:#fff; position:relative; overflow:hidden; transition:box-shadow .22s,transform .22s; cursor:default; }
  .sc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#C9A227; transform:scaleX(0); transform-origin:left; transition:transform .32s ease; }
  .sc:hover { box-shadow:0 14px 44px rgba(0,0,0,.09); transform:translateY(-3px); }
  .sc:hover::before { transform:scaleX(1); }

  /* big stat */
  .bigStat { border:1px solid var(--line); border-radius:16px; padding:28px 24px; text-align:center; background:#fff; transition:box-shadow .22s,transform .22s; }
  .bigStat:hover { box-shadow:0 10px 36px rgba(0,0,0,.08); transform:translateY(-3px); }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }
  .qb { border-left:3px solid #C9A227; padding:4px 0 4px 20px; margin:18px 0; }

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

  /* quote landing strip — paper bg, gives image contrast to land on */
  .quoteStrip {
    background: var(--paper);
    padding: 48px 0 56px;
    position: relative;
    z-index: 2;
  }

  @media(max-width:900px){
    .twoCol   { grid-template-columns:1fr !important; gap:28px !important; }
    .threeCol { grid-template-columns:1fr !important; }
    .card,.sc { padding:20px 16px; }
    .sigImg   { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function ModelPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Our Model · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:680 }}>
            Our Publishing Model
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Standards-based. Free to access. Built for ownership.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE CORE PROMISE
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <div>
                <Reveal>
                  <span className="kicker">The Core Promise</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                    Publishing Without Financial Barriers
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="p">Sankofa Publishers operates on a standards-based hybrid publishing model. If your manuscript meets our editorial and structural requirements and is publication ready, we publish it at no cost.</p>
                  <p className="p">Publishing should not be limited to those with disposable capital. Too many capable voices are blocked by upfront costs. We remove that barrier while maintaining professional standards.</p>
                </Reveal>
              </div>

              {/* right: three pillars */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:"✕", label:"No submission fees" },
                  { icon:"✕", label:"No mandatory service purchases" },
                  { icon:"✕", label:"No rights acquisition" },
                  { icon:"✕", label:"No forced royalty splits" },
                ].map(({ icon, label }) => (
                  <Reveal key={label} delay={0.08}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", border:"1px solid var(--line)", borderRadius:12, background:"#fff", transition:"box-shadow .2s,transform .2s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow="0 8px 28px rgba(0,0,0,.07)"; el.style.transform="translateX(4px)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow="none"; el.style.transform="translateX(0)" }}>
                      <span style={{ color:"rgba(201,162,39,.5)", fontWeight:700, fontSize:13 }}>{icon}</span>
                      <span style={{ fontSize:15, color:"var(--ink)", fontWeight:500 }}>{label}</span>
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
          WHAT FREE ACTUALLY MEANS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Clarity on Cost</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
              What "Free" Actually Means
            </h2>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, marginTop:28 }} className="twoCol">
            <Reveal delay={0.1}>
              <div className="qb" style={{ marginTop:0 }}>
                <p className={display.className} style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:300, lineHeight:1.45, color:"var(--ink)", margin:0 }}>
                  Free does not mean casual.<br />
                  Free does not mean rushed.<br />
                  Free does not mean lower standards.
                </p>
              </div>
              <p className="p" style={{ marginTop:20 }}>It means access without exploitation. The price barrier is gone. The responsibility remains.</p>
              <p className="p">Our service is free because access to infrastructure should not be restricted by capital. Publishing is not charity. It is circulation.</p>
            </Reveal>

            <Reveal delay={0.15}>
              <span className="kicker">Every Accepted Title Receives</span>
              {[
                "Global paperback distribution",
                "Hardcover production",
                "eBook production and global retail placement",
                "Audiobook pathway access",
                "ISBN registration",
                "Metadata optimization",
                "Sales reporting transparency",
                "Dedicated author page",
                "Basic platform marketing support",
              ].map(item => (
                <div key={item} className="cr">
                  <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          ROYALTIES & TRANSPARENCY
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Author Earnings</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Royalties, Payment &amp; Transparency
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Authors retain everything. We retain nothing from your earnings.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:32 }} className="twoCol">

            {/* left: royalty structure */}
            <Reveal delay={0.1}>
              <div className="card">
                <span className="kicker">Royalty Structure</span>
                <p className="p" style={{ marginBottom:20 }}>Royalty is calculated as 100% of net revenue. Net revenue is defined as gross retail sales minus:</p>
                {[
                  { item:"Retailer fees",              note:"Platform standard" },
                  { item:"Distribution fees",          note:"Industry standard" },
                  { item:"Printing costs",             note:"Per unit, print-on-demand" },
                  { item:"Payment processing costs",   note:"Gateway fees" },
                ].map(({ item, note }) => (
                  <div key={item} className="rr">
                    <span style={{ fontSize:14, color:"rgba(11,11,12,.74)" }}>{item}</span>
                    <span style={{ fontSize:12, color:"rgba(11,11,12,.42)", letterSpacing:".02em" }}>{note}</span>
                  </div>
                ))}
                <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(201,162,39,.07)", borderRadius:10, border:"1px solid rgba(201,162,39,.2)" }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:600, color:"var(--ink)" }}>Remainder = Your royalty. 100% of it.</p>
                </div>
              </div>
            </Reveal>

            {/* right: two portal options */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Reveal delay={0.12}>
                <div className="card">
                  <span className="kicker">Standard Reporting — Included Free</span>
                  <p className="p" style={{ margin:0 }}>Manual sales reports. Royalty payments every six months. Detailed breakdown of units sold, pricing, and fees. No cost.</p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="card" style={{ border:"1px solid rgba(201,162,39,.3)", background:"rgba(201,162,39,.03)" }}>
                  <span className="kicker">Automated Author Portal — Optional</span>
                  <p className="p" style={{ marginBottom:14 }}>Real-time dashboard. Automated royalty deposits directly to your bank. Detailed analytics. Downloadable reports.</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                    <span className={display.className} style={{ fontSize:32, fontWeight:300, color:"#C9A227" }}>$49</span>
                    <span style={{ fontSize:13, color:"rgba(11,11,12,.50)" }}>/ month · optional</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          RIGHTS & OWNERSHIP
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }} className="twoCol">

            <Reveal>
              <span className="kicker">Author Rights</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Rights &amp; Withdrawal
              </h2>
              <p className="p">Authors retain full ownership of their work at all times. We receive only limited non-exclusive publishing and distribution permission through formal agreement.</p>
              <p className="p">Should an author wish to discontinue publishing with Sankofa, a 30-day written notice is required to allow proper distribution withdrawal and record management according to industry standards.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:24 }}>
                {["100% Copyright ownership","100% Intellectual property control","100% of net royalty earnings","Right to withdraw with 30 days notice"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#C9A227", flexShrink:0 }} />
                    <span style={{ fontSize:14, fontWeight:500, color:"var(--ink)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <span className="kicker">Pricing Collaboration</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Retail Pricing
              </h2>
              <p className="p">Sankofa works collaboratively with authors to determine retail pricing. You are not excluded from pricing decisions.</p>
              <p className="p">We provide strategic pricing recommendations designed to:</p>
              {["Protect author profitability","Maintain market competitiveness","Ensure sustainable margin"].map(item => (
                <div key={item} className="cr">
                  <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
              <p className="p" style={{ marginTop:16, fontSize:14, color:"rgba(11,11,12,.52)" }}>Final pricing decisions are made with transparency and author involvement.</p>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW SANKOFA SUSTAINS ITSELF  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Our Revenue Structure</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
              How Sankofa Sustains Itself
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.62)", maxWidth:580, marginBottom:0 }}>
              Our sustainability does not depend on seizing author rights or withholding royalties. Our publishing decisions are never influenced by service purchases. Editorial acceptance is based solely on manuscript quality and alignment.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { title:"Optional Editorial Services",       body:"Developmental editing, line editing, and proofreading available at transparent rates. Never mandatory." },
              { title:"Design Services",                   body:"Cover design and interior formatting to production standard. Author retains all designed assets." },
              { title:"Publishing Readiness Assessment",   body:"Structured evaluation before submission. Refundable 100% if manuscript is not accepted." },
              { title:"Marketing Services",                body:"Campaign-based and subscription marketing support. Strategic visibility, not empty promises." },
              { title:"Ghostwriting Services",             body:"Fully confidential. Contractually protected. Built through structured process by experienced writers." },
              { title:"Voluntary Author Contributions",    body:"Authors who choose to contribute a portion of royalties to sustain the press may do so. Never coerced." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="sc" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)" }}>
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 10px" }}>{title}</p>
                  <p className="p" style={{ margin:0, fontSize:14, color:"rgba(255,255,255,.60)" }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ marginTop:32, padding:"20px 24px", border:"1px solid rgba(201,162,39,.25)", borderRadius:14, background:"rgba(201,162,39,.05)" }}>
              <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.80)", fontWeight:500 }}>
                We do not sell publication. We publish based on standard. Optional services exist to strengthen manuscripts — not to open doors.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PUBLISHING READINESS ASSESSMENT
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Optional Service</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Publishing Readiness Assessment
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Even strong manuscripts benefit from structured professional evaluation before entering distribution.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:32 }} className="twoCol">
            <Reveal delay={0.1}>
              <div className="card">
                <span className="kicker">What the PRA Includes</span>
                {["Structural integrity review","Argument and narrative coherence analysis","Formatting and compliance review","Production viability assessment","AI disclosure verification","Risk and legal flagging","Written editorial report with recommendations"].map(item => (
                  <div key={item} className="cr">
                    <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>→</span>
                    <span style={{ fontSize:14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="card" style={{ border:"1px solid rgba(201,162,39,.3)", background:"rgba(201,162,39,.03)", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div>
                  <span className="kicker">Investment</span>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:16 }}>
                    <span className={display.className} style={{ fontSize:"clamp(36px,4vw,56px)", fontWeight:300, color:"#C9A227", lineHeight:1 }}>$395</span>
                    <span style={{ fontSize:14, color:"rgba(11,11,12,.50)" }}>– $750</span>
                  </div>
                  <p className="p" style={{ fontSize:14 }}>Depending on manuscript length. Investment protects your book before distribution.</p>
                </div>
                <div style={{ padding:"16px", background:"rgba(201,162,39,.10)", borderRadius:10, border:"1px solid rgba(201,162,39,.25)", marginTop:20 }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:600, color:"var(--ink)", lineHeight:1.6 }}>
                    100% Refund Guarantee — if you purchase the PRA at time of submission and your manuscript is not accepted, you receive a full refund.
                  </p>
                </div>
                <div style={{ marginTop:20 }}>
                  <a className="btn btnP" href="/submissions" style={{ width:"100%", justifyContent:"center" }}>
                    Submit &amp; Add PRA
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          WHY THIS MODEL EXISTS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56 }} className="twoCol">
            <Reveal>
              <span className="kicker">Why This Model Exists</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                We Are Building Ownership
              </h2>
              <p className="p">The richest natural continent on Earth remains economically constrained not because of absence of resources, but because of extraction.</p>
              <p className="p">Aid without ownership becomes dependency. Publishing infrastructure is part of economic circulation. Narrative control strengthens policy influence. Policy influence strengthens economic positioning.</p>
              <p className="p">We are not offering charity. We are offering structure.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  { num:"45",   sub:"Day max review window" },
                  { num:"100%", sub:"Copyright retained" },
                  { num:"$0",   sub:"To publish" },
                  { num:"30",   sub:"Day withdrawal notice" },
                ].map(({ num, sub }) => (
                  <div key={sub} className="bigStat">
                    <span className={display.className} style={{ fontSize:"clamp(32px,3vw,48px)", fontWeight:300, color:"#C9A227", display:"block", lineHeight:1, marginBottom:8 }}>{num}</span>
                    <span style={{ fontSize:12, color:"rgba(11,11,12,.50)", letterSpacing:".03em" }}>{sub}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — paper bg, image lands here
      ══════════════════════════════════════════ */}
      <section className="quoteStrip">
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(22px,2.8vw,38px)", fontWeight:300, lineHeight:1.45, color:"var(--ink)", margin:"0 0 16px", letterSpacing:"-0.015em" }}>
                "The price barrier is gone.<br />The responsibility remains."
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
          overflow:visible so image bleeds into footer
      ══════════════════════════════════════════ */}
      <section className="sigSection" style={{ paddingTop:90, paddingBottom:120 }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 360px at 85% 50%,rgba(201,162,39,.07),transparent 70%)", pointerEvents:"none" }} />

        <div className="pc ctaShift" style={{ position:"relative", zIndex:2, paddingLeft:"clamp(24px, 40vw, 500px)" }}>
          <Reveal>
            <span className="kicker">Ready to Submit?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              We are for work that intends to endure.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              If your manuscript is prepared, disciplined, and publication ready — we invite you to submit at no cost.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/services">View Our Services</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — chains_breaking.png */}
        <img
          src="/images/chains_breaking.png"
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
