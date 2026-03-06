"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS
═══════════════════════════════════════════════════════════ */

function useReveal(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null!)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    obs.observe(el)

    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible] as const
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
   SHARED COMPONENTS  ← copy to every page
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
    <div
      aria-hidden
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 9999,
        height: 2, width: `${pct}%`,
        background: "#C9A227",
        boxShadow: "0 0 10px rgba(201,162,39,.65)",
        transition: "width .08s linear",
        pointerEvents: "none",
      }}
    />
  )
}

function SideLabel() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 16,
        top: "50%",
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "center center",
        zIndex: 100,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ width: 24, height: 1, background: "#C9A227", opacity: 0.45, display: "block" }} />
      <span style={{
        fontSize: 9,
        letterSpacing: ".26em",
        textTransform: "uppercase",
        color: "rgba(11,11,12,.28)",
        fontFamily: body.style.fontFamily,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}>
        About · Sankofa Publishers
      </span>
      <span style={{ width: 24, height: 1, background: "#C9A227", opacity: 0.45, display: "block" }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CSS  (plain string — no styled-jsx needed)
═══════════════════════════════════════════════════════════ */
const css = `
  :root { --ink:#0B0B0C; --paper:#F6F3EE; --gold:#C9A227; --line:rgba(11,11,12,.09); }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin:0; padding:0; background:#fff; color:var(--ink); overflow-x:hidden; }
  a { color:inherit; text-decoration:none; }

  .pc  { max-width:1080px; margin:0 auto; padding:0 32px; }
  .sec { padding:60px 0; }
  .sec0{ padding:44px 0; }

  /* kicker shimmer */
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  .kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:12px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 4s linear infinite;
  }

  .p { font-size:16px; line-height:1.75; color:rgba(11,11,12,.74); margin:0 0 12px; }

  .card {
    background:#fff; border:1px solid var(--line);
    border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:36px;
  }

  /* buttons */
  .btn  { display:inline-flex; align-items:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  /* value cards */
  .vc { border:1px solid var(--line); border-radius:14px; padding:22px 20px; position:relative; overflow:hidden; background:#fff; transition:box-shadow .22s,transform .22s; cursor:default; }
  .vc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#C9A227; transform:scaleX(0); transform-origin:left; transition:transform .32s ease; }
  .vc:hover { box-shadow:0 14px 44px rgba(0,0,0,.09); transform:translateY(-3px); }
  .vc:hover::before { transform:scaleX(1); }

  /* process */
  .ps { padding:26px 24px; border-radius:14px; border:1px solid var(--line); background:#fff; transition:box-shadow .22s,transform .22s; }
  .ps:hover { box-shadow:0 14px 44px rgba(0,0,0,.09); transform:translateY(-3px); }
  .pn { font-size:60px; font-weight:300; color:rgba(201,162,39,.13); line-height:1; margin-bottom:10px; transition:color .28s; }
  .ps:hover .pn { color:rgba(201,162,39,.28); }

  /* stat rows */
  .sr { border:1px solid var(--line); border-radius:14px; padding:20px 24px; display:flex; align-items:center; gap:18px; background:#fff; transition:box-shadow .2s,transform .2s; }
  .sr:hover { box-shadow:0 8px 28px rgba(0,0,0,.07); transform:translateX(5px); }

  /* genre */
  .gi { display:flex; align-items:center; gap:10px; padding:11px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.74); transition:color .18s,padding-left .18s; cursor:default; }
  .gi:hover { color:var(--ink); padding-left:5px; }
  .gi .ar { color:#C9A227; font-size:12px; transition:transform .18s; }
  .gi:hover .ar { transform:translateX(3px); }

  .qb { border-left:3px solid #C9A227; padding:4px 0 4px 20px; margin:18px 0; }
  .divLine { height:1px; background:var(--line); border:none; margin:0; }

  /* page-title band */
  .ptBand { background:var(--ink); padding:52px 0 44px; position:relative; overflow:hidden; }
  .ptBand::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,#C9A227,transparent 60%); }

  /* film grain */
  .grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  /* page title entrance */
  @keyframes ptFade { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  .ptA1 { animation:ptFade .7s ease both .10s; }
  .ptA2 { animation:ptFade .7s ease both .25s; }
  .ptA3 { animation:ptFade .7s ease both .40s; }

  /* ── PAGE SIGNATURE IMAGE ──
     The CTA section has overflow:visible + negative padding-bottom
     so the image physically crosses the section boundary into the footer.
  */
  .sigSection {
    background: var(--ink);
    position: relative;
    overflow: visible;          /* ← KEY: allows child to bleed out */
    padding-bottom: 0;
    z-index: 1;
  }
  .sigImg {
    position: absolute;
    bottom: -110px;             /* ← pulls image DOWN into footer */
    left: -24px;
    width: 680px;
    max-width: 64vw;
    pointer-events: none;
    z-index: 4;
    filter: drop-shadow(0 -16px 60px rgba(0,0,0,.60));
  }

  @media(max-width:900px) {
    .twoCol   { grid-template-columns:1fr !important; gap:28px !important; }
    .threeCol { grid-template-columns:1fr !important; }
    .card,.vc,.ps { padding:20px 16px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      {/* plain <style> tag — no styled-jsx, no TS errors */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1
            className={`${display.className} ptA2`}
            style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:680 }}
          >
            About Us
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)", letterSpacing:".01em" }}>
              Building infrastructure for narratives that deserve to endure.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <div>
                <Reveal>
                  <span className="kicker">Who We Are</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>Publishing as Infrastructure</h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="p">Sankofa Publishers is a hybrid publishing house built on more than 47 years of combined experience across editorial development, manuscript evaluation, design, production management, print systems, and distribution strategy.</p>
                  <p className="p">Though the imprint itself is newly established, our foundation is not. We understand publishing as infrastructure. We understand narrative as power. We understand ownership as non-negotiable.</p>
                  <p className="p" style={{ fontWeight:600, color:"var(--ink)" }}>We are building a press designed to endure.</p>
                </Reveal>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"47+",  sub:"Years Combined Experience" },
                  { label:"100%", sub:"Author Rights Retained" },
                  { label:"$0",   sub:"Cost to Publish" },
                ].map(({ label, sub }, i) => (
                  <Reveal key={label} delay={i * 0.11}>
                    <div className="sr">
                      <span className={display.className} style={{ fontSize:46, fontWeight:300, color:"#C9A227", lineHeight:1, minWidth:84 }}>{label}</span>
                      <span style={{ fontSize:13, color:"rgba(11,11,12,.52)", letterSpacing:".03em" }}>{sub}</span>
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
          WHY SANKOFA
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Our Name</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", maxWidth:560 }}>Why Sankofa</h2>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, marginTop:28 }} className="twoCol">
            <Reveal delay={0.1}>
              <p className="p">Sankofa speaks to retrieval. To go back and bring forward what carries value.</p>
              <p className="p">For generations, African and diasporic narratives have been filtered, diluted, reshaped, or dismissed to accommodate external expectations.</p>
              <p className="p">Colonization did not begin with chains. It began with distortion. Africa was not discovered — it was mapped, traded with, and intellectually active while parts of Europe were still tribal.</p>
              <p className="p">The diaspora is not scattered weakness. It is dispersed continuity.</p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="qb" style={{ marginTop:0 }}>
                <p className={display.className} style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:300, lineHeight:1.45, color:"var(--ink)", margin:0 }}>
                  We are not reactionary.<br />We are reconstructive.
                </p>
              </div>
              <p className="p" style={{ marginTop:20 }}>Sankofa exists to provide disciplined publishing infrastructure for work that understands this reality and approaches it with seriousness.</p>
              <p className="p">Narrative control is power. You cannot build a sovereign future while seeking validation from systems that destabilized your past.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">What Drives Us</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>Our Core Position</h2>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:24 }} className="threeCol">
            {[
              { title:"Substance over spectacle",     body:"Standards driven. Every title is built to outlast market cycles. We are not volume driven. We are not trend responsive." },
              { title:"Preparation over convenience", body:"We do not rush unfinished manuscripts to market. Readiness is non-negotiable. Discipline over convenience, always." },
              { title:"Ownership over dependency",    body:"Authors retain 100% copyright, 100% royalty earnings, and full intellectual property control. Always." },
              { title:"Intellectual rigor",           body:"Strong ideas, responsible claims, coherent logic, credible evidence. We welcome controversy where it is earned." },
              { title:"Cultural integrity",           body:"Cultural grounding is not exclusion — it is responsibility. We exist to support work contributing to African and diasporic discourse." },
              { title:"Transparency always",          body:"Every unit sold, every fee deducted, every royalty paid — visible. No hidden adjustments. No unexplained deductions." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="vc">
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 10px" }}>{title}</p>
                  <p className="p" style={{ margin:0, fontSize:14 }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          WHAT WE PUBLISH / DON'T
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"start" }} className="twoCol">
            <Reveal>
              <span className="kicker">Our Catalog</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,34px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>What We Publish</h2>
              <p className="p">We welcome disciplined work across genres. We require clarity, preparation, and accountability.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
                {["Literary fiction","Memoir","Investigative writing","Historical research","Cultural analysis","Economic thought","Social commentary","Structured critique"].map(g => (
                  <div key={g} className="gi"><span className="ar">→</span>{g}</div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <span className="kicker">Our Standards</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,34px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>What We Do Not Do</h2>
              <div style={{ marginTop:16 }}>
                {["Rush unfinished manuscripts to market","Publish content designed only to provoke without substance","Participate in ideological extremism","Seize author rights or impose forced royalty structures","Dilute cultural seriousness for market trend","Publish faith-based doctrine or religious advocacy","Apologize for disciplined love of African identity"].map(item => (
                  <div
                    key={item}
                    style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid var(--line)", fontSize:14, color:"rgba(11,11,12,.68)", transition:"padding-left .18s,color .18s", cursor:"default" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.paddingLeft="7px"; el.style.color="var(--ink)" }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.paddingLeft="0";   el.style.color="rgba(11,11,12,.68)" }}
                  >
                    <span style={{ color:"rgba(201,162,39,.45)", fontWeight:700, marginTop:1, flexShrink:0 }}>✕</span>{item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOUNDER STATEMENT
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:56, alignItems:"start" }} className="twoCol">
            <Reveal>
              <span className="kicker">Founder's Statement</span>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.44)", lineHeight:1.9, margin:"8px 0 0" }}>
                Mark Daniel<br />Founder &amp; Managing Director<br />Sankofa Publishers
              </p>
              <div style={{ width:36, height:2, background:"#C9A227", marginTop:20 }} />
            </Reveal>
            <div>
              <Reveal delay={0.1}>
                <p className={display.className} style={{ fontSize:"clamp(20px,2.2vw,32px)", fontWeight:300, lineHeight:1.45, color:"white", margin:"0 0 24px", letterSpacing:"-0.01em" }}>
                  "For most of my life, I have lived inside rooms where I was expected to shrink."
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>I have experienced exclusion that was never formally announced but clearly enforced. I have been overlooked in spaces where my competence was visible. I have felt the quiet pressure to soften my voice, to dilute my identity, to make others comfortable by minimizing myself.</p>
                <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>Many in our diaspora know that feeling. The meeting where you are qualified but not affirmed. The platform where you are present but not centered.</p>
                <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>When I stopped seeking validation from systems that never intended to validate me fully, something shifted. Sankofa was born from that clarity.</p>
              </Reveal>
              <Reveal delay={0.26}>
                <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,.09)", margin:"22px 0" }} />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {["Love without apology","Stories with infrastructure","Intellect with discipline","Economic circulation with structure"].map(p => (
                    <div
                      key={p}
                      style={{ border:"1px solid rgba(201,162,39,.2)", borderRadius:10, padding:"12px 14px", fontSize:13, color:"rgba(255,255,255,.72)", background:"rgba(201,162,39,.04)", transition:"background .2s,border-color .2s", cursor:"default" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.10)"; el.style.borderColor="rgba(201,162,39,.42)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.04)"; el.style.borderColor="rgba(201,162,39,.20)" }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EDITORIAL PROCESS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Our Process</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>Editorial Review</h2>
            <p className="p" style={{ maxWidth:520, marginBottom:0 }}>All submissions undergo structured review. We communicate clearly. We decide definitively.</p>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginTop:28 }} className="threeCol">
            {[
              { num:"01", title:"Full Acceptance",        body:"Manuscript meets our standards and proceeds directly to agreement and production." },
              { num:"02", title:"Conditional Acceptance", body:"Strong potential — specific revisions or compliance adjustments required before publication." },
              { num:"03", title:"Rejection",              body:"Does not meet current standards. Revision and resubmission at a later date is always welcomed." },
            ].map(({ num, title, body: txt }, i) => (
              <Reveal key={num} delay={i * 0.1}>
                <div className="ps">
                  <div className={`pn ${display.className}`}>{num}</div>
                  <p style={{ fontWeight:600, fontSize:15, margin:"0 0 8px", color:"var(--ink)" }}>{title}</p>
                  <p className="p" style={{ fontSize:14, margin:0 }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p style={{ marginTop:22, fontSize:11, color:"rgba(11,11,12,.38)", letterSpacing:".06em" }}>
              REVIEW WINDOW: UP TO 45 DAYS &nbsp;·&nbsp; PROFESSIONAL COMMUNICATION THROUGHOUT
            </p>
          </Reveal>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          NARRATIVE SOVEREIGNTY
      ══════════════════════════════════════════ */}
      <section className="sec0" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <div className="card" style={{ background:"var(--ink)", border:"none", color:"white" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }} className="twoCol">
                <div>
                  <span className="kicker">Narrative Sovereignty</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(22px,2.2vw,32px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>Ownership &amp; Narrative Sovereignty</h2>
                  <p className="p" style={{ color:"rgba(255,255,255,.62)", fontSize:15 }}>The richest natural continent on Earth remains economically constrained not because of lack of resources, but because of extraction systems.</p>
                  <p className="p" style={{ color:"rgba(255,255,255,.62)", fontSize:15 }}>Aid without ownership becomes dependency. Development without control becomes rebranded colonization. Publishing intersects directly with this reality.</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:14, paddingTop:8 }}>
                  {["100% Copyright Retained","100% Royalty Earnings","Full IP Ownership","No rights acquisition"].map(item => (
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid rgba(255,255,255,.07)", paddingBottom:14 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#C9A227", display:"block", flexShrink:0 }} />
                      <span style={{ fontSize:14, fontWeight:500, color:"rgba(255,255,255,.82)" }}>{item}</span>
                    </div>
                  ))}
                  <p className="p" style={{ color:"rgba(255,255,255,.36)", fontSize:12, margin:0, letterSpacing:".02em" }}>
                    We receive only limited non-exclusive publishing and distribution permission under formal agreement.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — paper bg, image lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"48px 0 56px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "Strength begins with memory. Memory builds confidence.<br />Confidence builds unity. Unity builds power."
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
      <section
        className="sigSection"
        style={{ paddingTop: 90, paddingBottom: 120 }}
      >
        {/* ambient right glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 360px at 85% 50%,rgba(201,162,39,.07),transparent 70%)", pointerEvents:"none" }} />

        {/* CTA text — shifted right of the image */}
        <div
          className="pc"
          style={{
            position:"relative", zIndex:2,
            paddingLeft:"clamp(24px, 40vw, 500px)",
          }}
        >
          <Reveal>
            <span className="kicker">Ready to Build?</span>
            <h2
              className={display.className}
              style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}
            >
              We are for work that intends to endure.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              If your manuscript is prepared, disciplined, and aligned with intellectual responsibility — we invite you to submit.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/model">Learn About Our Model</a>
            </div>
          </Reveal>
        </div>

        {/* ── PAGE SIGNATURE IMAGE ──
            bottom:-110px pushes it well past the section edge into the footer.
            The section has overflow:visible so it's not clipped.
        */}
        <img
          src="/images/antique_writing.png"
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
