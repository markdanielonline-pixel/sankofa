import type { Metadata } from "next"
import { Hero, Section, FaqList, Cta, JsonLd, faqJsonLd } from "../components/site/Ui"
import { FAQS } from "../../lib/content"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Sankofa Publishers",
  description: "Answers about cost, copyright, royalties, editing, covers, distribution, launch dates, AI, audiobooks and resubmission.",
  alternates: { canonical: "/faq" },
}

export default function Faq() {
  return (
    <div className="sk-body">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero compact kicker="FAQ" title="Questions authors ask us." lead="Short, honest answers. For the full terms, the publishing agreement governs." />
      <Section narrow>
        <FaqList />
      </Section>
      <Cta title="Still have a question?" body="Write to us and we will answer." primary={{ href: "/contact", label: "Contact Us" }} secondary={{ href: "/submissions", label: "Submit Your Manuscript" }} />
    </div>
  )
}
