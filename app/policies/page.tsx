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
   POLICY SECTION COMPONENT
═══════════════════════════════════════════════════════════ */
function PolicySection({ id, kicker, title, children }: {
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
      <Reveal delay={0.08}>
        {children}
      </Reveal>
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

  /* policy body text */
  .policyText { font-size:15px; line-height:1.82; color:rgba(11,11,12,.72); margin:0 0 14px; }
  .policyText:last-child { margin-bottom:0; }

  /* policy list row */
  .pRow { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); font-size:14px; color:rgba(11,11,12,.68); }
  .pRow:last-child { border-bottom:none; }

  /* nav pill */
  .navPill { display:inline-flex; align-items:center; padding:7px 16px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:.04em; border:1px solid var(--line); color:rgba(11,11,12,.55); background:#fff; cursor:pointer; text-decoration:none; transition:border-color .18s,color .18s,background .18s; }
  .navPill:hover { border-color:rgba(201,162,39,.5); color:#C9A227; background:rgba(201,162,39,.06); }

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
export default function PoliciesPage() {
  const sigFloat = useFloat(9, 0.38)

  const sections = [
    { id:"privacy",    label:"Privacy Policy" },
    { id:"terms",      label:"Terms of Use" },
    { id:"editorial",  label:"Editorial Policy" },
    { id:"author",     label:"Author Rights" },
    { id:"content",    label:"Content Standards" },
    { id:"ip",         label:"Intellectual Property" },
  ]

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Policies · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Policies
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Clear terms. No hidden conditions. Updated March 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUICK NAV
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"28px 0", borderBottom:"1px solid var(--line)" }}>
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
          POLICY CONTENT
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:56, alignItems:"start" }} className="twoCol">

            {/* sticky sidebar nav */}
            <div style={{ position:"sticky", top:32 }}>
              <Reveal>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(11,11,12,.35)", margin:"0 0 14px" }}>On This Page</p>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {sections.map(({ id, label }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      style={{ fontSize:13, color:"rgba(11,11,12,.50)", padding:"7px 12px", borderRadius:8, transition:"background .18s,color .18s,padding-left .18s", display:"block" }}
                      onMouseEnter={e=>{ const el=e.currentTarget; el.style.background="rgba(201,162,39,.08)"; el.style.color="#C9A227"; el.style.paddingLeft="16px" }}
                      onMouseLeave={e=>{ const el=e.currentTarget; el.style.background="transparent"; el.style.color="rgba(11,11,12,.50)"; el.style.paddingLeft="12px" }}
                    >{label}</a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* policy content */}
            <div style={{ display:"flex", flexDirection:"column", gap:52 }}>

              {/* PRIVACY */}
              <PolicySection id="privacy" kicker="Section 01" title="Privacy Policy">
                <p className="policyText">Sankofa Publishers collects only the information required to process submissions, deliver services, and communicate with authors and visitors. We do not sell, rent, or share personal information with third parties for marketing purposes.</p>
                <p className="policyText">Information we collect includes names, email addresses, manuscript files submitted through our platform, and payment information processed through verified third-party payment processors. Payment details are never stored on our own servers.</p>
                <p className="policyText">All submitted manuscripts are treated as confidential. They are not shared, reproduced, or referenced outside the editorial review process. Submission does not transfer rights.</p>
                <p className="policyText">We use cookies on this website to understand how visitors navigate the site. No personally identifiable information is collected through cookies. You may disable cookies through your browser settings at any time.</p>
                <p className="policyText">Authors and users may request access to, correction of, or deletion of their personal data by contacting compliance@sankofapublishers.com. We respond to all data requests within ten business days.</p>
                <div style={{ marginTop:18, padding:"16px 20px", background:"rgba(201,162,39,.06)", borderRadius:12, border:"1px solid rgba(201,162,39,.2)" }}>
                  <p style={{ fontSize:13, color:"rgba(11,11,12,.65)", margin:0, lineHeight:1.7 }}>Questions about our privacy practices can be sent to <strong>compliance@sankofapublishers.com</strong>. We will respond directly.</p>
                </div>
              </PolicySection>

              <hr className="divLine" />

              {/* TERMS */}
              <PolicySection id="terms" kicker="Section 02" title="Terms of Use">
                <p className="policyText">By using the Sankofa Publishers website and submitting materials through our platform, you agree to the following terms. If you do not agree, please do not use this site.</p>
                <p className="policyText">The content on this website, including text, design, and brand assets, is the property of Sankofa Publishers, LLC. You may not reproduce, distribute, or republish any content from this site without written permission.</p>
                <p className="policyText">Submitted manuscripts remain the property of the author at all times. Submission does not constitute a transfer of rights. No publishing agreement is formed until both parties have signed a formal written agreement.</p>
                <p className="policyText">We reserve the right to refuse service, cancel agreements, or remove content that violates our editorial or content standards. We will communicate the reason for any such decision directly.</p>
                <p className="policyText">These terms are governed by the laws of the State of New Mexico, United States. Any disputes arising from use of this site or our services will be handled in accordance with applicable New Mexico and federal law.</p>
                <p className="policyText">We may update these terms periodically. When we do, the date at the top of this page will change. Continued use of the site after an update constitutes acceptance of the revised terms.</p>
              </PolicySection>

              <hr className="divLine" />

              {/* EDITORIAL */}
              <PolicySection id="editorial" kicker="Section 03" title="Editorial Policy">
                <p className="policyText">Sankofa Publishers accepts manuscripts based on editorial merit, cultural alignment, and production readiness. No service purchase, financial contribution, or personal relationship influences the editorial decision.</p>
                <p className="policyText">All submissions are reviewed by a member of our editorial team within 45 days of confirmed receipt. Possible outcomes are full acceptance, conditional acceptance with specified revision requirements, or rejection. We communicate all decisions directly and clearly.</p>
                <p className="policyText">We welcome controversial ideas, strong arguments, and analytical work that challenges received wisdom. We do not publish content designed solely to provoke without substance, content that defames named individuals without evidence, or content that promotes hatred based on race, religion, gender, or national origin.</p>
                <p className="policyText">Manuscripts that include real people, real events, or serious allegations may require additional documentation or legal review before publication proceeds. Authors bear responsibility for the accuracy of claims made in their work.</p>
                <p className="policyText">Conditional acceptance means the manuscript shows genuine publishing potential. It does not mean acceptance is guaranteed. Authors who receive a conditional acceptance are given specific, actionable revision notes and a reasonable timeframe to respond.</p>
                <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:0 }}>
                  {["Faith-based doctrinal promotion","Defamatory or slanderous material","Hate speech of any kind","Undisclosed AI-generated content","Plagiarized or unlicensed material","Incomplete or unedited manuscripts submitted as finished work"].map(item => (
                    <div key={item} className="pRow">
                      <span style={{ color:"rgba(201,162,39,.5)", fontWeight:700, fontSize:12, marginTop:2, flexShrink:0 }}>✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </PolicySection>

              <hr className="divLine" />

              {/* AUTHOR RIGHTS */}
              <PolicySection id="author" kicker="Section 04" title="Author Rights Policy">
                <p className="policyText">Authors published by Sankofa retain 100% copyright, 100% intellectual property rights, and 100% of net royalty earnings. We do not acquire ownership of any submitted or published work.</p>
                <p className="policyText">Sankofa receives limited non-exclusive permission to publish and distribute a title through a formal written agreement. That permission does not constitute ownership and does not restrict the author from pursuing other opportunities not in conflict with the agreement terms.</p>
                <p className="policyText">Authors may withdraw their title from publication by providing 30 days written notice. Upon withdrawal, all distribution is discontinued and full rights revert to the author. Sankofa does not impose penalties for withdrawal.</p>
                <p className="policyText">Royalties are calculated as 100% of net revenue. Net revenue is gross retail sales minus retailer fees, distribution fees, per-unit printing costs, and payment processing fees. All deductions are reported transparently. No unexplained adjustments are made.</p>
                <p className="policyText">Authors receive royalty reporting on a six-month cycle at no cost. Authors who subscribe to the Author Portal receive real-time reporting and automated direct deposits on a monthly basis.</p>
                <div style={{ marginTop:18, padding:"16px 20px", background:"rgba(201,162,39,.06)", borderRadius:12, border:"1px solid rgba(201,162,39,.2)" }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", margin:"0 0 6px" }}>Author Rights Summary</p>
                  <p style={{ fontSize:13, color:"rgba(11,11,12,.60)", margin:0, lineHeight:1.7 }}>100% copyright. 100% royalties. 100% intellectual property. Right to withdraw on 30 days notice. Full reporting transparency. No hidden deductions.</p>
                </div>
              </PolicySection>

              <hr className="divLine" />

              {/* CONTENT STANDARDS */}
              <PolicySection id="content" kicker="Section 05" title="Content Standards">
                <p className="policyText">All work published by Sankofa is evaluated against a consistent set of content standards. These standards exist to protect authors, readers, and the institutional integrity of the press.</p>
                <p className="policyText">We require that all submitted work be original or properly licensed. Authors must hold full rights to submitted materials. Plagiarism screening may be applied to any submission. If plagiarism is identified after publication, the publishing agreement may be terminated immediately.</p>
                <p className="policyText">AI-assisted writing is permitted when fully disclosed at the time of submission. Authors must indicate clearly which portions of the manuscript involved AI assistance. Failure to disclose AI usage is treated the same as plagiarism and may result in termination of the publishing agreement.</p>
                <p className="policyText">Works that include copyrighted material from third parties, such as song lyrics, extended quotations, or licensed images, must include documentation confirming that proper permissions have been obtained. Sankofa is not responsible for rights clearance on third-party material included in author submissions.</p>
                <p className="policyText">We do not publish content that constitutes hate speech, targeted harassment, or incitement to violence toward any individual or group. We do not publish content that sexualizes minors in any form. These are absolute restrictions with no exceptions.</p>
              </PolicySection>

              <hr className="divLine" />

              {/* INTELLECTUAL PROPERTY */}
              <PolicySection id="ip" kicker="Section 06" title="Intellectual Property">
                <p className="policyText">Sankofa Publishers operates in full compliance with United States copyright law and applicable international intellectual property standards.</p>
                <p className="policyText">The Sankofa name, logo, brand marks, and all proprietary website content are the intellectual property of Sankofa Publishers, LLC. Unauthorized reproduction or use of these assets is prohibited.</p>
                <p className="policyText">Authors retain all intellectual property in their submitted and published work. Sankofa does not claim any ownership interest in manuscripts, whether accepted, rejected, or under review. A signed publishing agreement grants distribution rights only, not ownership.</p>
                <p className="policyText">Ghostwriting engagements are protected by written non-disclosure agreements. Sankofa will not disclose, reference, or claim involvement in the production of any ghostwritten work. Full intellectual property in ghostwritten manuscripts transfers to the commissioning author upon final payment.</p>
                <p className="policyText">Any claims of intellectual property infringement related to Sankofa publications should be directed to compliance@sankofapublishers.com with full documentation of the claim. We investigate all credible IP complaints and respond within ten business days.</p>
                <p className="policyText">Cover designs and interior formatting files created by Sankofa as part of a paid service engagement are delivered in full to the author upon project completion. Authors own these files and may use them with any publisher or platform.</p>
              </PolicySection>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUESTIONS ABOUT POLICIES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Questions About These Policies</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
                We Answer Directly
              </h2>
              <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>
                If anything on this page is unclear, or if you have a specific question about how a policy applies to your situation, contact us. We respond to all policy questions within two business days.
              </p>
              <p className="p" style={{ color:"rgba(255,255,255,.62)", marginBottom:28 }}>
                We do not use legal language to obscure unfavorable terms. If something is not covered here and it matters to you, ask us directly and we will give you a straight answer.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <a className="btn btnP" href="mailto:compliance@sankofapublishers.com">Contact Compliance</a>
                <a className="btn btnG" href="/qa">Read the Q&amp;A</a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Privacy and Data",        email:"compliance@sankofapublishers.com" },
                  { label:"Author Rights",            email:"authors@sankofapublishers.com" },
                  { label:"Editorial Standards",      email:"submissions@sankofapublishers.com" },
                  { label:"IP and Copyright Claims",  email:"compliance@sankofapublishers.com" },
                  { label:"General Policy Questions", email:"contact@sankofapublishers.com" },
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
          QUOTE STRIP — page_map.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "Clear terms protect everyone involved.<br />That is why we write them plainly."
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
              You know where we stand.<br />Now let us build together.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Submit your manuscript, request a service consultation, or reach out with any question. We are here.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/contact">Contact Us</a>
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
