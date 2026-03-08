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
   PATH SELECTOR COMPONENT
═══════════════════════════════════════════════════════════ */
function PathSelector() {
  const [active, setActive] = useState<"A" | "B">("A")

  return (
    <div>
      {/* Toggle */}
      <div style={{
        display: "inline-flex",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: 4,
        background: "#fff",
        marginBottom: 32,
        gap: 4,
      }}>
        {(["A", "B"] as const).map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".04em",
              transition: "background .22s, color .22s, box-shadow .22s",
              background: active === p ? "#C9A227" : "transparent",
              color: active === p ? "#140F05" : "rgba(11,11,12,.50)",
              boxShadow: active === p ? "0 4px 16px rgba(201,162,39,.30)" : "none",
            }}
          >
            {p === "A" ? "Path A — Publication Ready" : "Path B — Needs Support"}
          </button>
        ))}
      </div>

      {/* Path A */}
      {active === "A" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="twoCol">
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <span className="kicker">Path A · Who This Is For</span>
              <p className="p">For authors who believe their manuscript is fully edited, structurally sound, and production ready. You may submit directly for editorial review or optionally request a Publishing Readiness Assessment.</p>
              <p className="p" style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 0 }}>Publishing is free for manuscripts that meet our standards.</p>
            </div>

            <div className="card">
              <span className="kicker">We Consider</span>
              {["Fiction and non-fiction across genres", "Cultural, analytical, investigative, or literary work", "Controversial but structured critique", "Fully edited manuscripts", "Authors holding full rights"].map(item => (
                <div key={item} className="cr">
                  <span style={{ color: "#C9A227", fontWeight: 700, fontSize: 13, marginTop: 1, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 14 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <span className="kicker" style={{ marginBottom: 10 }}>We Do Not Consider</span>
                {["Incomplete drafts", "Undisclosed AI-generated content", "Defamatory or slanderous material", "Hate speech", "Faith-based doctrinal promotion"].map(item => (
                  <div key={item} className="cr" style={{ color: "rgba(11,11,12,.60)" }}>
                    <span style={{ color: "rgba(201,162,39,.45)", fontWeight: 700, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <span className="kicker">Required Materials</span>
              {[
                { item: "Full manuscript", note: "DOCX format" },
                { item: "Short synopsis", note: "300–500 words" },
                { item: "Author biography", note: "150–250 words" },
                { item: "Completed submission form", note: "Below" },
              ].map(({ item, note }) => (
                <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{item}</span>
                  <span style={{ fontSize: 12, color: "rgba(11,11,12,.42)", letterSpacing: ".02em" }}>{note}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ border: "1px solid rgba(201,162,39,.3)", background: "rgba(201,162,39,.03)" }}>
              <span className="kicker">Optional Add-On</span>
              <p style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", margin: "0 0 8px" }}>Publishing Readiness Assessment</p>
              <p className="p" style={{ fontSize: 14 }}>Structural analysis, formatting compliance, editorial consistency check, production viability, risk flagging. Written report included.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
                <span className={display.className} style={{ fontSize: 28, fontWeight: 300, color: "#C9A227" }}>$395</span>
                <span style={{ fontSize: 13, color: "rgba(11,11,12,.50)" }}>– $750 by length</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(11,11,12,.50)", margin: 0, lineHeight: 1.6 }}>
                100% refundable if manuscript is not accepted. Selecting this option does not guarantee acceptance.
              </p>
            </div>

            <div className="card">
              <span className="kicker">Review Timeline</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <span className={display.className} style={{ fontSize: 52, fontWeight: 300, color: "#C9A227", lineHeight: 1 }}>45</span>
                <span style={{ fontSize: 14, color: "rgba(11,11,12,.60)" }}>days maximum<br />review window</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Full Acceptance — proceeds to agreement", "Conditional Acceptance — revisions required", "Rejection — resubmission welcomed"].map(o => (
                  <div key={o} style={{ fontSize: 13, color: "rgba(11,11,12,.65)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#C9A227", flexShrink: 0, marginTop: 1 }}>·</span>{o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Path B */}
      {active === "B" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="twoCol">
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <span className="kicker">Path B · Who This Is For</span>
              <p className="p">For authors seeking professional support before submission. Using our services does not guarantee publication — but it ensures your preparation aligns with our publishing standards.</p>
            </div>
            <div className="card">
              <span className="kicker">Available Services</span>
              {[
                { s: "Publishing Readiness Assessment", p: "$395–$750" },
                { s: "Developmental Editing",           p: "$0.04–$0.07/word" },
                { s: "Line Editing",                    p: "$0.02–$0.04/word" },
                { s: "Proofreading",                    p: "$0.01–$0.02/word" },
                { s: "Ghostwriting",                    p: "From $20,000" },
                { s: "Cover Design",                    p: "$600–$1,800" },
                { s: "Interior Formatting",             p: "$500–$1,200" },
                { s: "Audiobook Production",            p: "$3,000–$10,000" },
                { s: "Marketing Campaign",              p: "$1,500–$7,500" },
                { s: "Corporate / Institutional",       p: "Custom" },
              ].map(({ s, p }) => (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                  <span style={{ color: "var(--ink)" }}>{s}</span>
                  <span style={{ fontSize: 12, color: "#C9A227", fontWeight: 600, letterSpacing: ".02em" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <span className="kicker">Project Stage</span>
              <p className="p" style={{ fontSize: 14 }}>Select the stage that best describes your manuscript:</p>
              {["Idea only", "Outline only", "Partial draft", "Full draft but unedited", "Full draft but needs improvement"].map(stage => (
                <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 14, color: "rgba(11,11,12,.72)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(201,162,39,.4)", flexShrink: 0 }} />
                  {stage}
                </div>
              ))}
            </div>

            <div className="card" style={{ background: "var(--ink)", border: "none", color: "white" }}>
              <span className="kicker">Our Commitment</span>
              <p className="p" style={{ color: "rgba(255,255,255,.65)", fontSize: 14, marginBottom: 0 }}>
                We do not upsell. We do not pressure authors into unnecessary services. If your manuscript is ready, we will say so. If you require support, we will recommend only what strengthens the work.
              </p>
              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,.09)", margin: "18px 0" }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>
                We advise. We do not exploit.
              </p>
            </div>

            <a className="btn btnP" href="/services" style={{ justifyContent: "center", fontSize: 14 }}>
              View Full Services &amp; Pricing →
            </a>
          </div>
        </div>
      )}
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

  .btn  { display:inline-flex; align-items:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  .cr { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); transition:padding-left .18s,color .18s; cursor:default; }
  .cr:hover { padding-left:4px; }
  .cr:last-child { border-bottom:none; }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }

  /* compliance checklist */
  .checkItem { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.72); }
  .checkItem:last-child { border-bottom:none; }
  .checkBox { width:18px; height:18px; border-radius:4px; border:1.5px solid rgba(201,162,39,.5); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; background:rgba(201,162,39,.05); }

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
export default function SubmissionsPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Submissions · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:680 }}>
            Submit Your Manuscript
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              "We were whole before we were scattered."
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TWO PATHWAYS INTRO
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Two Pathways</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Sankofa Serves Authors at Every Stage
            </h2>
            <p className="p" style={{ maxWidth:580, marginBottom:0 }}>
              Select the pathway that best describes your manuscript. Both paths lead to the same standard — only the starting point differs.
            </p>
          </Reveal>

          {/* pathway cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:32 }} className="twoCol">
            {[
              {
                label: "Path A",
                title: "Publication Ready",
                body: "Your manuscript is fully edited, structurally sound, and production ready. Submit directly for editorial review at no cost.",
                tag: "Free to submit",
                tagColor: "rgba(201,162,39,.12)",
                tagText: "#C9A227",
              },
              {
                label: "Path B",
                title: "Needs Professional Support",
                body: "Your manuscript requires editing, ghostwriting, structural development, cover design, formatting, or marketing support before submission.",
                tag: "Services available",
                tagColor: "rgba(11,11,12,.05)",
                tagText: "rgba(11,11,12,.50)",
              },
            ].map(({ label, title, body: txt, tag, tagColor, tagText }) => (
              <Reveal key={label} delay={label === "Path A" ? 0.1 : 0.2}>
                <div className="card" style={{ height:"100%", position:"relative" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <span style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"#C9A227" }}>{label}</span>
                    <span style={{ fontSize:11, padding:"4px 10px", borderRadius:999, background:tagColor, color:tagText, fontWeight:600, letterSpacing:".04em" }}>{tag}</span>
                  </div>
                  <h3 className={display.className} style={{ fontSize:"clamp(20px,2vw,26px)", fontWeight:400, letterSpacing:"-0.018em", lineHeight:1.2, margin:"0 0 12px", color:"var(--ink)" }}>{title}</h3>
                  <p className="p" style={{ fontSize:14, marginBottom:0 }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          INTERACTIVE PATH SELECTOR
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Choose Your Path</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 24px" }}>
              Submission Details
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <PathSelector />
          </Reveal>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          PLAGIARISM & INTEGRITY
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }} className="twoCol">
            <Reveal>
              <span className="kicker">Integrity Review</span>
              <h2 className={display.className} style={{ fontSize:"clamp(22px,2.2vw,32px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Plagiarism &amp; Originality
              </h2>
              <p className="p">All manuscripts may undergo plagiarism detection and originality screening. Submission confirms that the work is original, you hold full rights, and all referenced material is properly cited.</p>
              <p className="p">Violation may result in immediate rejection or termination of agreement.</p>

              <div style={{ marginTop:20, padding:"16px 20px", background:"rgba(201,162,39,.07)", border:"1px solid rgba(201,162,39,.22)", borderRadius:12 }}>
                <span className="kicker" style={{ marginBottom:8 }}>AI Disclosure Policy</span>
                <p className="p" style={{ fontSize:14, marginBottom:0 }}>AI-assisted content is permitted if fully disclosed at submission. Failure to disclose may result in rejection or termination after publication if discovered later. Transparency protects both author and publisher.</p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <span className="kicker">Manuscript Protection</span>
              <h2 className={display.className} style={{ fontSize:"clamp(22px,2.2vw,32px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Your Work Is Protected
              </h2>
              <p className="p">All submitted manuscripts are treated as confidential. Sankofa Publishers adheres to U.S. copyright law and international intellectual property standards.</p>
              <p className="p">We do not claim ownership of submitted work absent a signed agreement. Submission does not transfer rights.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:20 }}>
                {["Manuscripts treated as confidential","Submission does not transfer rights","No ownership claimed without signed agreement","U.S. copyright law and international IP standards observed"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#C9A227", flexShrink:0 }} />
                    <span style={{ fontSize:14, color:"rgba(11,11,12,.72)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO SHOULD NOT SUBMIT  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Please Do Not Submit If</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 20px", color:"white" }}>
                This Press Is Not for Everyone
              </h2>
              {["You are seeking guaranteed publication without review","You are unwilling to engage in revision if required","You intend to submit plagiarized or undisclosed AI-generated content","You expect publication to override professional standards","You are not prepared to meet agreed deadlines and professional conduct"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.07)", fontSize:14, color:"rgba(255,255,255,.65)" }}>
                  <span style={{ color:"rgba(201,162,39,.5)", fontWeight:700, marginTop:1, flexShrink:0 }}>✕</span>
                  {item}
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ padding:"36px", border:"1px solid rgba(201,162,39,.2)", borderRadius:20, background:"rgba(201,162,39,.04)" }}>
                <p className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:300, lineHeight:1.45, color:"white", margin:"0 0 20px", letterSpacing:"-0.01em" }}>
                  "We publish work that intends to endure beyond market cycles and beyond distortion."
                </p>
                <span style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(201,162,39,.6)" }}>Sankofa Publishers</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — paper bg, bird.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "If you have ever felt the pressure to minimize your voice,<br />this press exists so you do not have to."
              </p>
              <span style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(11,11,12,.35)" }}>
                Mark Daniel · Founder, Sankofa Publishers
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
            <span className="kicker">Ready?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Your manuscript deserves infrastructure.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Select your path and begin. Up to 45 days structured review. Clear decisions. Professional communication.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/auth/signup">Submit Publication Ready Manuscript</a>
              <a className="btn btnG" href="/auth/signup">Request Services Consultation</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — bird.png */}
        <img
          src="/images/bird.png"
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
