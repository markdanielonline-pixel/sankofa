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

  /* partnership type cards */
  .ptCard {
    border:1px solid var(--line); border-radius:18px; padding:28px 24px;
    background:#fff; position:relative; overflow:hidden;
    transition:box-shadow .25s, transform .25s;
    cursor:default;
  }
  .ptCard::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:#C9A227; transform:scaleX(0); transform-origin:left;
    transition:transform .35s ease;
  }
  .ptCard:hover { box-shadow:0 16px 48px rgba(0,0,0,.10); transform:translateY(-4px); }
  .ptCard:hover::before { transform:scaleX(1); }

  /* process step */
  .pStep { display:flex; gap:20px; padding:20px 0; border-bottom:1px solid var(--line); align-items:flex-start; }
  .pStep:last-child { border-bottom:none; }
  .pNum {
    font-size:32px; font-weight:300; color:rgba(201,162,39,.25);
    line-height:1; flex-shrink:0; width:40px;
    font-family:var(--fraunces);
    transition:color .3s;
  }
  .pStep:hover .pNum { color:rgba(201,162,39,.55); }

  /* criteria row */
  .cRow { display:flex; align-items:flex-start; gap:12px; padding:11px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.72); transition:padding-left .18s,color .18s; cursor:default; }
  .cRow:hover { padding-left:5px; color:var(--ink); }
  .cRow:last-child { border-bottom:none; }

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
    .card, .ptCard { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function PartnershipsPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Partnerships · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Partnerships
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              We build with organizations that share our commitment to cultural infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE PARTNERSHIP PHILOSOPHY
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">Our Philosophy</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  Partnership Is Infrastructure. Not Promotion.
                </h2>
                <p className="p">Sankofa Publishers does not pursue partnerships for visibility alone. We build structural relationships with organizations that share our commitment to African and diasporic narrative, author ownership, and cultural accountability.</p>
                <p className="p" style={{ marginBottom:0 }}>Every partnership begins with alignment. We ask: does this relationship strengthen the infrastructure? Does it serve authors and communities we exist to support? If yes, we build. If not, we decline respectfully.</p>
              </Reveal>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:"→", label:"Alignment over visibility" },
                  { icon:"→", label:"Structural benefit to authors and communities" },
                  { icon:"→", label:"Cultural accountability as a baseline requirement" },
                  { icon:"→", label:"Long-term relationships over short-term campaigns" },
                  { icon:"✕", label:"No partnerships that compromise editorial independence" },
                  { icon:"✕", label:"No relationships that dilute cultural integrity" },
                ].map(({ icon, label }, i) => (
                  <Reveal key={label} delay={i * 0.06}>
                    <div
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderRadius:12, border:"1px solid var(--line)", background:"#fff", transition:"box-shadow .2s,transform .2s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)"; el.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateX(0)" }}
                    >
                      <span style={{ color: icon === "→" ? "#C9A227" : "rgba(201,162,39,.45)", fontWeight:700, fontSize:13, flexShrink:0 }}>{icon}</span>
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
          PARTNERSHIP TYPES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">How We Partner</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Partnership Categories
            </h2>
            <p className="p" style={{ maxWidth:580, marginBottom:0 }}>
              We engage across five structured partnership categories. Each is designed to create genuine infrastructure — not symbolic association.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginTop:32 }} className="threeCol">
            {[
              {
                num: "01",
                title: "Academic & Research Institutions",
                body: "Universities, research centers, and academic departments seeking publishing infrastructure for faculty, student, or institutional work. We provide discounted services, co-publication agreements, and institutional publishing frameworks.",
                tags: ["Universities", "Research Centers", "Academic Presses"],
              },
              {
                num: "02",
                title: "Cultural & Community Organizations",
                body: "Non-profits, cultural centers, community organizations, and advocacy groups with stories, histories, or analyses that deserve professional publishing infrastructure.",
                tags: ["Non-profits", "Cultural Centers", "Advocacy Groups"],
              },
              {
                num: "03",
                title: "Media & Content Platforms",
                body: "Podcasts, digital platforms, independent media outlets, and content creators seeking to extend their work into long-form published format with professional distribution.",
                tags: ["Podcasts", "Digital Media", "Independent Outlets"],
              },
              {
                num: "04",
                title: "Distribution & Retail Partners",
                body: "Bookstores, libraries, and specialty retailers — particularly those serving African and diasporic communities — interested in carrying Sankofa catalog titles or establishing preferred retailer agreements.",
                tags: ["Bookstores", "Libraries", "Specialty Retail"],
              },
              {
                num: "05",
                title: "Corporate & Institutional Sponsors",
                body: "Organizations whose values align with cultural sovereignty and publishing equity, seeking to support the press through sponsorship, endowment, or institutional contribution.",
                tags: ["Sponsorship", "Endowment", "Institutional Giving"],
              },
              {
                num: "06",
                title: "International & Diaspora Networks",
                body: "African Union institutions, diaspora organizations, pan-African networks, and international cultural bodies seeking publishing alignment and collaborative distribution reach.",
                tags: ["African Union", "Diaspora Networks", "Pan-African Orgs"],
              },
            ].map(({ num, title, body: txt, tags }, i) => (
              <Reveal key={num} delay={i * 0.07}>
                <div className="ptCard">
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:".2em", color:"rgba(201,162,39,.5)", display:"block", marginBottom:10 }}>{num}</span>
                  <h3 className={display.className} style={{ fontSize:"clamp(16px,1.7vw,20px)", fontWeight:400, letterSpacing:"-0.015em", lineHeight:1.25, margin:"0 0 10px", color:"var(--ink)" }}>{title}</h3>
                  <p className="p" style={{ fontSize:14, margin:"0 0 14px" }}>{txt}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ fontSize:10, padding:"3px 10px", borderRadius:999, border:"1px solid rgba(201,162,39,.3)", color:"#C9A227", background:"rgba(201,162,39,.06)", fontWeight:600, letterSpacing:".04em" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          PARTNERSHIP CRITERIA
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }} className="twoCol">
            <Reveal>
              <span className="kicker">Alignment Criteria</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Who We Partner With
              </h2>
              <p className="p">We evaluate all partnership inquiries against a set of alignment criteria. Organizations that meet these criteria are invited to move forward to a structured conversation.</p>
              {[
                "Demonstrable commitment to African or diasporic communities",
                "Respect for author rights and intellectual property",
                "No history of cultural exploitation or narrative distortion",
                "Operational integrity and transparent governance",
                "Long-term relationship orientation over transactional engagement",
                "Willingness to operate under a formal partnership agreement",
              ].map(item => (
                <div key={item} className="cRow">
                  <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>→</span>
                  {item}
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.15}>
              <span className="kicker">Who We Do Not Partner With</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Non-Negotiable Exclusions
              </h2>
              <p className="p">Some organizations are structurally incompatible with Sankofa's mission. We decline these relationships regardless of financial terms or visibility offered.</p>
              {[
                "Organizations with documented histories of racial exploitation",
                "Entities whose primary revenue depends on cultural appropriation",
                "Institutions that require editorial control or content approval",
                "Organizations that would require Sankofa to dilute its cultural identity",
                "Any entity whose partnership would compromise author rights",
                "Politically extreme organizations of any ideological direction",
              ].map(item => (
                <div key={item} className="cRow">
                  <span style={{ color:"rgba(201,162,39,.45)", fontWeight:700, fontSize:13, marginTop:1, flexShrink:0 }}>✕</span>
                  {item}
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PARTNERSHIP PROCESS  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">How It Works</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px", color:"white" }}>
              The Partnership Process
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.58)", maxWidth:560, marginBottom:0 }}>
              Every partnership begins the same way — with a conversation. We do not rush into agreements. We build with intention.
            </p>
          </Reveal>

          <div style={{ marginTop:36 }}>
            {[
              {
                num: "01",
                title: "Initial Inquiry",
                body: "Submit a partnership inquiry using the form below or by emailing partnerships@sankofapublishers.com. Include a brief description of your organization, your mission, and the nature of the partnership you are proposing.",
              },
              {
                num: "02",
                title: "Alignment Review",
                body: "Our team reviews your inquiry against our alignment criteria. We respond within five business days. If alignment is confirmed, we invite you to a structured introductory conversation.",
              },
              {
                num: "03",
                title: "Introductory Conversation",
                body: "A focused 45-minute conversation to understand your organizational goals, explore potential structures, and determine whether a formal partnership is appropriate.",
              },
              {
                num: "04",
                title: "Proposal Development",
                body: "If the introductory conversation confirms alignment, we develop a formal partnership proposal outlining scope, terms, deliverables, duration, and any financial arrangements.",
              },
              {
                num: "05",
                title: "Agreement & Activation",
                body: "All partnerships are formalized through a written agreement. Upon signing, activation begins according to the agreed timeline and structure.",
              },
            ].map(({ num, title, body: txt }, i) => (
              <Reveal key={num} delay={i * 0.08}>
                <div className="pStep">
                  <span className={`pNum ${display.className}`}>{num}</span>
                  <div>
                    <p style={{ fontWeight:600, fontSize:15, margin:"0 0 6px", color:"white" }}>{title}</p>
                    <p className="p" style={{ color:"rgba(255,255,255,.58)", fontSize:14, margin:0 }}>{txt}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          WHAT PARTNERS RECEIVE
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Partnership Value</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              What Partners Receive
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>Partnership with Sankofa is a structural relationship. Partners receive tangible infrastructure — not just association.</p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { title:"Publishing Infrastructure Access",   body:"Discounted or priority access to editorial, design, and production services for qualifying partner manuscripts and publications." },
              { title:"Co-Publication Opportunities",       body:"Jointly produced titles under both the Sankofa imprint and the partner's brand — shared distribution, shared visibility." },
              { title:"Catalog Placement",                  body:"Partner-affiliated authors receive consideration through a dedicated submission pathway with expedited review." },
              { title:"Platform Visibility",               body:"Featured partner acknowledgment on the Sankofa website, in press materials, and in relevant catalog communications." },
              { title:"Event Collaboration",               body:"Joint programming, panels, book launches, and speaking events aligned with shared cultural and publishing goals." },
              { title:"Community Distribution Network",    body:"Access to Sankofa's growing network of community-aligned retailers, libraries, and diaspora distribution channels." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="ptCard">
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
                "We do not build with organizations.<br />We build with people inside organizations<br />who understand what is at stake."
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
            <span className="kicker">Start the Conversation</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Build something that lasts.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              If your organization is aligned with our mission and committed to cultural infrastructure — we want to hear from you.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="mailto:partnerships@sankofapublishers.com">Submit Partnership Inquiry</a>
              <a className="btn btnG" href="/about">Learn About Sankofa</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — drums.png */}
        <img
          src="/images/drums.png"
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
