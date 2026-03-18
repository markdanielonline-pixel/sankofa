"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

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

  .policyText { font-size:15px; line-height:1.82; color:rgba(11,11,12,.72); margin:0 0 14px; }
  .policyText:last-child { margin-bottom:0; }

  .pRow { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.68); }
  .pRow:last-child { border-bottom:none; }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  .ptBand { background:var(--ink); padding:52px 0 44px; position:relative; overflow:hidden; }
  .ptBand::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,#C9A227,transparent 60%); }

  .grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  @keyframes ptFade { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  .ptA1 { animation:ptFade .7s ease both .10s; }
  .ptA2 { animation:ptFade .7s ease both .25s; }
  .ptA3 { animation:ptFade .7s ease both .40s; }

  .subHead { font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink); margin:28px 0 8px; }

  .sigSection { background:var(--ink); position:relative; overflow:visible; z-index:1; }
  .sigImg {
    position:absolute; bottom:-110px; left:-24px;
    width:660px; max-width:62vw;
    pointer-events:none; z-index:4;
    filter:drop-shadow(0 -16px 60px rgba(0,0,0,.60));
  }

  @media(max-width:900px){
    .twoCol { grid-template-columns:1fr !important; gap:24px !important; }
    .card { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

const sections = [
  { id: "commitment",    label: "Commitment to Clients" },
  { id: "why",          label: "Why No Refunds" },
  { id: "general",      label: "General Policy" },
  { id: "ghostwriting", label: "Ghostwriting" },
  { id: "creative",     label: "Creative Services" },
  { id: "revisions",    label: "Revisions" },
  { id: "deposits",     label: "Deposits & Delays" },
  { id: "subscriptions",label: "Subscriptions" },
  { id: "chargebacks",  label: "Chargebacks" },
  { id: "legal",        label: "Legal Compliance" },
]

export default function RefundPolicyPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Refund Policy · Sankofa Publishers" />

      {/* PAGE TITLE BAND */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Refund Policy
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Clear terms. No hidden conditions. Updated March 2026.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <section style={{ background:"var(--paper)", padding:"28px 0", borderBottom:"1px solid var(--line)" }}>
        <div className="pc">
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {sections.map(({ id, label }) => (
                <a
                  key={id} href={`#${id}`}
                  style={{
                    display:"inline-flex", alignItems:"center", padding:"7px 16px", borderRadius:999,
                    fontSize:12, fontWeight:600, letterSpacing:".04em",
                    border:"1px solid var(--line)", color:"rgba(11,11,12,.55)", background:"#fff",
                    textDecoration:"none", transition:"border-color .18s,color .18s,background .18s",
                  }}
                  onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="rgba(201,162,39,.5)"; el.style.color="#C9A227"; el.style.background="rgba(201,162,39,.06)" }}
                  onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="var(--line)"; el.style.color="rgba(11,11,12,.55)"; el.style.background="#fff" }}
                >{label}</a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ background:"var(--paper)", padding:"44px 0 0" }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:780, padding:"28px 32px", background:"#fff", border:"1px solid var(--line)", borderRadius:16, boxShadow:"0 4px 24px rgba(0,0,0,.04)" }}>
              <p className="policyText" style={{ margin:0 }}>
                At Sankofa Publishers, we provide high-touch, customized publishing and creative services — including ghostwriting, editing, manuscript development, publishing support, formatting, design, branding, and related services. Because our work is custom, labor-intensive, and begins immediately upon engagement, <strong>all payments are generally final and non-refundable once a project has begun</strong>, except where required by law or approved at our sole discretion.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* POLICY CONTENT */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:56, alignItems:"start" }} className="twoCol">

            {/* sticky sidebar */}
            <div style={{ position:"sticky", top:32 }}>
              <Reveal>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(11,11,12,.35)", margin:"0 0 14px" }}>On This Page</p>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {sections.map(({ id, label }) => (
                    <a
                      key={id} href={`#${id}`}
                      style={{ fontSize:13, color:"rgba(11,11,12,.50)", padding:"7px 12px", borderRadius:8, transition:"background .18s,color .18s,padding-left .18s", display:"block" }}
                      onMouseEnter={e=>{ const el=e.currentTarget; el.style.background="rgba(201,162,39,.08)"; el.style.color="#C9A227"; el.style.paddingLeft="16px" }}
                      onMouseLeave={e=>{ const el=e.currentTarget; el.style.background="transparent"; el.style.color="rgba(11,11,12,.50)"; el.style.paddingLeft="12px" }}
                    >{label}</a>
                  ))}
                </div>
                <div style={{ marginTop:28, padding:"16px", background:"var(--paper)", borderRadius:12, border:"1px solid var(--line)" }}>
                  <p style={{ fontSize:11, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color:"rgba(11,11,12,.4)", margin:"0 0 6px" }}>Billing Questions</p>
                  <a href="mailto:accounts@sankofapublishers.com" style={{ fontSize:12, color:"#C9A227", textDecoration:"none", lineHeight:1.6 }}>accounts@sankofapublishers.com</a>
                </div>
              </Reveal>
            </div>

            {/* content */}
            <div style={{ display:"flex", flexDirection:"column", gap:44 }}>

              {/* 1 */}
              <div id="commitment" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 01</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Commitment to Clients</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">We are committed to transparency, communication, and delivering high-quality results. Before any project begins, we ensure that clients understand the scope, process, and expectations.</p>
                  <p className="policyText">Once a project starts, our team allocates dedicated time, expertise, and internal resources specifically to that client. This commitment is the reason refunds are limited.</p>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 2 */}
              <div id="why" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 02</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Why Refunds Are Not Offered After Work Begins</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">Refunds are generally not provided once work has started because:</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:0, marginTop:12 }}>
                    {[
                      "Professional time, labor, and creative resources are immediately allocated",
                      "Project scheduling reserves capacity that cannot be reassigned",
                      "Research, planning, consultation, and development begin early in the process",
                      "Custom work cannot be returned, resold, or reversed",
                      "Digital and intellectual deliverables retain value once created",
                    ].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"rgba(201,162,39,.6)", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>—</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 3 */}
              <div id="general" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 03</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>General No-Refund Policy for Services</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">A service is considered "started" once any of the following occurs:</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:0, margin:"12px 0 18px" }}>
                    {[
                      "Project intake, consultation, or planning begins",
                      "Materials are reviewed or developed",
                      "A team member is assigned",
                      "Drafts, concepts, or production work begins",
                    ].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"rgba(201,162,39,.6)", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>—</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"16px 20px", background:"rgba(201,162,39,.06)", borderRadius:12, border:"1px solid rgba(201,162,39,.2)" }}>
                    <p style={{ fontSize:14, color:"var(--ink)", margin:0, lineHeight:1.7 }}>Once a service has started, <strong>payments are non-refundable</strong>.</p>
                  </div>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 4 */}
              <div id="ghostwriting" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 04</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Ghostwriting Services (Milestone-Based)</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">Ghostwriting projects are structured in phases:</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, margin:"16px 0 20px" }}>
                    {[
                      { phase:"Phase 1", desc:"Discovery, concept, and initial writing" },
                      { phase:"Phase 2", desc:"Continued manuscript development" },
                      { phase:"Phase 3", desc:"Final completion and delivery" },
                    ].map(({ phase, desc }) => (
                      <div key={phase} style={{ padding:"14px 16px", background:"var(--paper)", borderRadius:12, border:"1px solid var(--line)" }}>
                        <p style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"#C9A227", margin:"0 0 5px" }}>{phase}</p>
                        <p style={{ fontSize:13, color:"rgba(11,11,12,.65)", margin:0, lineHeight:1.6 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="policyText">Each phase is paid in advance and is non-refundable once started. Approval of a phase constitutes acceptance of that phase. Clients are not obligated to proceed to the next phase, but prior payments remain non-refundable.</p>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 5 */}
              <div id="creative" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 05</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Creative and Publishing Services</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">The following services are non-refundable once started:</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:0, margin:"12px 0 18px" }}>
                    {[
                      "Editing and proofreading",
                      "Formatting and interior layout",
                      "Cover design and branding",
                      "Publishing consultation and support",
                      "Manuscript review and coaching",
                      "Any custom publishing or creative service",
                    ].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"rgba(201,162,39,.6)", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>—</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="policyText">Refunds are not issued due to change of mind, project delay, subjective preference, or choosing another provider.</p>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 6 */}
              <div id="revisions" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 06</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Revisions</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">Where revisions are included, they exist to refine the work within scope. Revisions do not create eligibility for refunds.</p>
                  <p className="policyText">Once final approval or delivery is made, the service is considered complete and non-refundable.</p>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 7 */}
              <div id="deposits" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 07</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Deposits, Client Delays &amp; Digital Deliverables</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">Any deposit, booking fee, or advance payment used to secure time, resources, or scheduling is <strong>non-refundable</strong>.</p>
                  <p className="policyText">Client delays or non-responsiveness do not qualify for refunds. Projects may be paused or rescheduled, but payments for work performed remain non-refundable.</p>
                  <p className="policyText">All digital files, drafts, and completed work are non-refundable once delivered. Any third-party costs incurred on behalf of the client are non-refundable once incurred.</p>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 8 */}
              <div id="subscriptions" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 08</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Subscriptions</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:18 }}>
                    {[
                      "Billing is in advance",
                      "Clients may cancel anytime",
                      "Cancellation stops future billing only",
                      "No refunds are issued for active billing periods",
                      "No prorated refunds are provided",
                      "Annual subscriptions are non-refundable once billed or renewed",
                    ].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"rgba(201,162,39,.6)", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>—</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 9 — chargebacks */}
              <div id="chargebacks" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 09</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Refund Reviews &amp; Chargebacks</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">While refunds are generally not provided, clients may request a review by contacting <strong>accounts@sankofapublishers.com</strong>. Requests must include full details of the concern. All decisions are made at our sole discretion unless required by law.</p>
                  <p className="policyText">Clients agree to contact us first regarding any billing or service issue and must allow <strong>3–5 business days</strong> for response. Initiating a chargeback or contacting a financial institution before contacting us and allowing this time is considered a <strong>breach of this policy</strong>.</p>
                  <p className="policyText">We reserve the right to present project records, approvals, communications, and proof of work in response to any dispute.</p>
                  <div style={{ marginTop:18, padding:"16px 20px", background:"rgba(201,162,39,.06)", borderRadius:12, border:"1px solid rgba(201,162,39,.2)" }}>
                    <p style={{ fontSize:13, color:"rgba(11,11,12,.65)", margin:0, lineHeight:1.7 }}>Billing questions: <strong>accounts@sankofapublishers.com</strong> — we respond within 3–5 business days.</p>
                  </div>
                </Reveal>
              </div>

              <hr className="divLine" />

              {/* 10 */}
              <div id="legal" style={{ scrollMarginTop:80 }}>
                <Reveal>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:8 }}>Section 10</span>
                  <h2 className={display.className} style={{ fontSize:"clamp(20px,2.2vw,30px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.15, margin:"0 0 18px" }}>Legal Compliance</h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="policyText">Nothing in this policy overrides rights granted under applicable law. This policy is governed by the laws of the State of New Mexico, United States.</p>
                </Reveal>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CONTACT BAND */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Questions About This Policy</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
                We Answer Directly
              </h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,.62)", lineHeight:1.7, margin:"0 0 28px" }}>
                If you have a question about how this policy applies to your situation, or if you believe there has been a billing error, contact us directly. We respond to all billing inquiries within 3–5 business days.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <a className="btn btnP" href="mailto:accounts@sankofapublishers.com">Contact Billing</a>
                <a className="btn btnG" href="/policies">All Policies</a>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Billing & Refunds",  email:"accounts@sankofapublishers.com" },
                  { label:"General Questions",  email:"contact@sankofapublishers.com" },
                  { label:"Compliance",         email:"compliance@sankofapublishers.com" },
                ].map(({ label, email }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(255,255,255,.03)" }}
                    onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.07)"; el.style.borderColor="rgba(201,162,39,.25)" }}
                    onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(255,255,255,.03)"; el.style.borderColor="rgba(255,255,255,.08)" }}
                  >
                    <span style={{ fontSize:12, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", color:"rgba(255,255,255,.45)" }}>{label}</span>
                    <a href={`mailto:${email}`} style={{ fontSize:12, color:"rgba(201,162,39,.75)", transition:"color .18s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#C9A227")}
                      onMouseLeave={e=>(e.currentTarget.style.color="rgba(201,162,39,.75)")}
                    >{email}</a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="sigSection" style={{ paddingTop:90, paddingBottom:120 }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 360px at 85% 50%,rgba(201,162,39,.07),transparent 70%)", pointerEvents:"none" }} />
        <div className="pc ctaShift" style={{ position:"relative", zIndex:2, paddingLeft:"clamp(24px, 40vw, 500px)" }}>
          <Reveal>
            <span className="kicker">Ready to Work With Us?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              You know where we stand.<br />Now let us build together.
            </h2>
            <p style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15, lineHeight:1.7 }}>
              Submit your manuscript, request a service consultation, or reach out with any question.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/contact">Contact Us</a>
            </div>
          </Reveal>
        </div>
        <img
          src="/images/page_map.png"
          alt=""
          className="sigImg"
          style={{ transform:`translateY(${sigFloat}px)`, transition:"transform .04s linear" }}
        />
      </section>

    </main>
  )
}
