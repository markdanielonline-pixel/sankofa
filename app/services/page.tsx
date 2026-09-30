import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { SERVICES, BASELINE_MARKETING } from "../../lib/content"

export const metadata: Metadata = {
  title: "Author Services",
  description:
    "Optional professional services for authors who want them. Never required for acceptance or publication, and buying them never influences our decision.",
  alternates: { canonical: "/services" },
}

export default function Services() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Author services"
        title="Optional help, when you want it."
        lead="Accepted books are published with no publishing fee. These services are entirely optional, are never required for acceptance or publication, and buying them never influences our decision."
      />

      <Section narrow>
        <Heading kicker="Included" title="What every accepted book already receives." />
        <p className="sk-p">Every accepted title receives professional cover and interior design, ISBN and metadata setup, distribution set-up, an author or book website and baseline launch marketing, without a separate charge. Baseline marketing covers:</p>
        <List items={BASELINE_MARKETING} />
        <p className="sk-note">We do not promise sales, reviews, media coverage or bookstore placement.</p>
      </Section>

      <Section tone="paper">
        <Heading kicker="Optional" title="Services you can add." />
        <div className="sk-grid c2">
          {SERVICES.map(s => (
            <div className="sk-card" key={s.name}>
              <h3 className="sk-h3">{s.name}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <p className="sk-note" style={{ marginTop: 24 }}>Pricing is quoted per project after a short conversation. You are always free to use an outside professional of your choice instead.</p>
      </Section>

      <Cta
        title="Start with your manuscript."
        body="Submitting is free, and you will hear from us within seven calendar days."
        secondary={{ href: "/how-it-works", label: "How It Works" }}
      />
    </div>
  )
}
