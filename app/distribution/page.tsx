import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { BASELINE_MARKETING } from "../../lib/content"

export const metadata: Metadata = {
  title: "Marketing & Distribution | Sankofa Publishers",
  description: "Worldwide availability, an author or book website with direct sales, baseline launch marketing and optional audiobook production for every Sankofa author.",
  alternates: { canonical: "/distribution" },
}

export default function Distribution() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Marketing and distribution"
        title="Available to bookstores. Not dependent on bookstores."
        lead="Your book is made available through a global wholesale and retail distribution network, and sold directly to your readers through a website of its own."
      />

      <Section narrow>
        <Heading kicker="Distribution" title="Where your book can be found." />
        <p className="sk-p">Accepted titles are set up for availability through online retailers, wholesale channels used by bookstores and libraries, and ebook platforms. We lean on print-on-demand so we are not printing stock nobody has asked for.</p>
        <p className="sk-p">Being available for order is not the same as being stocked on a shelf, and we do not promise bookstore placement. What we do is make sure any reader or store that wants your book can get it.</p>
      </Section>

      <Section tone="paper">
        <div className="sk-two">
          <div>
            <Heading kicker="Direct sales" title="A home for you and your book." />
            <p className="sk-p">Every accepted title receives either a Sankofa-built author or book website, or a direct-sales connection to the website you already have.</p>
            <p className="sk-p">Selling directly can be better economics for a book because fewer intermediaries take a share. Your contractual share stays the same: {`60%`} of net receipts.</p>
            <p className="sk-note">Websites are built from your details and are a real marketing asset. Exact features may vary from book to book.</p>
          </div>
          <div className="sk-card">
            <h3 className="sk-h3">Your website can include</h3>
            <List items={["Author biography and book description", "Your cover and reviews", "Purchase options", "Media and press", "Mailing list sign-up", "Contact and social links", "Your other titles"]} />
          </div>
        </div>
      </Section>

      <Section narrow>
        <Heading kicker="Marketing" title="What launch support includes." />
        <p className="sk-p">Every book receives a standard, largely automated launch toolkit:</p>
        <List items={BASELINE_MARKETING} />
        <p className="sk-p">You are an important part of promoting your book. Sankofa provides the infrastructure and the execution, not guaranteed demand, and we cannot promise sales, reviews, rankings, media coverage or rights deals.</p>
        <p className="sk-p">Premium marketing and paid advertising management are available as optional services.</p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Audiobooks" title="Audio, when you want it." />
        <p className="sk-p">Audiobook production is optional. You can supply files that meet our quality requirements, or purchase production from us, with AI narration where suitable or human narration as a premium option. Audiobook sales are included in your regular royalty statements.</p>
      </Section>

      <Cta
        title="Give your book a way to reach readers."
        body="Submission is free and needs no payment details."
        secondary={{ href: "/services", label: "Optional Services" }}
      />
    </div>
  )
}
