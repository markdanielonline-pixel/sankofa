"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS  ← identical on every page
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

  /* topic badge */
  .badge { display:inline-flex; align-items:center; padding:5px 12px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.04em; border:1px solid rgba(201,162,39,.35); color:#C9A227; background:rgba(201,162,39,.07); transition:background .18s,border-color .18s; cursor:default; }
  .badge:hover { background:rgba(201,162,39,.14); border-color:rgba(201,162,39,.6); }

  /* media contact card */
  .contactCard { border:1px solid var(--line); border-radius:16px; padding:24px; background:#fff; transition:box-shadow .22s,transform .22s; }
  .contactCard:hover { box-shadow:0 12px 40px rgba(0,0,0,.08); transform:translateY(-3px); }

  /* press asset row */
  .assetRow { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--line); transition:padding-left .18s; cursor:default; }
  .assetRow:hover { padding-left:5px; }
  .assetRow:last-child { border-bottom:none; }

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
export default function MediaPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Media · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Media &amp; Press
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Resources, contacts, and context for journalists and media professionals.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO WE ARE FOR MEDIA
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">For the Press</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  Sankofa Publishers in Brief
                </h2>
                <p className="p">Sankofa Publishers is a hybrid publishing house founded in New Mexico, built on more than 47 years of combined experience. We specialize in African and diasporic narrative — fiction, non-fiction, investigative writing, memoir, cultural analysis, and strategic thought.</p>
                <p className="p" style={{ marginBottom:0 }}>We publish at no cost to authors. Authors retain 100% of copyright, royalties, and intellectual property. We are standards-based, not volume-based — every title is accepted through structured editorial review.</p>
              </Reveal>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Founded",       value:"2025 · Santa Fe, New Mexico" },
                  { label:"Focus",         value:"African & diasporic narrative" },
                  { label:"Model",         value:"Hybrid · Standards-based · Free to authors" },
                  { label:"Rights",        value:"100% retained by author" },
                  { label:"Distribution",  value:"Global · Print & Digital" },
                  { label:"Press Contact", value:"press@sankofapublishers.com" },
                ].map(({ label, value }, i) => (
                  <Reveal key={label} delay={i * 0.07}>
                    <div style={{ display:"flex", gap:16, padding:"11px 0", borderBottom:"1px solid var(--line)", alignItems:"flex-start" }}>
                      <span style={{ fontSize:10, fontWeight:600, letterSpacing:".14em", textTransform:"uppercase", color:"#C9A227", minWidth:100, paddingTop:2 }}>{label}</span>
                      <span style={{ fontSize:14, color:"rgba(11,11,12,.72)", lineHeight:1.5 }}>{value}</span>
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
          INTERVIEW TOPICS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Available for Interview</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Topics &amp; Areas of Expertise
            </h2>
            <p className="p" style={{ maxWidth:580, marginBottom:28 }}>
              Mark Daniel, Founder and Managing Director, is available for media interviews, podcast appearances, panel discussions, and speaking engagements on the following topics.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:48 }}>
              {[
                "African diaspora narrative",
                "Publishing equity and access",
                "Author rights and ownership",
                "Cultural sovereignty through publishing",
                "Hybrid publishing models",
                "Economic empowerment through narrative",
                "Decolonization of publishing",
                "Institutional exclusion and creative resistance",
                "African intellectual history",
                "Black-owned publishing infrastructure",
                "Narrative as economic tool",
                "Religious deconstruction and cultural identity",
              ].map(topic => (
                <span key={topic} className="badge">{topic}</span>
              ))}
            </div>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }} className="twoCol">
            <Reveal delay={0.1}>
              <div className="card">
                <span className="kicker">Speaking Formats</span>
                {[
                  { format:"Podcast Interview",         note:"30–90 min · Remote or in-person" },
                  { format:"Panel Discussion",           note:"Academic, cultural, publishing" },
                  { format:"Keynote Address",            note:"Conference and institutional events" },
                  { format:"Workshop Facilitation",      note:"Publishing literacy and author rights" },
                  { format:"Media Interview",            note:"Print, broadcast, digital" },
                  { format:"University Guest Lecture",   note:"Publishing, culture, narrative studies" },
                ].map(({ format, note }) => (
                  <div key={format} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid var(--line)", fontSize:14 }}>
                    <span style={{ color:"var(--ink)", fontWeight:500 }}>{format}</span>
                    <span style={{ fontSize:12, color:"rgba(11,11,12,.42)", letterSpacing:".01em" }}>{note}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="card" style={{ background:"var(--ink)", border:"none", color:"white", height:"100%" }}>
                <span className="kicker">Book a Media Appearance</span>
                <p className={display.className} style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:300, lineHeight:1.45, color:"white", margin:"0 0 20px", letterSpacing:"-0.01em" }}>
                  "The story of African people is not a story of loss. It is a story of interrupted continuity."
                </p>
                <p className="p" style={{ color:"rgba(255,255,255,.60)", fontSize:14, marginBottom:24 }}>
                  For interview requests, speaking engagements, and media appearances, contact our press team directly.
                </p>
                <a
                  className="btn btnP"
                  href="mailto:press@sankofapublishers.com"
                  style={{ display:"inline-flex" }}
                >
                  Contact Press Team →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          PRESS KIT ASSETS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Press Resources</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Press Kit &amp; Assets
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>The following assets are available to credentialed media on request. Contact our press team to receive the full press kit.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:32 }} className="twoCol">
            <Reveal delay={0.1}>
              <div className="card">
                <span className="kicker">Available Assets</span>
                {[
                  { asset:"Publisher biography — long form",    format:"PDF · DOCX" },
                  { asset:"Publisher biography — short form",   format:"PDF · DOCX" },
                  { asset:"Company overview and mission",       format:"PDF" },
                  { asset:"High-resolution logo files",         format:"PNG · SVG · EPS" },
                  { asset:"Founder headshots",                  format:"JPG · TIFF" },
                  { asset:"Brand color and typography guide",   format:"PDF" },
                  { asset:"Approved media quotes",              format:"PDF" },
                  { asset:"Publishing model overview",          format:"PDF" },
                ].map(({ asset, format }) => (
                  <div key={asset} className="assetRow">
                    <span style={{ fontSize:14, color:"var(--ink)" }}>{asset}</span>
                    <span style={{ fontSize:11, color:"rgba(11,11,12,.38)", letterSpacing:".06em", fontWeight:600 }}>{format}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div className="card">
                  <span className="kicker">Press Contact</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:4 }}>
                    {[
                      { label:"Press Inquiries",  val:"press@sankofapublishers.com" },
                      { label:"General Contact",  val:"contact@sankofapublishers.com" },
                      { label:"Response Time",    val:"Within 2 business days" },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                        <span style={{ fontSize:10, fontWeight:600, letterSpacing:".16em", textTransform:"uppercase", color:"#C9A227" }}>{label}</span>
                        <span style={{ fontSize:14, color:"rgba(11,11,12,.72)" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:20 }}>
                    <a className="btn btnP" href="mailto:press@sankofapublishers.com" style={{ width:"100%" }}>
                      Request Press Kit →
                    </a>
                  </div>
                </div>

                <div className="card">
                  <span className="kicker">Usage Guidelines</span>
                  <p className="p" style={{ fontSize:14, marginBottom:0 }}>All brand assets are provided for editorial and journalistic use only. Modification of logos or brand marks is not permitted. For questions about approved usage, contact our press team.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT THE FOUNDER  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:56, alignItems:"start" }} className="twoCol">
            <Reveal>
              <span className="kicker">Founder Profile</span>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.44)", lineHeight:1.9, margin:"8px 0 0" }}>
                Mark Daniel<br />
                Founder &amp; Managing Director<br />
                Sankofa Publishers<br />
                Santa Fe, New Mexico
              </p>
              <div style={{ width:36, height:2, background:"#C9A227", marginTop:20 }} />
            </Reveal>

            <div>
              <Reveal delay={0.1}>
                <h2 className={display.className} style={{ fontSize:"clamp(22px,2.4vw,34px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 20px", color:"white" }}>
                  About Mark Daniel
                </h2>
                <p className="p" style={{ color:"rgba(255,255,255,.65)" }}>
                  Mark Daniel is the Founder and Managing Director of Sankofa Publishers. He brings a multidisciplinary background spanning religious deconstruction, cultural analysis, organizational leadership, and publishing strategy.
                </p>
                <p className="p" style={{ color:"rgba(255,255,255,.65)" }}>
                  A former pastor and now a religious deconstruction activist, Mark's work sits at the intersection of cultural sovereignty, narrative power, and economic empowerment for African and diasporic communities. Sankofa Publishers is the institutional expression of his conviction that infrastructure — not validation — is what diasporic narrative requires.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,.09)", margin:"22px 0" }} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {["Religious Deconstruction","Cultural Sovereignty","Publishing Equity","African Diaspora","Narrative as Infrastructure","Author Rights"].map(tag => (
                    <span key={tag} style={{ fontSize:11, padding:"5px 12px", borderRadius:999, border:"1px solid rgba(201,162,39,.3)", color:"rgba(201,162,39,.85)", background:"rgba(201,162,39,.07)" }}>{tag}</span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MEDIA GUIDELINES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Editorial Standards</span>
            <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
              Media Guidelines
            </h2>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:8 }} className="threeCol">
            {[
              { title:"Accuracy",      body:"Sankofa Publishers requests the opportunity to review factual claims before publication. We will respond to fact-check requests within one business day." },
              { title:"Terminology",   body:"We are a hybrid publishing house — not a vanity press, not a self-publishing platform. Please use accurate terminology when describing our model in coverage." },
              { title:"Attribution",   body:"Direct quotes from Sankofa Publishers or Mark Daniel must be taken from approved media quotes or confirmed in writing before publication." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.09}>
                <div style={{ border:"1px solid var(--line)", borderRadius:14, padding:"22px 20px", background:"#fff", position:"relative", overflow:"hidden", transition:"box-shadow .22s,transform .22s", cursor:"default" }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="0 14px 44px rgba(0,0,0,.09)"; el.style.transform="translateY(-3px)" }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.boxShadow="none"; el.style.transform="translateY(0)" }}
                >
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 10px" }}>{title}</p>
                  <p className="p" style={{ margin:0, fontSize:14 }}>{txt}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "The story of African people is not a story of loss.<br />It is a story of interrupted continuity."
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
            <span className="kicker">Get in Touch</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              We respond to all credentialed media inquiries.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              For interviews, press kits, fact-checking, or speaking requests — contact our press team directly.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="mailto:press@sankofapublishers.com">Contact Press Team</a>
              <a className="btn btnG" href="/about">About Sankofa</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — hieroglyphics.png */}
        <img
          src="/images/hieroglyphics.png"
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
