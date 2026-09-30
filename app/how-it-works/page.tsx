import type { Metadata } from "next"
import { Hero, Section, Heading, Steps, Cta } from "../components/site/Ui"
import { FACTS } from "../../lib/content"

export const metadata: Metadata = {
  title: "How Publishing Works | Sankofa Publishers",
  description: `From free submission to quarterly royalties: how Sankofa selects, produces, launches and pays its authors. First response within ${FACTS.responseDays} days.`,
  alternates: { canonical: "/how-it-works" },
}

export default function HowItWorks() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Publish with us"
        title="How publishing with Sankofa works."
        lead="A clear path from manuscript to published book, with no publishing fee for accepted authors and no guessing about what happens next."
      />

      <Section narrow>
        <Heading kicker="The path" title="Ten steps from submission to royalties." />
        <Steps />
        <p className="sk-note" style={{ marginTop: 22 }}>
          Our target for a first response is {FACTS.responseDays} calendar days. For a standard text-based book, production typically takes about {FACTS.productionWeeks} weeks from a production-ready manuscript. That is an estimate, not a guarantee, and depends on the book&rsquo;s complexity, author response times and the approved launch date.
        </p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Conditional acceptance" title="If your manuscript needs work." />
        <p className="sk-p">Sometimes we want a book but it needs substantial editing first. When that happens we offer conditional acceptance together with a written report that explains what needs to change and why.</p>
        <p className="sk-p">You then choose how to get there: revise it yourself, hire any qualified editor you like, or use Sankofa&rsquo;s optional editorial service. Buying our editing is never required. Whoever edits it, we reassess the revised manuscript in the same way.</p>
      </Section>

      <Section narrow>
        <Heading kicker="Good to know" title="How publishers choose books." />
        <p className="sk-p">Publishing is a business as well as an art. Traditional and independent publishers alike do not accept a manuscript simply because it exists. They weigh quality, the audience for the book, its market potential, the author&rsquo;s platform and the cost of producing it well, and they ask whether it fits their list.</p>
        <p className="sk-p">Sankofa is selective in the same way. Publishing without a fee does not mean automatic acceptance. Our editorial assessment is a free, professional evaluation of your book, not a paid gate.</p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Good to know" title="The truth about advances." />
        <p className="sk-p">In traditional publishing, an advance is generally a payment made against the royalties a book is expected to earn. Until the book earns that amount back, the author normally receives no further royalty payments.</p>
        <p className="sk-p">Sankofa works differently. We pay no advance, so there is nothing to earn out, and your share of net receipts begins with the first qualifying sale. This is a different economic model, not a verdict on any other way of publishing. Many authors value a traditional advance, and for some books it is the right choice.</p>
      </Section>

      <Section narrow>
        <Heading kicker="Good to know" title="Bookstores and modern distribution." />
        <p className="sk-p">Bookstore presence can be valuable. It is also not the only way books reach readers. Today they arrive through online retail, ebooks, print-on-demand, libraries, wholesale availability, direct-to-reader sales and authors&rsquo; own audiences.</p>
        <p className="sk-p">Many trade channels also allow unsold books to be returned, which creates inventory and return risk for a publisher. Our approach is available to bookstores, not dependent on bookstores: we keep books orderable through wholesale channels while relying on print-on-demand and direct sales to avoid speculative inventory.</p>
      </Section>

      <Cta
        title="Ready to send us your manuscript?"
        body={`It takes about fifteen minutes, costs nothing, and needs no payment details. We aim to respond within ${FACTS.responseDays} calendar days.`}
        secondary={{ href: "/royalties", label: "Rights and Royalties" }}
      />
    </div>
  )
}
