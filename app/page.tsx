import Link from "next/link"
import type { Metadata } from "next"
import { Hero, Section, Heading, Steps, FaqList, Cta, JsonLd, faqJsonLd } from "./components/site/Ui"
import { FACTS, OFFER_POINTS, FAQS, SITE } from "../lib/content"
import BookShelf, { getShelfBooks } from "./components/site/BookShelf"
export const revalidate = 300

export const metadata: Metadata = {
  title: "Sankofa Publishers | Selective Independent Publishing for African, Caribbean & Diaspora Voices",
  description: `No publishing fee for accepted books. Keep your copyright. Earn ${FACTS.royaltyPct}% of net receipts. Sankofa is a selective independent publishing house for Africa, the Caribbean and the global African diaspora.`,
  alternates: { canonical: "/" },
}

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.tagline,
  logo: `${SITE.url}/favicon-512.png`,
  email: FACTS.email.general,
}

export default async function HomePage() {
  const books = await getShelfBooks()
  return (
    <div className="sk-body">
      <JsonLd data={orgLd} />
      <Hero
        kicker="No publishing fee. Ever."
        title={<>We invest in the books. You keep your rights.</>}
        lead={`Sankofa is an independent publisher investing in books that can have a positive impact on Africa, the Caribbean and the global diaspora. If we accept your book, you pay nothing to publish it. We pay for the professional design, production and worldwide distribution, and you earn ${FACTS.royaltyPct}% of net receipts.`}
      >
        <div className="sk-btnrow">
          <Link className="sk-btn primary" href="/submissions">Submit Your Manuscript</Link>
          <Link className="sk-btn ghost" href="/how-it-works">How Publishing Works</Link>
        </div>
      </Hero>

      <section className="sk-strip" aria-label="Key terms">
        <div className="sk-wrap sk-strip-grid">
          <div className="sk-strip-item"><b>$0</b><span>publishing fee for accepted books</span></div>
          <div className="sk-strip-item"><b>Yours</b><span>you keep your copyright</span></div>
          <div className="sk-strip-item"><b>{FACTS.royaltyPct}%</b><span>of net receipts, from the first sale</span></div>
          <div className="sk-strip-item"><b>{FACTS.responseDays} days</b><span>target for our first response</span></div>
        </div>
      </section>

      <Section tone="paper">
        <Heading kicker="From the Sankofa list" title="Our first book is out now." />
        <BookShelf books={books} slots={4} />
        <div className="sk-btnrow" style={{ marginTop: 28 }}><Link className="sk-btn ghost onlight" href="/books">See all our books</Link></div>
      </Section>

      <Section tone="dark">
        <Heading kicker="Zero publishing fee" title="You should never have to pay to have your book published." />
        <div className="sk-two">
          <div>
            <p className="sk-p">Many companies that call themselves publishers charge authors thousands of dollars before a single copy is sold. Sankofa does not. When we accept a book, we carry the cost of editing guidance, cover and interior design, production and distribution set-up.</p>
            <p className="sk-p">That is why we are selective. We put our own money behind each book, so we only choose books we believe can make a real difference for readers across Africa, the Caribbean and the diaspora.</p>
          </div>
          <div>
            <p className="sk-p"><strong>Free to submit. Free to be assessed. No fee if accepted.</strong> Optional paid services exist, but they are never required and never influence our decision.</p>
            <div className="sk-btnrow" style={{ marginTop: 18 }}>
              <Link className="sk-btn primary" href="/submissions">Submit Your Manuscript</Link>
              <Link className="sk-btn ghost" href="/compare">See how we compare</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading kicker="What you get" title="Traditional publishing without the traditional barriers. Independent publishing without doing everything yourself." />
        <div className="sk-grid c3">
          {OFFER_POINTS.map(o => (
            <div className="sk-card" key={o.title}>
              <h3 className="sk-h3">{o.title}</h3>
              <p>{o.body}</p>
            </div>
          ))}
        </div>
        <p className="sk-note" style={{ marginTop: 22 }}>
          Publication is selective and free of any publishing fee. Optional paid services exist, and they are never required for acceptance or publication.
        </p>
      </Section>

      <Section>
        <div className="sk-two">
          <div>
            <Heading kicker="Who we are" title="Selective by design, generous in terms." />
            <p className="sk-p">Sankofa is not a vanity press. We choose the books we publish, and we choose them because we believe in them and in their readers. That is what allows us to take no fee from the authors we accept.</p>
            <p className="sk-p">Our list is centered on Africa, the Caribbean and the global African diaspora, including books that engage their histories, cultures, experiences, ideas or audiences. A book does not have to be about Africa to belong here.</p>
            <div className="sk-btnrow" style={{ marginTop: 22 }}>
              <Link className="sk-btn ghost onlight" href="/what-we-publish">See what we publish</Link>
            </div>
          </div>
          <div className="sk-card">
            <span className="sk-kicker">Your rights</span>
            <p className="sk-callout" style={{ margin: "0 0 12px" }}>Your copyright remains yours.</p>
            <p>You grant Sankofa an exclusive worldwide publishing license for print, ebook and audiobook for an initial {FACTS.termYears}-year term. Film, translation, merchandising and other rights not expressly granted stay with you.</p>
            <p style={{ marginTop: 14 }}><Link href="/royalties" style={{ color: "var(--sk-gold-deep)", fontWeight: 600 }}>Read about rights and royalties</Link></p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <Heading kicker="Distribution" title="Available to bookstores. Not dependent on bookstores." />
        <div className="sk-grid c2">
          <div>
            <p className="sk-p">Your book is made available through a global wholesale and retail network, so readers, libraries and bookstores can order it. Print-on-demand and direct sales mean we avoid printing stock nobody has asked for.</p>
            <p className="sk-p">Every accepted title also receives an author or book website, with direct-sales capability, so your readers can buy from you.</p>
          </div>
          <div>
            <Link className="sk-btn ghost onlight" href="/distribution">Marketing and distribution</Link>
          </div>
        </div>
      </Section>

      <Section>
        <Heading kicker="How it works" title="From submission to royalties, in ten clear steps." />
        <Steps limit={5} />
        <div className="sk-btnrow"><Link className="sk-btn ghost onlight" href="/how-it-works">See all ten steps</Link></div>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Questions" title="Straight answers." />
        <FaqList items={FAQS.slice(0, 6)} />
        <p style={{ marginTop: 20 }}><Link href="/faq" style={{ color: "var(--sk-gold-deep)", fontWeight: 600 }}>All questions and answers</Link></p>
      </Section>

      <JsonLd data={faqJsonLd(FAQS.slice(0, 6))} />
      <Cta
        title="If your book deserves readers, we would like to read it."
        body={`Submission is free and needs no payment details. Submitting does not guarantee acceptance, and we aim to respond within ${FACTS.responseDays} calendar days.`}
        secondary={{ href: "/how-it-works", label: "How Publishing Works" }}
      />
    </div>
  )
}
