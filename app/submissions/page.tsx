import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { FACTS, WE_PUBLISH, WE_DECLINE } from "../../lib/content"
import SubmitForm from "./SubmitForm"

export const metadata: Metadata = {
  title: "Submit Your Manuscript",
  description: `Submitting to Sankofa Publishers is free. We aim to respond within ${FACTS.responseDays} calendar days. Accepted books are published with no publishing fee.`,
  alternates: { canonical: "/submissions" },
}

export default function Submissions() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Submissions"
        title="Submit your manuscript."
        lead={`Submission and assessment are free. We aim to respond within ${FACTS.responseDays} calendar days. Accepted books are published with no publishing fee.`}
      />

      <Section narrow>
        <Heading kicker="Before you submit" title="What we look for." />
        <List items={WE_PUBLISH} />
        <h3 className="sk-h3" style={{ marginTop: 28 }}>What we do not publish</h3>
        <List items={WE_DECLINE} no />
        <p className="sk-note">We do not guarantee acceptance, sales, reviews or placement. Buying an optional service never influences our decision.</p>
      </Section>

      <Section tone="paper" narrow id="form">
        <Heading kicker="The form" title="Tell us about your book." />
        <SubmitForm />
      </Section>

      <Cta
        title="Want to see the whole path first?"
        body="Read how a manuscript moves from submission to publication."
        primary={{ href: "/how-it-works", label: "How It Works" }}
        secondary={{ href: "/faq", label: "Read the FAQ" }}
      />
    </div>
  )
}
