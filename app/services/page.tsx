"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS  ← identical on every page
═══════════════════════════════════════════════════════════ */

return [ref, visible] as const(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
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
   SERVICE CARD COMPONENT
═══════════════════════════════════════════════════════════ */
function ServiceCard({ kicker, title, price, description, includes, note }: {
  kicker: string; title: string; price: string
  description: string; includes: string[]; note?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 16,
        background: "#fff",
        overflow: "hidden",
        transition: "box-shadow .25s, transform .25s",
        boxShadow: open ? "0 16px 48px rgba(0,0,0,.10)" : "0 4px 20px rgba(0,0,0,.05)",
        transform: open ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* header — always visible */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "24px 24px 20px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase",
              color: "#C9A227", display: "block", marginBottom: 6,
              fontWeight: 600,
            }}>{kicker}</span>
            <h3 className={display.className} style={{
              fontSize: "clamp(17px,1.8vw,22px)", fontWeight: 400,
              letterSpacing: "-0.018em", lineHeight: 1.2,
              margin: "0 0 8px", color: "var(--ink)",
            }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(11,11,12,.58)", lineHeight: 1.5 }}>{description}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span className={display.className} style={{
              fontSize: "clamp(15px,1.6vw,19px)", fontWeight: 300,
              color: "#C9A227", display: "block", whiteSpace: "nowrap",
            }}>{price}</span>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 24, height: 24, borderRadius: "50%",
              border: "1px solid var(--line)", marginTop: 8,
              fontSize: 12, color: "rgba(11,11,12,.40)",
              transition: "transform .25s, border-color .25s",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
            }}>+</span>
          </div>
        </div>
      </div>

      {/* expanded content */}
      <div style={{
        maxHeight: open ? 600 : 0,
        overflow: "hidden",
        transition: "max-height .4s ease",
      }}>
        <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--line)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.35)", margin: "16px 0 12px" }}>What's Included</p>
          {includes.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 14, color: "rgba(11,11,12,.72)" }}>
              <span style={{ color: "#C9A227", fontWeight: 700, fontSize: 12, marginTop: 2, flexShrink: 0 }}>→</span>
              {item}
            </div>
          ))}
          {note && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(201,162,39,.06)", borderRadius: 10, border: "1px solid rgba(201,162,39,.2)", fontSize: 13, color: "rgba(11,11,12,.60)", lineHeight: 1.6 }}>
              {note}
            </div>
          )}
        </div>
      </div>
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
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:32px; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

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
export default function ServicesPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Professional Services · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Professional Services
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Every service strengthens the work. None of them open doors.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE PRINCIPLE
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">Our Service Principle</span>
                <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  Services Exist to Strengthen Work. Not to Open Doors.
                </h2>
                <p className="p">Sankofa Publishers does not sell publication. No service purchase guarantees acceptance. Our editorial decisions are made solely on manuscript quality and alignment with our publishing standards.</p>
                <p className="p" style={{ marginBottom:0 }}>Optional services exist because strong manuscripts sometimes need structural, technical, or strategic support before they are ready. We offer that support at transparent, professional rates.</p>
              </Reveal>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:"✕", label:"Services do not guarantee publication" },
                  { icon:"✕", label:"No upselling or pressure" },
                  { icon:"✕", label:"No mandatory service bundles" },
                  { icon:"→", label:"All rates are transparent and fixed" },
                  { icon:"→", label:"All work product belongs to the author" },
                  { icon:"→", label:"Editorial decisions are always independent" },
                ].map(({ icon, label }, i) => (
                  <Reveal key={label} delay={i * 0.06}>
                    <div style={{
                      display:"flex", alignItems:"center", gap:14,
                      padding:"13px 18px", borderRadius:12,
                      border:"1px solid var(--line)", background:"#fff",
                      transition:"box-shadow .2s,transform .2s",
                    }}
                      onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="0 8px 28px rgba(0,0,0,.07)"; el.style.transform="translateX(4px)" }}
                      onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="none"; el.style.transform="translateX(0)" }}
                    >
                      <span style={{ color: icon==="→" ? "#C9A227" : "rgba(201,162,39,.45)", fontWeight:700, fontSize:13, flexShrink:0 }}>{icon}</span>
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
          EDITORIAL SERVICES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Category 01</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Editorial Services
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Professional manuscript development from concept to publication-ready draft. Every stage is available independently.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:32 }} className="twoCol">
            {[
              {
                kicker: "Assessment",
                title: "Publishing Readiness Assessment",
                price: "$395 – $750",
                description: "Structured evaluation of manuscript before submission. Refundable if not accepted.",
                includes: ["Structural integrity review","Argument and narrative coherence analysis","Formatting and compliance check","Production viability assessment","AI disclosure verification","Risk and legal flagging","Written editorial report with recommendations"],
                note: "100% refundable if manuscript is submitted with PRA and not accepted. Selecting PRA does not guarantee acceptance.",
              },
              {
                kicker: "Development",
                title: "Developmental Editing",
                price: "$0.04 – $0.07 / word",
                description: "Deep structural work on argument, narrative arc, chapter flow, and thematic consistency.",
                includes: ["Full manuscript structural review","Chapter-by-chapter analysis","Narrative or argument arc reconstruction","Character or voice development (fiction)","Thematic consistency review","Detailed written editorial letter","One revision round included"],
                note: "Recommended for manuscripts at draft stage. Performed before line editing.",
              },
              {
                kicker: "Refinement",
                title: "Line Editing",
                price: "$0.02 – $0.04 / word",
                description: "Sentence-level clarity, rhythm, flow, and voice. Assumes sound structure.",
                includes: ["Sentence-level rewriting and tightening","Paragraph flow and transition work","Voice consistency review","Tone and register alignment","Clarity and precision corrections","Tracked changes returned in DOCX"],
              },
              {
                kicker: "Final Pass",
                title: "Proofreading",
                price: "$0.01 – $0.02 / word",
                description: "Final error elimination before production. Grammar, spelling, punctuation, consistency.",
                includes: ["Grammar and spelling correction","Punctuation and capitalization review","Formatting consistency check","Cross-reference and footnote verification","Final clean manuscript delivered"],
                note: "Proofreading assumes a fully edited manuscript. It is not a substitute for developmental or line editing.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          GHOSTWRITING
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Category 02</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Ghostwriting
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Full confidential manuscript development. Your ideas, knowledge, and voice — built into a publication-ready book under your name.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:32 }} className="twoCol">
            <Reveal delay={0.1}>
              <div className="card">
                <span className="kicker">Full Ghostwriting Service</span>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, margin:"8px 0 16px" }}>
                  <span className={display.className} style={{ fontSize:"clamp(32px,3vw,48px)", fontWeight:300, color:"#C9A227", lineHeight:1 }}>From $20,000</span>
                </div>
                <p className="p" style={{ fontSize:14 }}>Pricing based on project scope, research requirements, interview sessions, and manuscript length. Final scope determined after consultation.</p>
                {["Full project scoping consultation","Structured interview sessions","Research and source integration","Full manuscript development","Revision rounds included","Strict NDA and confidentiality agreement","Author retains 100% credit and rights"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:"1px solid var(--line)", fontSize:14, color:"rgba(11,11,12,.72)" }}>
                    <span style={{ color:"#C9A227", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>→</span>{item}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:20, height:"100%" }}>
                <div className="card" style={{ background:"var(--ink)", border:"none", color:"white" }}>
                  <span className="kicker">Confidentiality</span>
                  <p className="p" style={{ color:"rgba(255,255,255,.65)", fontSize:15, marginBottom:0 }}>All ghostwriting engagements are protected by a strict non-disclosure agreement. Sankofa will never disclose, reference, or claim involvement in the production of your manuscript. The work is yours. Completely.</p>
                </div>
                <div className="card">
                  <span className="kicker">Who Ghostwriting Serves</span>
                  {["Business leaders and executives with a story to tell","Academics with research that deserves broader reach","Community leaders and cultural figures","Authors with strong ideas but limited writing experience","Authors writing in a second language"].map(item => (
                    <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:"1px solid var(--line)", fontSize:14, color:"rgba(11,11,12,.72)" }}>
                      <span style={{ color:"#C9A227", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>→</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          DESIGN & PRODUCTION
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Category 03</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Design &amp; Production
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Production-grade design work that meets retail and distribution standards. All designed assets belong to the author.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              {
                kicker: "Visual Identity",
                title: "Cover Design",
                price: "$600 – $1,800",
                description: "Retail-standard cover design for paperback, hardcover, and eBook formats.",
                includes: ["Concept development and brand brief","2–3 initial design concepts","Full revision rounds","Print-ready and digital file formats","JPEG, PNG, PDF delivered","Author retains all files"],
              },
              {
                kicker: "Interior",
                title: "Interior Formatting",
                price: "$500 – $1,200",
                description: "Print-ready interior layout formatted to distribution specifications.",
                includes: ["Full interior layout design","Chapter heading and typography styling","Table of contents and index formatting","Print-ready PDF and eBook versions","Distribution platform compliance check"],
                note: "Pricing based on manuscript length and complexity.",
              },
              {
                kicker: "Audio",
                title: "Audiobook Production",
                price: "$3,000 – $10,000",
                description: "Professional audiobook recording, editing, and retail-ready mastering.",
                includes: ["Professional studio narration","Audio editing and mastering","Chapter segmentation","ACX, Findaway, and retail compliance","Distribution-ready final files delivered"],
                note: "Author may supply their own narration recording for editing-only service at reduced rate.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.09}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          MARKETING
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Category 04</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Marketing &amp; Visibility
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Strategic marketing built around your audience, your narrative, and your goals. No empty promises — measurable reach.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:32 }} className="twoCol">
            {[
              {
                kicker: "Campaign",
                title: "Launch Marketing Campaign",
                price: "$1,500 – $7,500",
                description: "Targeted pre-launch and launch period campaign. Strategy, creative, and execution.",
                includes: ["Audience research and targeting strategy","Press release writing and distribution","Social media content creation (4–8 weeks)","Email marketing sequence","Influencer and reviewer outreach","Campaign performance reporting"],
                note: "Campaigns are scoped and priced after strategy consultation. Final pricing based on audience size, platforms, and duration.",
              },
              {
                kicker: "Subscription",
                title: "Ongoing Marketing Retainer",
                price: "From $750 / month",
                description: "Consistent monthly visibility and audience growth support.",
                includes: ["Monthly content calendar and strategy","Social media management","Newsletter creation and distribution","Ongoing press and media outreach","Monthly performance report and review"],
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          CORPORATE & INSTITUTIONAL
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Category 05</span>
              <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
                Corporate &amp; Institutional Publishing
              </h2>
              <p className="p" style={{ color:"rgba(255,255,255,.65)" }}>Organizational histories, thought leadership books, policy documents, annual reports, and institutional white papers developed and produced to publication standard.</p>
              <p className="p" style={{ color:"rgba(255,255,255,.65)", marginBottom:24 }}>Custom scope, timeline, and pricing. All projects begin with a structured consultation to determine deliverables and investment.</p>
              <a className="btn btnP" href="/contact" style={{ display:"inline-flex" }}>Request Consultation →</a>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {["Organizational histories","Thought leadership books","Policy and position papers","Annual reports","White papers and research summaries","Institutional training materials","Conference proceedings","Executive memoir and biography"].map((item, i) => (
                  <div
                    key={item}
                    style={{ border:"1px solid rgba(255,255,255,.09)", borderRadius:12, padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,.65)", background:"rgba(255,255,255,.03)", transition:"background .2s,border-color .2s", cursor:"default" }}
                    onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.08)"; el.style.borderColor="rgba(201,162,39,.3)" }}
                    onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(255,255,255,.03)"; el.style.borderColor="rgba(255,255,255,.09)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — paper bg, book_chain.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "We do not sell publication.<br />We publish based on standard."
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
            <span className="kicker">Let's Talk</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Every strong book deserves professional support.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Tell us where your manuscript is. We will recommend only what it needs — nothing more.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/contact">Request a Consultation</a>
              <a className="btn btnG" href="/submissions">View Submission Paths</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — book_chain.png */}
        <img
          src="/images/book_chain.png"
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
