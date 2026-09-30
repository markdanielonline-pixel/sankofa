import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { FACTS } from "../../lib/content"

export const metadata: Metadata = {
  title: "Rights & Royalties | Sankofa Publishers",
  description: `You keep your copyright and earn ${FACTS.royaltyPct}% of net receipts, with quarterly statements and a US$${FACTS.minPayoutUsd} payout threshold. Here is exactly how it works.`,
  alternates: { canonical: "/royalties" },
}

export default function Royalties() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Rights and royalties"
        title="Your copyright remains yours."
        lead={`You keep your copyright and earn ${FACTS.royaltyPct}% of net receipts, reported every quarter.`}
      />

      <Section narrow>
        <Heading kicker="Rights" title="What you grant, and what you keep." />
        <p className="sk-p">Under our publishing agreement, Sankofa receives an exclusive worldwide license to publish your book in print, ebook and audiobook for an initial {FACTS.termYears}-year term. Renewal happens only by mutual agreement.</p>
        <p className="sk-p">Rights not expressly granted in the agreement, including film, television, translation, merchandising and other adaptations, remain with you unless we separately negotiate them.</p>
        <p className="sk-p">You are consulted on your cover and interior, with {FACTS.revisionRounds} rounds of feedback on each. Sankofa keeps final authority over the edition&rsquo;s cover, typography, interior, metadata, pricing and formats. That protects professional standards and market consistency for your book. It is not about taking your voice away.</p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Royalties" title={`${FACTS.royaltyPct}% of net receipts, from the first sale.`} />
        <p className="sk-p"><strong>Net receipts</strong> means the money Sankofa actually receives after direct costs of that specific sale, such as printing, the retailer or distributor&rsquo;s share, payment processing, returns, refunds and applicable transaction taxes.</p>
        <p className="sk-p">General overhead is never deducted: no salaries, ordinary software, office costs or general marketing expenses. There is no advance, so there is nothing to earn out.</p>
        <div className="sk-example" role="group" aria-label="Illustrative example">
          <span className="sk-kicker">Illustrative example only</span>
          <table>
            <tbody>
              <tr><td>Copy sold direct at</td><td>$20.00</td></tr>
              <tr><td>Printing and fulfilment cost</td><td>&minus;$4.50</td></tr>
              <tr><td>Payment processing</td><td>&minus;$0.90</td></tr>
              <tr><td>Net receipts</td><td>$14.60</td></tr>
              <tr className="total"><td>Author share ({FACTS.royaltyPct}%)</td><td>$8.76</td></tr>
            </tbody>
          </table>
          <p className="sk-note" style={{ marginTop: 10 }}>Figures are invented for illustration. Actual costs depend on the book and the sales channel.</p>
        </div>
      </Section>

      <Section narrow>
        <Heading kicker="Transparency" title="Statements, payments and your portal." />
        <List items={[
          "A statement every quarter, even when there were no sales.",
          `Balances of US$${FACTS.minPayoutUsd} or more are paid electronically, no later than ${FACTS.payoutDays} days after quarter end, subject to cleared receipts and your agreement.`,
          "Smaller balances roll forward to the next quarter.",
          "Sales figures in your portal between statements are estimates, and may change with reporting delays, returns, refunds and currency conversion. The quarterly statement is the official record.",
          "For some sales channels that allow returns, a portion of earnings is held in reserve for a period and then released.",
          "You may be asked for tax information before payment.",
        ]} />
        <p className="sk-note">The publishing agreement is the governing document. Details here summarize its intent in plain language.</p>
      </Section>

      <Cta
        title="Terms you can read in a few minutes."
        body="Then decide whether we are the right home for your book."
        secondary={{ href: "/faq", label: "Read the FAQ" }}
      />
    </div>
  )
}
