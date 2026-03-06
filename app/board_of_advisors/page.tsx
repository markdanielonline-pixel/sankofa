"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS  ← identical on every page
═══════════════════════════════════════════════════════════ */

function useReveal(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
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
  .p:last-child { margin-bottom:0; }
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:32px; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  /* advisor card */
  .advCard {
    border:1px solid var(--line); border-radius:18px; padding:28px 24px;
    background:#fff; position:relative; overflow:hidden;
    transition:box-shadow .25s, transform .25s;
    cursor:default;
  }
  .advCard::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#C9A227,#f5d878);
    transform:scaleX(0); transform-origin:left;
    transition:transform .38s ease;
  }
  .advCard:hover { box-shadow:0 18px 52px rgba(0,0,0,.11); transform:translateY(-5px); }
  .advCard:hover::before { transform:scaleX(1); }

  /* governance row */
  .govRow { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid var(--line); transition:padding-left .18s; cursor:default; }
  .govRow:hover { padding-left:5px; }
  .govRow:last-child { border-bottom:none; }

  /* ethics item */
  .ethItem { border:1px solid var(--line); border-radius:14px; padding:20px; background:#fff; transition:box-shadow .22s,transform .22s,border-color .22s; cursor:default; }
  .ethItem:hover { box-shadow:0 10px 36px rgba(0,0,0,.08); transform:translateY(-3px); border-color:rgba(201,162,39,.3); }

  .divLine { height:1px; background:var(--line); border:none; margin:0; }
  .qb { border-left:3px solid #C9A227; padding:4px 0 4px 20px; }

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
    .card, .advCard { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function BoardOfAdvisorsPage() {
  const sigFloat = useFloat(9, 0.38)

  const advisors = [
    {
      name: "Dr. Amina Okoye",
      title: "Economic Development Strategist",
      location: "Lagos, Nigeria",
      bio: "Dr. Okoye specializes in diaspora economic circulation models and emerging market infrastructure. Her advisory role supports Sankofa's long-term positioning within global African economic frameworks.",
      tags: ["Diaspora Economics", "Emerging Markets", "African Infrastructure"],
    },
    {
      name: "Professor David Laurent",
      title: "Comparative Literature Scholar",
      location: "Paris, France",
      bio: "Professor Laurent brings academic expertise in post-colonial literary theory and global narrative structures. He advises on scholarly and analytical publishing standards and cross-cultural editorial alignment.",
      tags: ["Post-Colonial Theory", "Literary Studies", "Global Narrative"],
    },
    {
      name: "Marcia Bennett, Esq.",
      title: "Intellectual Property Attorney",
      location: "New York, USA",
      bio: "Ms. Bennett provides strategic guidance on copyright protection, publishing compliance, and international intellectual property frameworks. She ensures Sankofa's legal infrastructure protects both the press and its authors.",
      tags: ["Copyright Law", "IP Frameworks", "Publishing Compliance"],
    },
    {
      name: "Samuel Thompson",
      title: "Publishing Operations Consultant",
      location: "Toronto, Canada",
      bio: "With over two decades in production management and distribution systems, Mr. Thompson advises on scalability, operational integrity, and the technical infrastructure required to sustain a growing independent press.",
      tags: ["Production Management", "Distribution Systems", "Operational Scale"],
    },
    {
      name: "Dr. Kemi Adewale",
      title: "Cultural Policy Analyst",
      location: "Accra, Ghana",
      bio: "Dr. Adewale focuses on cultural preservation, narrative sovereignty, and policy influence through publishing platforms. She advises on the intersection of diasporic cultural production and institutional policy frameworks.",
      tags: ["Cultural Policy", "Narrative Sovereignty", "Diaspora Studies"],
    },
  ]

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Board of Advisors · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Board of Advisors
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              "We build with counsel, not impulse."
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PURPOSE OF THE BOARD
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">The Advisory Council</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  Guided by Multidisciplinary Expertise
                </h2>
                <p className="p">Sankofa Publishers is guided by an Advisory Board composed of leaders across publishing, academia, economics, law, and cultural strategy.</p>
                <p className="p">The Advisory Board provides strategic insight, ethical oversight, and institutional perspective. Advisors do not manage daily operations — they contribute to long-term structural direction.</p>
                <p className="p" style={{ marginBottom:0 }}>This structure ensures Sankofa grows with discipline and foresight, not impulse.</p>
              </Reveal>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { title:"Strengthen institutional credibility",     icon:"→" },
                  { title:"Provide intellectual guidance",            icon:"→" },
                  { title:"Advise on cultural alignment",             icon:"→" },
                  { title:"Offer strategic counsel on expansion",     icon:"→" },
                  { title:"Support ethical publishing standards",     icon:"→" },
                ].map(({ title, icon }, i) => (
                  <Reveal key={title} delay={i * 0.07}>
                    <div
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderRadius:12, border:"1px solid var(--line)", background:"#fff", transition:"box-shadow .2s,transform .2s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)"; el.style.transform = "translateX(4px)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateX(0)" }}
                    >
                      <span style={{ color:"#C9A227", fontWeight:700, fontSize:13, flexShrink:0 }}>{icon}</span>
                      <span style={{ fontSize:14, color:"var(--ink)" }}>{title}</span>
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
          ADVISOR PROFILES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Advisory Members</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              The Council
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>
              Each advisor brings demonstrated expertise directly relevant to Sankofa's mission. Profiles marked as provisional will be confirmed as the institution grows.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:32 }} className="twoCol">
            {advisors.map(({ name, title, location, bio, tags }, i) => (
              <Reveal key={name} delay={i * 0.08}>
                <div className="advCard">
                  {/* initials avatar */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "linear-gradient(135deg,rgba(201,162,39,.15),rgba(201,162,39,.30))",
                      border: "1px solid rgba(201,162,39,.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span className={display.className} style={{ fontSize: 18, fontWeight: 400, color: "#C9A227" }}>
                        {name.split(" ").map(n => n[0]).filter((_, i) => i === 0 || i === name.split(" ").length - 1).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className={display.className} style={{ fontSize:"clamp(16px,1.7vw,20px)", fontWeight:400, letterSpacing:"-0.015em", lineHeight:1.2, margin:"0 0 3px", color:"var(--ink)" }}>{name}</h3>
                      <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:500, color:"#C9A227" }}>{title}</p>
                      <p style={{ margin:0, fontSize:12, color:"rgba(11,11,12,.40)", letterSpacing:".02em" }}>{location}</p>
                    </div>
                  </div>

                  <p className="p" style={{ fontSize:14, marginBottom:16 }}>{bio}</p>

                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ fontSize:10, padding:"3px 10px", borderRadius:999, border:"1px solid rgba(201,162,39,.3)", color:"#C9A227", background:"rgba(201,162,39,.06)", fontWeight:600, letterSpacing:".04em" }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ marginTop:16, paddingTop:14, borderTop:"1px solid var(--line)" }}>
                    <span style={{ fontSize:10, color:"rgba(11,11,12,.35)", letterSpacing:".1em", textTransform:"uppercase", fontWeight:600 }}>Advisory Role · Non-Executive · Consultative</span>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Future expansion card */}
            <Reveal delay={0.4}>
              <div className="advCard" style={{ border:"1px dashed rgba(201,162,39,.35)", background:"rgba(201,162,39,.02)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", minHeight:220 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", border:"1px dashed rgba(201,162,39,.4)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <span style={{ fontSize:22, color:"rgba(201,162,39,.5)" }}>+</span>
                </div>
                <p style={{ fontSize:12, fontWeight:600, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(201,162,39,.6)", margin:"0 0 8px" }}>Expanding</p>
                <p className="p" style={{ fontSize:14, margin:0, color:"rgba(11,11,12,.45)", maxWidth:220 }}>
                  Sankofa anticipates expanding its Advisory Board as institutional growth continues.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          GOVERNANCE FRAMEWORK  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Governance</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px", color:"white" }}>
              Institutional Framework
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.58)", maxWidth:580, marginBottom:0 }}>
              Sankofa operates with defined roles, documented standards, and consistent decision pathways. Our governance structure protects authors, readers, cultural integrity, editorial independence, and operational transparency.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginTop:36 }} className="twoCol">

            {/* Leadership */}
            <Reveal delay={0.1}>
              <div style={{ border:"1px solid rgba(255,255,255,.09)", borderRadius:18, padding:"28px 24px", background:"rgba(255,255,255,.03)" }}>
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:12 }}>Leadership</span>
                <h3 className={display.className} style={{ fontSize:"clamp(18px,2vw,24px)", fontWeight:400, color:"white", margin:"0 0 12px", letterSpacing:"-0.018em" }}>
                  Mark Daniel
                </h3>
                <p style={{ fontSize:12, color:"rgba(201,162,39,.70)", fontWeight:500, margin:"0 0 14px", letterSpacing:".04em" }}>Founder &amp; Managing Director</p>
                <p className="p" style={{ color:"rgba(255,255,255,.60)", fontSize:14, marginBottom:16 }}>
                  Leadership is responsible for strategic direction, brand integrity, publishing standards, institutional growth, and final operational accountability.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["Strategic direction","Brand integrity","Publishing standards","Institutional growth","Final operational accountability"].map(item => (
                    <div key={item} className="govRow" style={{ borderBottom:"1px solid rgba(255,255,255,.06)", padding:"10px 0" }}>
                      <span style={{ color:"#C9A227", fontWeight:700, fontSize:12, flexShrink:0, marginTop:2 }}>→</span>
                      <span style={{ fontSize:13, color:"rgba(255,255,255,.65)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Advisory Board Role */}
            <Reveal delay={0.15}>
              <div style={{ border:"1px solid rgba(255,255,255,.09)", borderRadius:18, padding:"28px 24px", background:"rgba(255,255,255,.03)" }}>
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:".26em", textTransform:"uppercase", color:"#C9A227", display:"block", marginBottom:12 }}>Advisory Board</span>
                <h3 className={display.className} style={{ fontSize:"clamp(18px,2vw,24px)", fontWeight:400, color:"white", margin:"0 0 12px", letterSpacing:"-0.018em" }}>
                  Consultative Role
                </h3>
                <p className="p" style={{ color:"rgba(255,255,255,.60)", fontSize:14, marginBottom:16 }}>
                  Advisors serve in a strictly consultative capacity. They contribute intellectual guidance and strategic counsel — not operational control.
                </p>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.35)", margin:"0 0 10px" }}>Advisors Do Not:</p>
                {["Manage daily operations","Control editorial decisions","Hold governing authority","Represent Sankofa without written authorization"].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.06)", fontSize:13, color:"rgba(255,255,255,.55)" }}>
                    <span style={{ color:"rgba(201,162,39,.45)", fontWeight:700, flexShrink:0, marginTop:1 }}>✕</span>{item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Decision Integrity */}
          <Reveal delay={0.2}>
            <div style={{ marginTop:24, padding:"24px 28px", border:"1px solid rgba(201,162,39,.22)", borderRadius:16, background:"rgba(201,162,39,.05)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }} className="twoCol">
                <div>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"#C9A227", margin:"0 0 8px" }}>Decision Integrity</p>
                  <p className="p" style={{ color:"rgba(255,255,255,.72)", fontSize:15, marginBottom:0 }}>
                    Sankofa maintains complete separation between editorial decisions and revenue activities. Paid services do not influence acceptance decisions. We do not sell publication. We publish based on standard.
                  </p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
                  {["Editorial decisions are independent","Service purchases have no influence on acceptance","Cultural alignment is non-negotiable","Transparency is structural"].map(item => (
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:"#C9A227", flexShrink:0 }} />
                      <span style={{ fontSize:13, color:"rgba(255,255,255,.65)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EDITORIAL ETHICS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Editorial Ethics</span>
            <h2 className={display.className} style={{ fontSize:"clamp(26px,2.8vw,40px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Standards &amp; Integrity
            </h2>
            <p className="p" style={{ maxWidth:560, marginBottom:0 }}>
              Every editorial decision at Sankofa is governed by a consistent set of standards. These are not aspirational — they are operational.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { title:"Standards-Based Acceptance", body:"Manuscripts are evaluated on quality of writing, coherence and structure, integrity of argument or story, cultural responsibility, readiness for production, and alignment with ethical standards." },
              { title:"Intellectual Rigor",          body:"We welcome strong ideas and controversial arguments where claims are responsibly made, logic is coherent, evidence is credible, and intent is constructive or analytically serious." },
              { title:"Cultural Integrity",          body:"Sankofa exists to support work contributing value to African communities and diasporic discourse. Cultural grounding is not exclusion — it is responsibility." },
              { title:"Originality & Plagiarism",    body:"We require authors to submit original work or properly licensed material. Manuscripts may be screened for plagiarism. Violation results in rejection or termination." },
              { title:"AI Disclosure",               body:"AI-assisted content is permitted only if fully disclosed. Failure to disclose may result in rejection, conditional acceptance, or termination after publication." },
              { title:"Author Conduct",              body:"Authors are expected to communicate respectfully, meet agreed deadlines, respond to editorial requests, disclose content risks, and uphold contractual standards." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div className="ethItem">
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
          ROYALTY & FINANCIAL ETHICS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Financial Ethics</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                Royalty &amp; Financial Transparency
              </h2>
              <p className="p">Sankofa is structured for transparency at every financial level. Authors retain 100% copyright, 100% intellectual property, and 100% of net royalty earnings.</p>
              <p className="p">We do not withhold royalties as leverage. We operate with clear reporting practices and defined payment cycles. No hidden adjustments. No unexplained deductions.</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Copyright Ownership",       value:"100% retained by author" },
                  { label:"Royalty Earnings",           value:"100% of net revenue" },
                  { label:"Intellectual Property",      value:"100% retained by author" },
                  { label:"Reporting",                  value:"Full transparency, defined cycles" },
                  { label:"Royalty Leverage",           value:"Never used" },
                  { label:"Hidden Fees",                value:"None" },
                ].map(({ label, value }, i) => (
                  <Reveal key={label} delay={i * 0.06}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid var(--line)" }}>
                      <span style={{ fontSize:14, color:"rgba(11,11,12,.65)" }}>{label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:"var(--ink)" }}>{value}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — hands_writing_1.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "We build with counsel, not impulse.<br />We grow with discipline, not urgency."
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
            <span className="kicker">Build With Us</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Guided by wisdom.<br />Built for endurance.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              If you are ready to submit your manuscript or explore what Sankofa can build for your work — we are here.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/about">About Sankofa</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — hands_writing_1.png */}
        <img
          src="/images/hands_writing_1.png"
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
