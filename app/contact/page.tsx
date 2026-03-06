"use client"

import React, { useEffect, useRef, useState } from "react"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS  ← identical on every page
═══════════════════════════════════════════════════════════ */

function useReveal(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
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
   CONTACT FORM
═══════════════════════════════════════════════════════════ */
function ContactForm() {
  const [dept, setDept] = useState("General")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const depts = ["General", "Submissions", "Services", "Press & Media", "Partnerships", "Author Support"]

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "1px solid var(--line)",
    fontSize: 14,
    fontFamily: body.style.fontFamily,
    color: "var(--ink)",
    background: "#fff",
    outline: "none",
    transition: "border-color .18s, box-shadow .18s",
  }

  const handleSubmit = async () => {
    if (!name || !email || !message) return
    setSending(true)
    // Simulate send — replace with your actual form handler / API route
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{
        padding: "48px 32px", textAlign: "center",
        border: "1px solid rgba(201,162,39,.3)",
        borderRadius: 20, background: "rgba(201,162,39,.04)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
        <h3 className={display.className} style={{ fontSize: "clamp(20px,2vw,28px)", fontWeight: 400, margin: "0 0 12px", letterSpacing: "-0.018em" }}>
          Message Received
        </h3>
        <p style={{ fontSize: 15, color: "rgba(11,11,12,.60)", lineHeight: 1.7, margin: "0 0 24px" }}>
          Thank you, {name}. We will respond within two business days.
        </p>
        <button
          onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage("") }}
          style={{ background: "none", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 22px", fontSize: 13, cursor: "pointer", color: "rgba(11,11,12,.60)", fontFamily: body.style.fontFamily }}
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Department selector */}
      <div>
        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "#C9A227", display: "block", marginBottom: 8 }}>
          Department
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {depts.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: body.style.fontFamily,
                border: `1px solid ${dept === d ? "#C9A227" : "var(--line)"}`,
                background: dept === d ? "rgba(201,162,39,.10)" : "#fff",
                color: dept === d ? "#C9A227" : "rgba(11,11,12,.50)",
                transition: "all .18s",
              }}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* Name + Email row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="twoCol">
        <div>
          <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.40)", display: "block", marginBottom: 6 }}>Full Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "#C9A227"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,162,39,.10)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.40)", display: "block", marginBottom: 6 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "#C9A227"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,162,39,.10)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none" }}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.40)", display: "block", marginBottom: 6 }}>Subject</label>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Brief subject"
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = "#C9A227"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,162,39,.10)" }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none" }}
        />
      </div>

      {/* Message */}
      <div>
        <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(11,11,12,.40)", display: "block", marginBottom: 6 }}>Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your message..."
          rows={6}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={e => { e.currentTarget.style.borderColor = "#C9A227"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,162,39,.10)" }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none" }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={sending || !name || !email || !message}
        style={{
          padding: "14px 28px", borderRadius: 999,
          background: (!name || !email || !message) ? "rgba(201,162,39,.35)" : "#C9A227",
          color: "#140F05", fontWeight: 600, fontSize: 14,
          border: "none", cursor: (!name || !email || !message) ? "not-allowed" : "pointer",
          fontFamily: body.style.fontFamily,
          transition: "transform .18s, box-shadow .18s, background .18s",
          boxShadow: (!name || !email || !message) ? "none" : "0 8px 28px rgba(201,162,39,.28)",
          alignSelf: "flex-start",
        }}
        onMouseEnter={e => { if (name && email && message) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 36px rgba(201,162,39,.38)" } }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(201,162,39,.28)" }}
      >
        {sending ? "Sending…" : `Send to ${dept} →`}
      </button>

      <p style={{ fontSize: 12, color: "rgba(11,11,12,.38)", margin: 0, lineHeight: 1.6 }}>
        We respond to all genuine inquiries within two business days. Your information is never shared or sold.
      </p>
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

  /* dept card */
  .deptCard { border:1px solid var(--line); border-radius:16px; padding:22px 20px; background:#fff; transition:box-shadow .22s,transform .22s,border-color .22s; cursor:default; }
  .deptCard:hover { box-shadow:0 12px 40px rgba(0,0,0,.08); transform:translateY(-3px); border-color:rgba(201,162,39,.3); }

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
export default function ContactPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Contact · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Contact Us
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              We respond to every genuine inquiry. Directly. Within two business days.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEPARTMENT CONTACTS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">Reach the Right Team</span>
            <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px" }}>
              Department Contacts
            </h2>
            <p className="p" style={{ maxWidth:540, marginBottom:0 }}>
              Each department has a dedicated inbox. Contact the team that best matches your inquiry for the fastest response.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { dept:"General Inquiries",   email:"contact@sankofapublishers.com",     desc:"For anything that doesn't fit another category. We'll route your message to the right person.",   response:"2 business days" },
              { dept:"Submissions",          email:"submissions@sankofapublishers.com", desc:"Questions about submitting your manuscript, submission status, or the review process.",            response:"2 business days" },
              { dept:"Professional Services",email:"services@sankofapublishers.com",   desc:"Editing, ghostwriting, design, production, marketing, and the Author Portal.",                    response:"2 business days" },
              { dept:"Press & Media",        email:"press@sankofapublishers.com",       desc:"Interview requests, press kits, media appearances, fact-checking, and speaking engagements.",    response:"1 business day" },
              { dept:"Partnerships",         email:"partnerships@sankofapublishers.com",desc:"Institutional partnerships, co-publication inquiries, distribution agreements, and sponsorship.", response:"3 business days" },
              { dept:"Author Support",       email:"authors@sankofapublishers.com",     desc:"Current authors with questions about their manuscripts, production status, or royalty reporting.", response:"2 business days" },
            ].map(({ dept, email, desc, response }, i) => (
              <Reveal key={dept} delay={i * 0.07}>
                <div className="deptCard">
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 8px" }}>{dept}</p>
                  <p style={{ fontSize:14, color:"rgba(11,11,12,.65)", lineHeight:1.6, margin:"0 0 14px" }}>{desc}</p>
                  <a
                    href={`mailto:${email}`}
                    style={{ fontSize:13, color:"var(--ink)", fontWeight:500, display:"block", marginBottom:8, transition:"color .18s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#C9A227")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--ink)")}
                  >{email}</a>
                  <span style={{ fontSize:11, color:"rgba(11,11,12,.38)", letterSpacing:".04em" }}>Response: {response}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          CONTACT FORM + OFFICE INFO
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"start" }} className="twoCol">

            {/* form */}
            <Reveal>
              <span className="kicker">Send a Message</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.4vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 24px" }}>
                Write to Us Directly
              </h2>
              <ContactForm />
            </Reveal>

            {/* office + info */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Reveal delay={0.12}>
                <div className="card">
                  <span className="kicker">Office</span>
                  <p style={{ fontSize:14, color:"rgba(11,11,12,.65)", lineHeight:1.9, margin:"4px 0 0" }}>
                    Sankofa Publishers, LLC<br />
                    102 Marquez Place<br />
                    Santa Fe, NM 87505<br />
                    United States
                  </p>
                  <hr style={{ border:"none", borderTop:"1px solid var(--line)", margin:"18px 0" }} />
                  <span className="kicker" style={{ marginBottom:8 }}>Business Hours</span>
                  <p style={{ fontSize:14, color:"rgba(11,11,12,.65)", lineHeight:1.9, margin:0 }}>
                    Monday – Friday<br />
                    9:00 AM – 5:00 PM MST
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="card" style={{ background:"var(--ink)", border:"none", color:"white" }}>
                  <span className="kicker">Our Commitment</span>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,.62)", lineHeight:1.75, margin:"4px 0 0" }}>
                    We do not use automated responses for genuine inquiries. Every message is read by a person. Every reply is written by a person.
                  </p>
                  <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,.09)", margin:"16px 0" }} />
                  <p style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.82)", margin:0 }}>
                    Two business day response. No exceptions.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="card">
                  <span className="kicker">Before You Write</span>
                  <p style={{ fontSize:14, color:"rgba(11,11,12,.65)", lineHeight:1.75, margin:"4px 0 12px" }}>
                    Many common questions are already answered in our Q&amp;A section. Check there first — you may get an immediate answer.
                  </p>
                  <a className="btn btnG" href="/qa" style={{ fontSize:13, padding:"10px 20px" }}>
                    View Q&amp;A →
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT TO EXPECT  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <Reveal>
            <span className="kicker">What to Expect</span>
            <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 8px", color:"white" }}>
              How We Communicate
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.58)", maxWidth:560, marginBottom:0 }}>
              Our communication standard is the same as our publishing standard — direct, complete, and professional.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:32 }} className="threeCol">
            {[
              { title:"We Answer the Question Asked",    body:"We do not deflect, redirect, or give vague responses. If you ask a direct question, you receive a direct answer — including if the answer is no." },
              { title:"We Do Not Upsell on Contact",     body:"Reaching out does not put you into a sales funnel. We will not follow up repeatedly or pressure you toward services you did not ask about." },
              { title:"We Respect Your Time",            body:"Our responses are concise and actionable. We do not send long form replies when a short clear answer is what is needed." },
            ].map(({ title, body: txt }, i) => (
              <Reveal key={title} delay={i * 0.09}>
                <div style={{ border:"1px solid rgba(255,255,255,.09)", borderRadius:14, padding:"22px 20px", background:"rgba(255,255,255,.03)", transition:"background .2s,border-color .2s", cursor:"default" }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.07)"; el.style.borderColor="rgba(201,162,39,.25)" }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(255,255,255,.03)"; el.style.borderColor="rgba(255,255,255,.09)" }}
                >
                  <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".16em", color:"#C9A227", margin:"0 0 10px" }}>{title}</p>
                  <p className="p" style={{ margin:0, fontSize:14, color:"rgba(255,255,255,.58)" }}>{txt}</p>
                </div>
              </Reveal>
            ))}
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
                "Every conversation begins with respect.<br />Every answer begins with truth."
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
            <span className="kicker">We Are Here</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              A real team.<br />Real responses.<br />Real decisions.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Whatever your question — manuscript, services, partnership, or press — reach out. We will respond directly.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="mailto:contact@sankofapublishers.com">Send Us a Message</a>
              <a className="btn btnG" href="/qa">Read the Q&amp;A First</a>
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
