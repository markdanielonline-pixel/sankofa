import Link from "next/link"
import type { ReactNode } from "react"
import { FAQS, PROCESS_STEPS, type Faq } from "../../../lib/content"

export function Hero({ kicker, title, lead, children, image = "/images/hero2.png", compact = false }: {
  kicker: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; image?: string; compact?: boolean
}) {
  return (
    <section className={`sk-hero${compact ? " compact" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="sk-hero-img" src={image} alt="" />
      <div className="sk-hero-shade" />
      <div className="sk-hero-inner">
        <span className="sk-kicker">{kicker}</span>
        <h1 className="sk-h1">{title}</h1>
        {lead ? <p className="sk-lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  )
}

export function Section({ tone, children, narrow, id }: { tone?: "paper" | "dark"; children: ReactNode; narrow?: boolean; id?: string }) {
  return (
    <section id={id} className={`sk-section ${tone ?? ""}`}>
      <div className={narrow ? "sk-narrow" : "sk-wrap"}>{children}</div>
    </section>
  )
}

export function Heading({ kicker, title, children }: { kicker?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {kicker ? <span className="sk-kicker">{kicker}</span> : null}
      <h2 className="sk-h2">{title}</h2>
      {children}
    </div>
  )
}

export function Steps({ limit }: { limit?: number }) {
  const steps = limit ? PROCESS_STEPS.slice(0, limit) : PROCESS_STEPS
  return (
    <ol className="sk-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {steps.map(s => (
        <li className="sk-step" key={s.n}>
          <div className="sk-step-n" aria-hidden="true">{s.n}</div>
          <div><h3>{s.title}</h3><p>{s.body}</p></div>
        </li>
      ))}
    </ol>
  )
}

export function List({ items, no }: { items: string[]; no?: boolean }) {
  return <ul className={`sk-list${no ? " no" : ""}`}>{items.map(i => <li key={i}>{i}</li>)}</ul>
}

export function FaqList({ items = FAQS }: { items?: Faq[] }) {
  return (
    <div className="sk-faq">
      {items.map(f => (
        <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
      ))}
    </div>
  )
}

export function Cta({ title, body, primary = { href: "/submissions", label: "Submit Your Manuscript" }, secondary }: {
  title: string; body: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string }
}) {
  return (
    <section className="sk-cta">
      <span className="sk-kicker" style={{ color: "var(--sk-gold)" }}>Next step</span>
      <h2 className="sk-h2">{title}</h2>
      <p>{body}</p>
      <div className="sk-btnrow">
        <Link className="sk-btn primary" href={primary.href}>{primary.label}</Link>
        {secondary ? <Link className="sk-btn ghost" href={secondary.href}>{secondary.label}</Link> : null}
      </div>
    </section>
  )
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }
}
