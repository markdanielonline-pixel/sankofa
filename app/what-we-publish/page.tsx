import type { Metadata } from "next"
import { Hero, Section, Heading, List, Cta } from "../components/site/Ui"
import { WE_PUBLISH, WE_DECLINE } from "../../lib/content"

export const metadata: Metadata = {
  title: "What We Publish | Sankofa Publishers",
  description: "Sankofa publishes books centered on Africa, the Caribbean and the global African diaspora across fiction and nonfiction. See what fits our list and what does not.",
  alternates: { canonical: "/what-we-publish" },
}

export default function WhatWePublish() {
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="Our list"
        title="What we publish."
        lead="Sankofa is a selective independent publishing house centered on Africa, the Caribbean and the global African diaspora. We publish books that meaningfully engage their histories, cultures, experiences, ideas or audiences."
      />

      <Section narrow>
        <p className="sk-p">A book does not need to be about Africa to belong on our list. If it speaks to these communities, or from them, we want to read it.</p>
        <Heading kicker="We welcome" title="Fiction and nonfiction." />
        <List items={WE_PUBLISH} />
      </Section>

      <Section tone="paper" narrow>
        <Heading kicker="Where we draw the line" title="What we do not publish." />
        <List no items={WE_DECLINE} />
        <p className="sk-p">Works that engage religion through history, culture, scholarship or critical thought can fit our list. Purely doctrinal instruction or proselytizing does not.</p>
      </Section>

      <Section narrow>
        <Heading kicker="Artificial intelligence" title="AI-assisted work." />
        <p className="sk-p">Work that involves AI is not automatically excluded. If AI played a material role in your book, you tell us when you submit. You remain responsible for originality, accuracy, copyright, permissions, factual claims, creative decisions and legal compliance.</p>
      </Section>

      <Cta
        title="Does your book belong here?"
        body="Tell us about it. Submission is free, and you will receive a written response."
        secondary={{ href: "/how-it-works", label: "How Publishing Works" }}
      />
    </div>
  )
}
