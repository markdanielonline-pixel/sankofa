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
   ACCORDION ITEM
═══════════════════════════════════════════════════════════ */
function AccordionItem({ question, answer, delay = 0 }: {
  question: string; answer: React.ReactNode; delay?: number
}) {
  const [open, setOpen] = useState(false)
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
        borderBottom: "1px solid var(--line)",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 20,
          padding: "20px 0", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          fontSize: "clamp(15px,1.6vw,17px)",
          fontWeight: 500,
          color: open ? "#C9A227" : "var(--ink)",
          lineHeight: 1.4,
          transition: "color .2s",
          fontFamily: body.style.fontFamily,
        }}>{question}</span>
        <span style={{
          width: 24, height: 24, borderRadius: "50%",
          border: `1px solid ${open ? "#C9A227" : "var(--line)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: open ? "#C9A227" : "rgba(11,11,12,.40)",
          flexShrink: 0, marginTop: 2,
          transition: "transform .28s ease, border-color .2s, color .2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 600 : 0,
        overflow: "hidden",
        transition: "max-height .42s ease",
      }}>
        <div style={{ paddingBottom: 20 }}>
          {answer}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ SECTION WRAPPER
═══════════════════════════════════════════════════════════ */
function FAQSection({ kicker, title, items }: {
  kicker: string
  title: string
  items: { q: string; a: React.ReactNode }[]
}) {
  return (
    <div>
      <Reveal>
        <span style={{
          fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase",
          color: "#C9A227", display: "block", marginBottom: 8, fontWeight: 600,
        }}>{kicker}</span>
        <h2 className={display.className} style={{
          fontSize: "clamp(22px,2.4vw,34px)", fontWeight: 400,
          letterSpacing: "-0.022em", lineHeight: 1.1,
          margin: "0 0 24px",
        }}>{title}</h2>
      </Reveal>
      <div>
        {items.map(({ q, a }, i) => (
          <AccordionItem key={q} question={q} answer={a} delay={i * 0.04} />
        ))}
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
  .p:last-child { margin-bottom:0; }
  .card { background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 6px 32px rgba(0,0,0,.055); padding:32px; }

  .btn  { display:inline-flex; align-items:center; justify-content:center; padding:13px 26px; border-radius:999px; font-weight:600; font-size:14px; cursor:pointer; transition:transform .18s,box-shadow .18s,background .18s; text-decoration:none; }
  .btnP { background:#C9A227; color:#140F05; box-shadow:0 8px 28px rgba(201,162,39,.28); }
  .btnP:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(201,162,39,.40); }
  .btnG { border:1px solid rgba(201,162,39,.55); color:#C9A227; background:transparent; }
  .btnG:hover { transform:translateY(-3px); background:rgba(201,162,39,.06); border-color:#C9A227; }

  .answerP { font-size:15px; line-height:1.78; color:rgba(11,11,12,.68); margin:0 0 10px; }
  .answerP:last-child { margin-bottom:0; }

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
    .card { padding:22px 18px; }
    .sigImg { width:80vw; max-width:80vw; bottom:-60px; left:-8px; }
    .ctaShift { padding-left:24px !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function QAPage() {
  const sigFloat = useFloat(9, 0.38)

  return (
    <main className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grain" aria-hidden />
      <ScrollBar />
      <SideLabel text="Q&A · Sankofa Publishers" />

      {/* ══════════════════════════════════════════
          PAGE TITLE BAND
      ══════════════════════════════════════════ */}
      <section className="ptBand">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 560px 300px at 6% 80%,rgba(201,162,39,.11),transparent 55%)", pointerEvents:"none" }} />
        <div className="pc" style={{ position:"relative", zIndex:2 }}>
          <div className="ptA1"><span className="kicker">Sankofa Publishers</span></div>
          <h1 className={`${display.className} ptA2`} style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:300, color:"white", lineHeight:1.05, letterSpacing:"-0.025em", margin:"0 0 18px", maxWidth:700 }}>
            Questions &amp; Answers
          </h1>
          <div className="ptA3" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <GoldWipe delay={0.1} />
            <p style={{ margin:0, fontSize:15, color:"rgba(255,255,255,.52)" }}>
              Honest answers to the questions authors ask most.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INTRO
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <div className="card">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
              <Reveal>
                <span className="kicker">Before You Ask</span>
                <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,36px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px" }}>
                  We Answer Directly. Always.
                </h2>
                <p className="p">The publishing industry is full of vague language designed to obscure unfavorable terms. We operate differently. Every answer here is direct, complete, and unambiguous.</p>
                <p className="p" style={{ marginBottom:0 }}>If your question is not answered here, contact us. We will respond with the same directness you find on this page.</p>
              </Reveal>
              <Reveal delay={0.12}>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { num:"6",   label:"Question categories covered" },
                    { num:"35+", label:"Individual questions answered" },
                    { num:"2",   label:"Business day response to unlisted questions" },
                  ].map(({ num, label }) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:18, padding:"16px 20px", border:"1px solid var(--line)", borderRadius:14, background:"#fff" }}>
                      <span className={display.className} style={{ fontSize:36, fontWeight:300, color:"#C9A227", lineHeight:1, minWidth:56 }}>{num}</span>
                      <span style={{ fontSize:13, color:"rgba(11,11,12,.55)", lineHeight:1.5 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          THE MODEL
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <FAQSection
            kicker="Category 01"
            title="The Publishing Model"
            items={[
              {
                q: "Is it really free to publish with Sankofa?",
                a: <><p className="answerP">Yes. If your manuscript meets our editorial standards and is publication ready, we publish it at no cost to you. There are no submission fees, no mandatory service purchases, and no upfront costs of any kind.</p><p className="answerP">Our sustainability comes from optional services, not from charging authors to publish. The two are structurally separate.</p></>,
              },
              {
                q: "What does 'hybrid publishing' mean?",
                a: <p className="answerP">Hybrid publishing combines the professional standards of traditional publishing — editorial review, production quality, global distribution — with the author-centered model of independent publishing. Authors retain full rights and royalties. We provide the infrastructure. No vanity press dynamics. No exploitation.</p>,
              },
              {
                q: "How does Sankofa make money if publishing is free?",
                a: <><p className="answerP">Through optional professional services — editing, ghostwriting, cover design, formatting, audiobook production, marketing, and the Author Portal. Authors choose what they need. Nothing is mandatory.</p><p className="answerP">Our publishing decisions are never influenced by whether an author has purchased services. Editorial acceptance is based solely on manuscript quality.</p></>,
              },
              {
                q: "What is the difference between Sankofa and a vanity press?",
                a: <><p className="answerP">A vanity press charges authors to publish regardless of quality. Manuscripts are accepted based on payment, not standards. Sankofa accepts manuscripts based on editorial review alone — no payment involved.</p><p className="answerP">We also do not seize rights, impose royalty splits, or charge recurring fees for continued publication. The model is structurally different at every level.</p></>,
              },
              {
                q: "What is the difference between Sankofa and self-publishing?",
                a: <p className="answerP">Self-publishing places the entire production burden on the author — editing, design, formatting, distribution setup, metadata, ISBN registration, and marketing. Sankofa handles all of this under one publishing agreement. You write. We build the infrastructure around your work.</p>,
              },
            ]}
          />
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          SUBMISSIONS
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <FAQSection
            kicker="Category 02"
            title="Submissions &amp; Review"
            items={[
              {
                q: "How long does the review process take?",
                a: <p className="answerP">Up to 45 days from the date of confirmed receipt. We acknowledge all submissions within five business days. If you have not received acknowledgment within that window, contact us directly.</p>,
              },
              {
                q: "What are the three possible outcomes of submission?",
                a: <><p className="answerP"><strong>Full Acceptance</strong> — The manuscript meets our standards and proceeds to agreement and production immediately.</p><p className="answerP"><strong>Conditional Acceptance</strong> — The manuscript shows strong potential but requires specified revisions before publication can proceed.</p><p className="answerP"><strong>Rejection</strong> — The manuscript does not meet our current standards. Rejection does not prohibit resubmission after revision.</p></>,
              },
              {
                q: "Can I submit if my manuscript is not fully edited?",
                a: <p className="answerP">You may submit, but unedited manuscripts are unlikely to meet our standards. We recommend using our Publishing Readiness Assessment or editorial services before submitting if you are uncertain about your manuscript's readiness. Submitting an unready manuscript does not advance your position.</p>,
              },
              {
                q: "Do you accept AI-assisted manuscripts?",
                a: <p className="answerP">Yes, with full disclosure. AI-assisted content must be declared at submission. Failure to disclose may result in rejection or termination of a publishing agreement if discovered after acceptance. We do not prohibit AI assistance — we require transparency about it.</p>,
              },
              {
                q: "Can I submit a manuscript I have already self-published?",
                a: <p className="answerP">Previously self-published work may be considered on a case-by-case basis, particularly if the work has been substantially revised or if you are seeking to transition from self-published to formally distributed. Contact us before submitting to discuss your specific situation.</p>,
              },
              {
                q: "Does purchasing the Publishing Readiness Assessment guarantee acceptance?",
                a: <p className="answerP">No. Selecting the PRA does not influence the editorial decision. It provides a structured professional evaluation that improves manuscript readiness. If you purchase the PRA at the time of submission and your manuscript is not accepted, you receive a 100% refund.</p>,
              },
            ]}
          />
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          RIGHTS & ROYALTIES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <FAQSection
            kicker="Category 03"
            title="Rights &amp; Royalties"
            items={[
              {
                q: "Do I keep my copyright?",
                a: <p className="answerP">Yes. 100%. Sankofa Publishers does not acquire copyright. You own your work before, during, and after publication. We receive only limited non-exclusive publishing and distribution permission through a formal agreement.</p>,
              },
              {
                q: "How are royalties calculated?",
                a: <><p className="answerP">Royalties are 100% of net revenue. Net revenue is gross retail sales minus retailer fees, distribution fees, per-unit printing costs (for print-on-demand), and payment processing fees.</p><p className="answerP">The remainder is your royalty. All of it. Sankofa does not take a percentage of your earnings.</p></>,
              },
              {
                q: "When and how are royalties paid?",
                a: <><p className="answerP"><strong>Standard Reporting (Free):</strong> Manual royalty payments every six months with a full breakdown of units sold, fees deducted, and net earnings.</p><p className="answerP"><strong>Author Portal ($49/month):</strong> Real-time dashboard, automated direct bank deposits, downloadable reports, and detailed analytics.</p></>,
              },
              {
                q: "Can I withdraw my book from publication?",
                a: <p className="answerP">Yes. A 30-day written notice is required to allow for proper distribution withdrawal and record management per industry standards. After the notice period, your title is removed from all distribution channels and all rights revert fully to you.</p>,
              },
              {
                q: "Who controls the retail price of my book?",
                a: <p className="answerP">Pricing is determined collaboratively. We provide strategic pricing recommendations designed to protect your profitability and maintain market competitiveness. Final pricing decisions are made with your involvement and agreement — not unilaterally imposed.</p>,
              },
            ]}
          />
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--paper)" }}>
        <div className="pc">
          <FAQSection
            kicker="Category 04"
            title="Professional Services"
            items={[
              {
                q: "Are services mandatory to publish with Sankofa?",
                a: <p className="answerP">No. Services are entirely optional. If your manuscript meets our standards without any additional support, we publish it. We never require service purchases as a condition of publication or as a condition of editorial review.</p>,
              },
              {
                q: "If I purchase services, does that improve my chances of acceptance?",
                a: <p className="answerP">Only indirectly — in that a better-prepared manuscript has a stronger chance of meeting our standards. Service purchases do not influence the editorial decision itself. A manuscript that does not meet our standards will be rejected regardless of what services were purchased.</p>,
              },
              {
                q: "How does ghostwriting confidentiality work?",
                a: <p className="answerP">All ghostwriting engagements are protected by a strict non-disclosure agreement. Sankofa will never disclose, reference, or claim any involvement in the production of your manuscript. The published work carries your name only. The NDA is mutual and permanent.</p>,
              },
              {
                q: "Do I own the cover design and formatting files?",
                a: <p className="answerP">Yes. All designed assets — cover files, interior layout files, and any other production materials created for your manuscript — belong to you. We deliver all source files upon project completion. You may use them with any publisher or platform.</p>,
              },
            ]}
          />
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          CULTURAL IDENTITY
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="pc">
          <FAQSection
            kicker="Category 05"
            title="Cultural Identity &amp; Mission"
            items={[
              {
                q: "Do you only publish African and diasporic authors?",
                a: <p className="answerP">Sankofa's primary focus is African and diasporic narrative. Authors do not need to be African or of African descent to submit — but the work must engage meaningfully and responsibly with African or diasporic subject matter, history, analysis, or culture. We do not publish work that approaches these subjects from a colonial or extractive perspective.</p>,
              },
              {
                q: "Does Sankofa have a political agenda?",
                a: <p className="answerP">We have a cultural position — not a partisan political agenda. We believe in narrative sovereignty, author ownership, and the dignity of African and diasporic intellectual life. We publish across a wide range of perspectives within that framework. We do not align with political parties or ideological extremism of any kind.</p>,
              },
              {
                q: "Why does Sankofa not publish faith-based content?",
                a: <p className="answerP">Sankofa's publishing scope is cultural, analytical, literary, and historical. Faith-based doctrinal content falls outside that scope. This is a question of focus — not a judgment on faith. Our founder has a pastoral background and deep respect for spiritual life. The press simply is not the right infrastructure for devotional or doctrinal publishing.</p>,
              },
              {
                q: "Is Sankofa anti-anyone?",
                a: <p className="answerP">No. Sankofa is pro-African. Those are not the same thing. We do not publish work rooted in hatred toward any group. Disciplined love of African identity does not require hostility toward anyone else. We are reconstructive — not reactionary.</p>,
              },
            ]}
          />
        </div>
      </section>

      <hr className="divLine" />

      {/* ══════════════════════════════════════════
          STILL HAVE QUESTIONS  (dark)
      ══════════════════════════════════════════ */}
      <section className="sec" style={{ background:"var(--ink)", color:"white" }}>
        <div className="pc">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="twoCol">
            <Reveal>
              <span className="kicker">Still Have Questions?</span>
              <h2 className={display.className} style={{ fontSize:"clamp(24px,2.6vw,38px)", fontWeight:400, letterSpacing:"-0.022em", lineHeight:1.1, margin:"0 0 14px", color:"white" }}>
                We Answer Every Question. Directly.
              </h2>
              <p className="p" style={{ color:"rgba(255,255,255,.62)" }}>
                If your question is not on this page, send it to us. We respond to all genuine inquiries within two business days with the same directness you found here.
              </p>
              <p className="p" style={{ color:"rgba(255,255,255,.62)", marginBottom:28 }}>
                We do not deflect. We do not use vague language to avoid uncomfortable answers. If there is a limitation or condition you should know about, we will tell you directly.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <a className="btn btnP" href="mailto:contact@sankofapublishers.com">Ask Your Question</a>
                <a className="btn btnG" href="/submissions">View Submission Info</a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"General Questions",   email:"contact@sankofapublishers.com" },
                  { label:"Submissions",          email:"submissions@sankofapublishers.com" },
                  { label:"Services",             email:"services@sankofapublishers.com" },
                  { label:"Press & Media",        email:"press@sankofapublishers.com" },
                  { label:"Partnerships",         email:"partnerships@sankofapublishers.com" },
                ].map(({ label, email }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(255,255,255,.03)", transition:"background .2s,border-color .2s" }}
                    onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(201,162,39,.07)"; el.style.borderColor="rgba(201,162,39,.25)" }}
                    onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.background="rgba(255,255,255,.03)"; el.style.borderColor="rgba(255,255,255,.08)" }}
                  >
                    <span style={{ fontSize:12, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color:"rgba(255,255,255,.50)" }}>{label}</span>
                    <a href={`mailto:${email}`} style={{ fontSize:13, color:"rgba(201,162,39,.80)", textDecoration:"none", transition:"color .18s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#C9A227")}
                      onMouseLeave={e=>(e.currentTarget.style.color="rgba(201,162,39,.80)")}
                    >{email}</a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE STRIP — family.png lands here
      ══════════════════════════════════════════ */}
      <section style={{ background:"var(--paper)", padding:"52px 0 60px", position:"relative", zIndex:2 }}>
        <div className="pc">
          <Reveal>
            <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
              <p className={display.className} style={{ fontSize:"clamp(20px,2.6vw,34px)", fontWeight:300, lineHeight:1.5, color:"var(--ink)", margin:"0 0 14px", letterSpacing:"-0.015em" }}>
                "We do not publish for the market.<br />We publish for the record."
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
            <span className="kicker">Ready to Move Forward?</span>
            <h2 className={display.className} style={{ fontSize:"clamp(28px,3.4vw,50px)", fontWeight:300, color:"white", lineHeight:1.1, letterSpacing:"-0.02em", margin:"0 0 16px", maxWidth:480 }}>
              Your questions are answered.<br />Now let's build.
            </h2>
            <p className="p" style={{ color:"rgba(255,255,255,.50)", maxWidth:380, margin:"0 0 32px", fontSize:15 }}>
              Submit your manuscript, explore our services, or reach out directly. We are here and we respond.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <a className="btn btnP" href="/submissions">Submit Your Manuscript</a>
              <a className="btn btnG" href="/contact">Contact Us</a>
            </div>
          </Reveal>
        </div>

        {/* PAGE SIGNATURE — family.png */}
        <img
          src="/images/family.png"
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
