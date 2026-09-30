import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { FACTS } from "../../lib/content"

export const metadata: Metadata = {
  title: "Publishing Options Compared: Traditional, Hybrid, Self and Sankofa",
  description:
    "An honest comparison of traditional, hybrid, self-publishing and vanity presses, and where Sankofa's no-fee model fits. Know what you are agreeing to before you sign anything.",
  alternates: { canonical: "/compare" },
}

const ROWS: [string, string, string, string, string][] = [
  ["Cost to the author", "None", "Typically thousands of dollars", "You pay for every service", "Often $1,000s, sometimes sold as a package"],
  ["Who chooses the books", "The publisher, selectively", "Often anyone who can pay", "You", "Often anyone who can pay"],
  ["Royalty on sales", "Commonly a small share of list price", "Varies widely, often higher than traditional", "You keep most of each sale", "Varies, often with add-on charges"],
  ["Copyright", "Usually stays with you, but a long license is granted", "Varies by contract", "Yours", "Varies, read carefully"],
  ["Time to publication", "Often 12 to 24 months", "Often a few months", "As fast as you work", "Often a few months"],
  ["Agent required", "Usually yes", "No", "No", "No"],
]

const HEADS = ["", "Sankofa", "Traditional", "Self-publishing", "Hybrid or vanity press"]

export default function Compare() {
  const rows: string[][] = [
    ["Cost to the author", "None for accepted books", ROWS[0][2], ROWS[0][3], ROWS[0][4]],
    ["Who chooses the books", "We do, selectively", ROWS[1][2], ROWS[1][3], ROWS[1][4]],
    ["Royalty", `${FACTS.royaltyPct}% of defined net receipts`, ROWS[2][2], ROWS[2][3], ROWS[2][4]],
    ["Copyright", "Yours. We license, we do not own", ROWS[3][2], ROWS[3][3], ROWS[3][4]],
    ["Time to publication", `About ${FACTS.productionWeeks} weeks for a standard text`, ROWS[4][2], ROWS[4][3], ROWS[4][4]],
    ["Agent required", "No. Submit directly", ROWS[5][2], ROWS[5][3], ROWS[5][4]],
  ]
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Know before you sign"
        title="Every way to publish, compared honestly."
        lead="Most authors are never told how the publishing business really works until after they sign. Here is what to look for, whoever you publish with."
      />

      <Section>
        <Heading kicker="Side by side" title="The five paths at a glance." />
        <div style={{ overflowX: "auto" }}>
          <table className="sk-example" style={{ minWidth: 760, width: "100%" }}>
            <thead>
              <tr>{HEADS.map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} style={{ textAlign: "left", padding: "10px 12px", verticalAlign: "top", fontWeight: i === 0 || i === 1 ? 600 : 400 }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sk-note" style={{ marginTop: 18 }}>Descriptions of other models are general industry patterns, not statements about any particular company. Terms differ from contract to contract, so always read yours in full and consider independent advice.</p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="What many authors are never told" title="The quiet realities of traditional publishing." />
        <p className="sk-p">Traditional publishing has produced great books and we respect it. But many authors only discover these points after signing:</p>
        <List items={[
          "Royalties are commonly a small percentage of list price, and an advance must usually be earned back before royalties are paid.",
          "Most books get little marketing. Publicity budgets tend to go to a few lead titles, and the rest are expected to find readers largely on their own.",
          "Rights can be tied up for very long periods, and getting them back can be slow, especially when a book is still technically in print.",
          "Sales are reported only once or twice a year, and royalties can be held back against expected returns from bookstores.",
          "Getting in at all usually requires a literary agent, and many strong manuscripts are declined without feedback.",
          "Publication can take a year or two after acceptance, and cover, title and even edits may be decided without you.",
        ]} />
      </Section>

      <Section narrow>
        <Heading kicker="Hybrid, vanity and pay-to-publish" title="When the author is the customer." />
        <p className="sk-p">Some companies present themselves as publishers but earn most of their income from author fees rather than book sales. When the fee is paid up front, the company gets paid whether or not the book finds readers, and the incentive to choose carefully or to sell the book disappears.</p>
        <p className="sk-p">Not every hybrid press is dishonest, and some are transparent and good at what they do. Ask any of them: what is the total cost, what exactly do I receive, who holds my rights, who pays for printing, and what do I earn per copy?</p>
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Self-publishing" title="Total control, total responsibility." />
        <p className="sk-p">Self-publishing lets you keep most of each sale and decide everything. It also means you commission and pay for editing, design, formatting, ISBNs, distribution and marketing yourself, and coordinate all of it. It suits authors with time, budget and appetite for the business side.</p>
      </Section>

      <Section narrow>
        <Heading kicker="Where Sankofa sits" title="Independent, selective, and on your side of the table." />
        <List items={[
          "No publishing fee for accepted books. We invest in the books we choose, so we choose with care.",
          `You keep your copyright. We hold an exclusive license for an initial ${FACTS.termYears}-year term, and rights we are not using stay with you.`,
          `You earn ${FACTS.royaltyPct}% of defined net receipts, with a statement every quarter and no advance to earn back.`,
          "A human response within 7 calendar days as our target, and no agent needed.",
          "Available to bookstores, not dependent on bookstores. Print-on-demand and direct sales keep waste and risk low.",
        ]} />
        <p className="sk-note">We do not promise sales, reviews or bookstore placement. Nobody honest can.</p>
      </Section>

      <Cta
        title="If your book can make a difference, we want to read it."
        body="Submitting is free and takes about ten minutes."
        secondary={{ href: "/royalties", label: "Rights and royalties" }}
      />
    </div>
  )
}
