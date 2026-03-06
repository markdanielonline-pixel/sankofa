"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS
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
   SECTION ANCHOR COMPONENT
═══════════════════════════════════════════════════════════ */
function GovSection({ id, kicker, title, children }: {
  id: string; kicker: string; title: string; children: React.ReactNode
}) {
  return (
    <div id={id} style={{ scrollMarginTop: 80 }}>
      <Reveal>
        <span style={{
          fontSize: 9, fontWeight: 600, letterSpacing: ".26em",
          textTransform: "uppercase", color: "#C9A227",
          display: "block", marginBottom: 8,
        }}>{kicker}</span>
        <h2 className={display.className} style={{
          fontSize: "clamp(22px,2.4vw,34px)", fontWeight: 400,
          letterSpacing: "-0.022em", lineHeight: 1.1,
          margin: "0 0 20px",
        }}>{title}</h2>
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
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

  .p { font-size:15px; line-height:1.82; color:rgba(11,11,12,.72); margin:0 0 14px; }
  .p:last-child { margin-bottom:0; }
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:32px; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  .pRow { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.68); }
  .pRow:last-child { border-bottom:none; }

  .pRowDark { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.07); font-size:14px; color:rgba(255,255,255,.60); }
  .pRowDark:last-child { border-bottom:none; }

  /* governance pillar card */
  .pillar { border:1px solid var(--line); border-radius:16px; padding:24px 20px; background:#fff; position:relative; overflow:hidden; transition:box-shadow .25s,transform .25s; cursor:default; }
  .pillar::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#C9A227,#f5d878); transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
  .pillar:hover { box-shadow:0 16px 48px rgba(0,0,0,.10); transform:translateY(-4px); }
  .pillar:hover::before { transform:scaleX(1); }

  /* nav pill */
  .navPill { display:inline-flex; align-items:center; padding:7px 16px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:.04em; border:1px solid var(--line); color:rgba(11,11,12,.55); background:#fff; cursor:pointer; text-decoration:none; transition:border-color .18s,color .18s,background .18s; }
  .navPill:hover { border-color:rgba(201,162,39,.5); color:#C9A227; background:rgba(201,162,39,.06); }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }
  .highlight { padding:18px 22px; background:rgba(201,162,39,.06); border-radius:12px; border:1px solid rgba(201,162,39,.22); }

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
    .fourCol  { grid-template-columns:1fr 1fr !important; }
    .card, .pillar { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
    .sidebarLayout { grid-template-columns:1fr !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function GovernancePage() {
  const sigFloat = useFloat(9, 0.38)

  const sections = [
    { id:"institutional",  label:"Institutional Design" },
    { id:"leadership",     label:"Leadership" },
    { id:"decision",       label:"Decision Integrity" },
    { id:"editorial",      label:"Editorial Ethics" },
    { id:"compliance",     label:"Content Compliance" },
    { id:"conduct",        label:"Author Conduct" },
    { id:"financial",      label:"Financial Ethics" },
    { id:"conflict",       label:"Conflict of Interest" },
    { id:"confidentiality",label:"Confidentiality" },
    { id:"enforcement",    label:"Enforcement" },
  ]

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Governance · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:740 }}>
            Governance, Compliance<br />and Accountability
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              We publish with discipline because our community deserves institutions that take themselves seriously.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          OPENING STATEMENT
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">Why This Page Exists</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 16px" }}>
                  Governance Is Not a Formality Here
                </h2>
                <p className="p">Too many institutions that claim to serve communities operate without accountability structures. Decisions are made by whoever has the most power at any given moment. Standards are enforced selectively. Authors are left exposed.</p>
                <p className="p">Sankofa is built differently. We operate with defined roles, documented standards, and consistent decision pathways. Every person who works with us, every author who submits to us, and every community we serve deserves to know exactly how this institution operates and what it stands accountable for.</p>
                <p className="p">This page is not legal language designed to protect the press. It is a record of how we run ourselves and what you can hold us to.</p>
              </Reveal>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Authors",              desc:"Protected from exploitation, rights seizure, and financial opacity" },
                  { label:"Readers",              desc:"Protected from unvetted, irresponsible, or defamatory content" },
                  { label:"Cultural Integrity",   desc:"Protected from dilution, distortion, and commercial compromise" },
                  { label:"Editorial Independence", desc:"Protected from financial pressure and conflicts of interest" },
                  { label:"Operational Transparency", desc:"Protected from internal favoritism and undisclosed arrangements" },
                ].map(({ label, desc }, i) => (
                  <Reveal key={label} delay={i * 0.07}>
                    <div style={{ padding:"14px 18px", borderRadius:12, border:"1px solid var(--line)", background:"#fff", transition:"box-shadow .2s,transform .2s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)"; el.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateX(0)" }}
                    >
                      <p style={{ fontSize:12, fontWeight:700, color:"#C9A227", margin:"0 0 3px", letterSpacing:".06em", textTransform:"uppercase" }}>{label}</p>
                      <p style={{ fontSize:13, color:"rgba(11,11,12,.58)", margin:0, lineHeight:1.55 }}>{desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUICK NAV
      ══════════════════════════════════════════ */}
      <section style={{ background:"#fff", padding:"24px 0", borderBottom:"1px solid var(--line)", borderTop:"1px solid var(--line)" }}>
        <div className="pc">
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {sections.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="navPill">{label}</a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTENT — sidebar + body
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:56, alignItems:"start" }} className="sidebarLayout">

            {/* sticky sidebar */}
            <div style={{ position:"sticky", top:32 }}>
              <Reveal>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(11,11,12,.30)", margin:"0 0 14px" }}>Sections</p>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {sections.map(({ id, label }) => (
                    <a key={id} href={`#${id}`}
                      style={{ fontSize:13, color:"rgba(11,11,12,.48)", padding:"7px 12px", borderRadius:8, transition:"background .18s,color .18s,padding-left .18s", display:"block" }}
                      onMouseEnter={e=>{ const el=e.currentTarget; el.style.background="rgba(201,162,39,.08)"; el.style.color="#C9A227"; el.style.paddingLeft="16px" }}
                      onMouseLeave={e=>{ const el=e.currentTarget; el.style.background="transparent"; el.style.color="rgba(11,11,12,.48)"; el.style.paddingLeft="12px" }}
                    >{label}</a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* governance body */}
            <div style={{ display:"flex", flexDirection:"column", gap:48 }}>

              {/* INSTITUTIONAL DESIGN */}
              <GovSection id="institutional" kicker="Section 01" title="Institutional Design">
                <p className="p">Sankofa Publishers operates as a founder-led institution with advisory oversight. This structure was chosen deliberately. It allows for decisive leadership while ensuring that long-term direction is informed by expertise beyond any single perspective.</p>
                <p className="p">We operate with defined roles, documented standards, and consistent decision pathways. Nothing about how this press functions is improvised or left to informal arrangement. Every significant process has a documented standard. Every decision of consequence has a defined pathway.</p>
                <p className="p">This is not bureaucracy for its own sake. It is the kind of structure that allows a community institution to survive leadership transitions, resist external pressure, and maintain integrity under the kind of scrutiny that serious institutions invite.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:20 }} className="twoCol">
                  {[
                    { title:"Founder Led",           body:"Strategic direction, brand integrity, and final operational accountability rest with the Founder and Managing Director." },
                    { title:"Institutionally Advised", body:"An Advisory Board of multidisciplinary professionals provides strategic insight and ethical oversight." },
                    { title:"Standards Documented",   body:"Publishing standards, editorial criteria, and compliance requirements are documented and consistently applied." },
                    { title:"Decisions Defined",      body:"Every significant decision follows a defined pathway. There are no informal back channels for publishing outcomes." },
                  ].map(({ title, body: txt }) => (
                    <div key={title} className="pillar">
                      <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 8px" }}>{title}</p>
                      <p className="p" style={{ margin:0, fontSize:14 }}>{txt}</p>
                    </div>
                  ))}
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* LEADERSHIP */}
              <GovSection id="leadership" kicker="Section 02" title="Leadership">
                <p className="p">Sankofa Publishers is led by Mark Daniel, Founder and Managing Director. He carries final accountability for every dimension of the press: strategic direction, brand integrity, publishing standards, institutional relationships, and operational outcomes.</p>
                <p className="p">Founder-led does not mean unchecked. The Advisory Board provides counsel on long-term structural decisions. Documented standards constrain editorial and operational behavior. And the commitments made publicly on this site and in our publishing agreements are legally and ethically binding.</p>
                <p className="p">Mark's background spans pastoral leadership, cultural analysis, religious deconstruction, and organizational management. He built Sankofa from a conviction that African and diasporic communities deserve publishing infrastructure that does not ask them to compromise their identity in exchange for access.</p>
                <div className="highlight" style={{ marginTop:20 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:"var(--ink)", margin:"0 0 6px" }}>Leadership Responsibilities</p>
                  <div style={{ display:"flex", flexDirection:"column" }}>
                    {["Strategic direction and long-term positioning","Brand integrity and cultural alignment","Publishing standards and editorial oversight","Institutional growth and partnership decisions","Final operational accountability"].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"#C9A227", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* DECISION INTEGRITY */}
              <GovSection id="decision" kicker="Section 03" title="Decision Integrity">
                <p className="p">The single most important structural commitment Sankofa makes is the complete separation between editorial decisions and revenue activities.</p>
                <p className="p">An author who purchases editing, design, or marketing services from us receives exactly the same editorial review as an author who purchases nothing. Service revenue does not earn favorable editorial consideration. It never has and it never will.</p>
                <p className="p">This is not just a policy statement. It is operationally enforced. The people who evaluate manuscripts are not the people who manage service sales. These functions are separated by design so that financial incentives cannot contaminate editorial judgment.</p>
                <p className="p">We do not sell publication. We publish based on standard. If that standard cannot be maintained, we will say no to revenue before we compromise it.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:20 }} className="twoCol">
                  <div className="highlight">
                    <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"#C9A227", margin:"0 0 10px" }}>Editorial Decisions Are Based On</p>
                    {["Quality of writing","Coherence and structure","Cultural responsibility","Production readiness","Ethical alignment"].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"#C9A227", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>→</span>
                        <span style={{ fontSize:14 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"18px 22px", background:"rgba(11,11,12,.03)", borderRadius:12, border:"1px solid var(--line)" }}>
                    <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.35)", margin:"0 0 10px" }}>Editorial Decisions Are Never Based On</p>
                    {["Service purchase history","Financial contribution","Personal relationships","Commercial potential alone","External pressure of any kind"].map(item => (
                      <div key={item} className="pRow">
                        <span style={{ color:"rgba(201,162,39,.45)", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>✕</span>
                        <span style={{ fontSize:14 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* EDITORIAL ETHICS */}
              <GovSection id="editorial" kicker="Section 04" title="Editorial Ethics">
                <p className="p">Editorial ethics at Sankofa are grounded in three principles: intellectual rigor, cultural integrity, and standards-based acceptance. These are not aspirational values. They are the criteria by which every manuscript is evaluated.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>Intellectual Rigor</p>
                <p className="p">We welcome strong ideas, difficult arguments, and work that challenges received wisdom. We are not afraid of controversy when it is grounded in evidence and honest intent. We ask only that claims be made responsibly, that logic be coherent, and that the purpose of the work be constructive or analytically serious. We do not publish content whose only purpose is to provoke.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>Cultural Integrity</p>
                <p className="p">Sankofa exists to serve African and diasporic communities. Cultural grounding is not exclusion. It is responsibility. Work that engages our communities with seriousness, honesty, and care will find a home here. Work that extracts, distorts, or condescends will not.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>Standards-Based Acceptance</p>
                <p className="p">Every manuscript is evaluated against the same documented criteria. We do not lower the bar for authors with platforms. We do not raise it for authors without them. The work is the measure.</p>
              </GovSection>

              <hr className="divLine" />

              {/* CONTENT COMPLIANCE */}
              <GovSection id="compliance" kicker="Section 05" title="Content Integrity and Compliance">
                <p className="p">Submissions to Sankofa are subject to content review for originality, accuracy, and compliance with our publishing standards. Authors bear responsibility for the content they submit. We provide the infrastructure. The integrity of the work belongs to the author.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>Plagiarism and Originality</p>
                <p className="p">All submitted work must be original or properly licensed. Manuscripts may be screened using plagiarism detection tools. If plagiarism is identified before publication, the submission is rejected. If it is identified after publication, the publishing agreement is terminated and distribution is suspended. There are no exceptions to this.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>AI Usage Disclosure</p>
                <p className="p">Authors may use AI assistance in their writing process. This is not prohibited. It must be disclosed at the time of submission. Authors who submit undisclosed AI-generated content are treated the same as authors who submit plagiarized material. Transparency is required because it protects both parties. An institution that accepts undisclosed AI content loses the ability to vouch for the integrity of its catalog.</p>

                <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"rgba(11,11,12,.40)", margin:"18px 0 10px" }}>Defamation and Legal Risk</p>
                <p className="p">We do not publish defamatory or slanderous material. Work that includes allegations about real people or real events may require documentation, legal review, or clarifying language before publication proceeds. Authors bear the cost of any required legal review. Sankofa reserves the right to decline works that carry significant legal exposure regardless of their literary or analytical merit.</p>

                <div className="highlight" style={{ marginTop:20 }}>
                  <p style={{ fontSize:13, color:"rgba(11,11,12,.65)", margin:0, lineHeight:1.75 }}>
                    Compliance is not bureaucracy. It is the structure that keeps this press trustworthy. A press that can be trusted is a press that lasts. That is what this community deserves.
                  </p>
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* AUTHOR CONDUCT */}
              <GovSection id="conduct" kicker="Section 06" title="Author Ethics and Professional Conduct">
                <p className="p">Publishing is a professional relationship. Sankofa brings its full institutional capacity to every author we accept. We expect authors to bring the same professional commitment in return.</p>
                <p className="p">This is not about formality. It is about the kind of working relationship that produces good books. Authors who communicate clearly, meet their commitments, and engage with editorial feedback honestly produce better work. That outcome serves the author, it serves readers, and it serves the community whose stories we are building a record of.</p>
                <div style={{ marginTop:20 }}>
                  {[
                    { req:"Respectful communication",     desc:"At all times and with all members of the Sankofa team. We do not tolerate harassment, threats, or abusive conduct in any direction." },
                    { req:"Deadline integrity",           desc:"Agreed timelines exist to protect the quality of the work. Authors who cannot meet a deadline are expected to communicate early, not after the fact." },
                    { req:"Editorial responsiveness",     desc:"Authors who receive editorial requests are expected to respond within a reasonable timeframe. Silence is not a response." },
                    { req:"Content risk disclosure",      desc:"Authors must disclose known legal, factual, or reputational risks in their manuscript at the time of submission." },
                    { req:"Contractual compliance",       desc:"Publishing agreements are binding. Authors who enter an agreement are expected to honor its terms for the duration of the agreement." },
                  ].map(({ req, desc }) => (
                    <div key={req} style={{ padding:"16px 0", borderBottom:"1px solid var(--line)" }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"var(--ink)", margin:"0 0 4px" }}>{req}</p>
                      <p style={{ fontSize:14, color:"rgba(11,11,12,.60)", margin:0, lineHeight:1.65 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* FINANCIAL ETHICS */}
              <GovSection id="financial" kicker="Section 07" title="Royalty and Financial Ethics">
                <p className="p">Sankofa's financial relationship with authors is built on one principle: your money belongs to you. We do not take a percentage of author earnings. We do not use royalty payments as leverage. We do not create financial structures designed to obscure what authors are actually earning.</p>
                <p className="p">Net royalties are calculated as gross retail sales minus retailer fees, distribution fees, per-unit printing costs, and payment processing fees. Every deduction is reported. Every line is visible. Authors who subscribe to the Author Portal can see this in real time. Authors on standard reporting receive a full breakdown every six months.</p>
                <p className="p">We will never introduce a new deduction without prior written notice to affected authors. Financial opacity is one of the oldest mechanisms of exploitation in the publishing industry. We have designed our systems specifically to prevent it.</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginTop:20 }} className="threeCol">
                  {[
                    { stat:"100%", label:"Copyright retained" },
                    { stat:"100%", label:"Royalties to author" },
                    { stat:"100%", label:"IP ownership" },
                  ].map(({ stat, label }) => (
                    <div key={label} style={{ border:"1px solid var(--line)", borderRadius:14, padding:"20px", textAlign:"center", transition:"box-shadow .2s,transform .2s", cursor:"default" }}
                      onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="0 10px 36px rgba(0,0,0,.08)"; el.style.transform="translateY(-3px)" }}
                      onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="none"; el.style.transform="translateY(0)" }}
                    >
                      <span className={display.className} style={{ fontSize:40, fontWeight:300, color:"#C9A227", display:"block", lineHeight:1, marginBottom:8 }}>{stat}</span>
                      <span style={{ fontSize:12, color:"rgba(11,11,12,.50)", letterSpacing:".04em" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* CONFLICT OF INTEREST */}
              <GovSection id="conflict" kicker="Section 08" title="Conflict of Interest">
                <p className="p">Conflicts of interest are a reality in any institution. The question is not whether they will arise. The question is whether the institution has a clear policy for handling them when they do.</p>
                <p className="p">Sankofa avoids conflicts of interest in manuscript evaluation, service recommendations, vendor selection, and partnership decisions. Where a conflict exists or is reasonably perceived to exist, we follow a defined protocol.</p>
                <div style={{ marginTop:20 }}>
                  {[
                    { step:"Disclose",  desc:"The conflict is acknowledged and documented. Relevant parties are informed where appropriate." },
                    { step:"Recuse",    desc:"Decision makers with a conflict are removed from the relevant decision. A separate party makes the determination." },
                    { step:"Prioritize", desc:"When disclosure and recusal are insufficient to resolve the conflict, institutional integrity takes precedence over any individual or financial interest." },
                  ].map(({ step, desc }, i) => (
                    <div key={step} style={{ display:"flex", gap:20, padding:"18px 0", borderBottom:"1px solid var(--line)", alignItems:"flex-start" }}>
                      <span className={display.className} style={{ fontSize:36, fontWeight:300, color:"rgba(201,162,39,.25)", lineHeight:1, flexShrink:0, width:36, transition:"color .3s" }}
                        onMouseEnter={e=>(e.currentTarget.style.color="rgba(201,162,39,.6)")}
                        onMouseLeave={e=>(e.currentTarget.style.color="rgba(201,162,39,.25)")}
                      >0{i+1}</span>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700, color:"var(--ink)", margin:"0 0 5px" }}>{step}</p>
                        <p style={{ fontSize:14, color:"rgba(11,11,12,.60)", margin:0, lineHeight:1.65 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GovSection>

              <hr className="divLine" />

              {/* CONFIDENTIALITY */}
              <GovSection id="confidentiality" kicker="Section 09" title="Privacy and Confidentiality">
                <p className="p">Every manuscript submitted to Sankofa is treated as confidential from the moment of receipt. We do not share manuscripts with outside parties, discuss their content publicly, or reference submitted work in any external communication without the author's written permission.</p>
                <p className="p">Ghostwriting engagements are protected by written non-disclosure agreements. The NDA is mutual and permanent. Sankofa will never disclose involvement in a ghostwriting project under any circumstance.</p>
                <p className="p">Author personal data including names, contact details, banking information, and manuscript files are handled using secure operational practices and verified third-party processors. We collect only the information required to deliver our services. We do not sell author data. We do not share it with marketing partners.</p>
                <p className="p">Authors and users may request access to, correction of, or deletion of their data at any time by contacting compliance@sankofapublishers.com.</p>
              </GovSection>

              <hr className="divLine" />

              {/* ENFORCEMENT */}
              <GovSection id="enforcement" kicker="Section 10" title="Enforcement and Remedies">
                <p className="p">Standards without enforcement are suggestions. Sankofa treats its governance commitments as binding. When they are violated, there are defined consequences. This applies to authors, partners, service vendors, and to Sankofa itself.</p>
                <p className="p">When authors violate our publishing standards through plagiarism, undisclosed AI usage, defamatory content, or breach of professional conduct, Sankofa reserves the right to reject submissions, suspend distribution, or terminate publishing agreements. We communicate the reason directly.</p>
                <p className="p">When Sankofa fails to meet its own commitments to authors, those authors have the right to raise the matter in writing to compliance@sankofapublishers.com. We investigate all credible complaints. We respond within ten business days. If we have made an error, we say so directly and correct it.</p>
                <p className="p">No institution is above accountability. Sankofa certainly is not. We have built these structures because we intend to be held to them.</p>
                <div className="highlight" style={{ marginTop:20 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:"var(--ink)", margin:"0 0 8px" }}>Closing Standard</p>
                  <p style={{ fontSize:15, color:"rgba(11,11,12,.68)", margin:0, lineHeight:1.82, fontStyle:"italic" }}>
                    We publish with discipline because our history deserves seriousness. We do not rush record. We do not dilute legacy. We build infrastructure that outlives trend. And we hold ourselves accountable to the community this press exists to serve.
                  </p>
                </div>
              </GovSection>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ACCOUNTABILITY CONTACT  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Hold Us Accountable</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
                Governance Only Works If Someone Enforces It
              </h2>
              <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>
                If you believe Sankofa has failed to meet a standard documented on this page, we want to know. Send a detailed written account to our compliance contact. Include dates, relevant documentation, and the specific standard you believe was not met.
              </p>
              <p className="p" style={{ color:"rgba(255,255,255,.62)", marginBottom:28 }}>
                We investigate every credible complaint. We respond within ten business days. We do not dismiss concerns because they are inconvenient.
              </p>
              <a className="btn btnP" href="mailto:compliance@sankofapublishers.com">
                Contact Compliance
              </a>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Compliance and Ethics",      email:"compliance@sankofapublishers.com" },
                  { label:"Author Rights Concerns",     email:"authors@sankofapublishers.com" },
                  { label:"Editorial Decisions",        email:"submissions@sankofapublishers.com" },
                  { label:"Financial Transparency",     email:"authors@sankofapublishers.com" },
                  { label:"General Governance",         email:"contact@sankofapublishers.com" },
                ].map(({ label, email }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(255,255,255,.03)", transition:"background .2s,border-color .2s" }}
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

      {/* ══════════════════════════════════════════
          QUOTE STRIP — book_crown.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.55, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "We do not rush record. We do not dilute legacy.<br />We build infrastructure that outlives trend."
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
            <span className="kicker">Ready to Work With Us?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              A press that holds itself accountable is a press you can trust.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Submit your manuscript, read our policies, or reach out directly. We are here and we answer directly.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/policies">Read Our Policies</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — book_crown.png */}
        <img
          src="/images/book_crown.png"
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
