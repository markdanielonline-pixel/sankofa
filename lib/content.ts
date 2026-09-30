// Single source of truth for public-site facts.
// Every page, FAQ answer and structured-data block reads from here so the
// numbers (60%, 7 days, $50, 5 years...) can never drift between pages.

export const FACTS = {
  royaltyPct: 60,
  responseDays: 7,
  termYears: 5,
  minPayoutUsd: 50,
  payoutDays: 45,
  productionWeeks: "8 to 10",
  proofDays: 7,
  revisionRounds: 2,
  email: {
    general: "contact@sankofapublishers.com",
    submissions: "submissions@sankofapublishers.com",
    press: "press@sankofapublishers.com",
  },
} as const

export const OFFER_POINTS = [
  { title: "No publishing fee", body: "If we accept your manuscript, publication carries no publishing fee. Submission and assessment are free too." },
  { title: "You keep your copyright", body: "Copyright stays with you. Rights not expressly granted in the agreement remain yours." },
  { title: `${FACTS.royaltyPct}% of net receipts`, body: "Your royalty share is calculated on the money Sankofa actually receives after direct, sale-specific costs. No advance to earn out." },
  { title: "Professional production", body: "Editorial guidance, cover and interior design, ISBN and metadata management, all handled by Sankofa." },
  { title: "Worldwide availability", body: "Distribution through a global wholesale and retail network, plus direct sales through your own book website." },
  { title: "Transparent reporting", body: "An author portal with sales estimates, quarterly royalty statements and a full payout history." },
]

export const PROCESS_STEPS = [
  { n: 1, title: "Submit your manuscript", body: "Send your manuscript and details through our free submission form. No payment information is ever requested." },
  { n: 2, title: "Editorial review", body: `Every submission is assessed for quality, audience, list fit and production needs. You should hear back within ${FACTS.responseDays} calendar days.` },
  { n: 3, title: "Decision or conditional acceptance", body: "You receive a clear decision. If a manuscript needs substantial editing, we may offer conditional acceptance with a written report explaining why." },
  { n: 4, title: "Agreement and onboarding", body: "Accepted authors receive our publishing agreement and complete a short onboarding so we have everything needed for production." },
  { n: 5, title: "Editorial preparation", body: "Where needed, the manuscript is prepared for production. You may use any qualified editor, or Sankofa's optional editorial service." },
  { n: 6, title: "Cover and interior production", body: `Professional design of your cover and interior, with ${FACTS.revisionRounds} rounds of author consultation on each.` },
  { n: 7, title: "Proof and approval", body: `You review the proof and confirm. Routine approvals have a ${FACTS.proofDays}-day window, with friendly reminders along the way.` },
  { n: 8, title: "Distribution and launch preparation", body: "ISBN, metadata, retailer copy, your author website and launch communications are prepared." },
  { n: 9, title: "Publication", body: "Your book goes live on the scheduled date, which Sankofa confirms with you." },
  { n: 10, title: "Sales, statements and royalties", body: "Follow sales estimates in your portal, receive quarterly statements, and get paid as your balance passes the payout threshold." },
]

export const WE_PUBLISH = [
  "Literary and commercial fiction", "Mystery and thriller", "Supernatural and speculative fiction", "Fantasy and science fiction",
  "Historical fiction", "Romance and young adult", "Memoir and biography", "History and culture",
  "Social commentary and critical thought", "Business, leadership and personal development", "Narrative nonfiction",
  "Scholarship, African, Caribbean and diaspora studies", "Social sciences",
]

export const WE_DECLINE = [
  "Purely doctrinal religious instruction or proselytizing",
  "Hate speech or dehumanizing content, or works principally attacking protected groups",
  "Defamatory material without support",
  "Plagiarized or unlawfully reproduced work",
  "Exploitative material involving minors, or other unlawful content",
  "Rights problems Sankofa cannot reasonably resolve",
]

export const SERVICES = [
  { name: "Developmental, line and copy editing", body: "Deeper editorial work if you want it. You may equally hire any qualified editor of your choice." },
  { name: "Proofreading", body: "A final careful read before your book goes to print." },
  { name: "Manuscript assessment", body: "A detailed professional report on your manuscript, for authors who want feedback before or after submitting." },
  { name: "Ghostwriting", body: "Professional writers to help you shape and write your book." },
  { name: "Enhanced design", body: "Additional design work beyond the included cover and interior, such as illustrated editions or extra assets." },
  { name: "Premium marketing and paid advertising", body: "Campaign work that goes beyond the baseline launch, including managed paid advertising." },
  { name: "Audiobook production", body: "AI narration where suitable, or premium human narration. Or supply your own files that meet our quality requirements." },
  { name: "Premium author web work", body: "A more customized author website and additional campaign pages." },
]

export const BASELINE_MARKETING = [
  "Positioning and metadata optimization", "Retailer descriptions and copy", "Launch graphics and social assets",
  "Author and book website with direct-sales set-up", "Email launch support", "ARC and reviewer workflow",
  "Catalog presence", "Scheduled launch communications",
]

export type Faq = { q: string; a: string }
export const FAQS: Faq[] = [
  { q: "Does it cost to publish with Sankofa?", a: "No. Submission and assessment are free, and accepted manuscripts are published without a publishing fee. Optional paid services exist, but they are never required for acceptance or publication." },
  { q: "Do I keep my copyright?", a: `Yes. You retain your copyright. Sankofa receives an exclusive worldwide publishing license for print, ebook and audiobook for an initial ${FACTS.termYears}-year term. Renewal requires mutual agreement, and any rights not expressly granted in the agreement stay with you.` },
  { q: "What royalty do I receive?", a: `You receive ${FACTS.royaltyPct}% of net receipts. Net receipts are the money Sankofa actually receives after direct, sale-specific costs such as printing, retailer or distributor share, payment processing, returns, refunds and applicable transaction taxes. General company overhead is never deducted.` },
  { q: "Do you pay advances?", a: "No. Sankofa does not pay an advance, which also means there is nothing to earn out. You participate in qualifying earnings from the first sale." },
  { q: "Do I need an agent?", a: "No. You can submit directly." },
  { q: "Can I use my own editor?", a: "Yes. You may hire any qualified editor. Sankofa's editorial service is optional and never required for acceptance." },
  { q: "What if my manuscript needs editing?", a: "If we want a manuscript that needs substantial editing, we offer conditional acceptance with a written report. You can revise it yourself, hire an editor of your choice, or use our optional service. We reassess the revised manuscript the same way whoever edited it." },
  { q: "Who chooses the cover?", a: `You are consulted, with ${FACTS.revisionRounds} rounds of feedback on both cover and interior. Sankofa keeps final authority over cover, typography, interior, metadata, pricing and formats so every book meets professional standards and reads consistently in the market.` },
  { q: "Can bookstores order my book?", a: "Yes. Our approach is available to bookstores, not dependent on bookstores. Books are made available through wholesale channels so stores can order them, while print-on-demand and direct sales reduce speculative inventory. We cannot promise shelf placement." },
  { q: "Do I get an author website?", a: "Yes. Every accepted title receives either a Sankofa-built author or book website or a direct-sales connection to your existing website where that suits. Exact features can vary by book." },
  { q: "How long does publication take?", a: `For a standard text-based book, roughly ${FACTS.productionWeeks} weeks from a production-ready manuscript. That is an estimate, not a guarantee, and complex books take longer. We aim to respond to submissions within ${FACTS.responseDays} calendar days.` },
  { q: "Can I choose a launch date?", a: "You can propose one. Sankofa sets the final date so there is enough runway to do the launch properly, and if a date is too early we explain why and offer the earliest safe date. Please don't book venues or announce a date until we confirm it." },
  { q: "How are royalties paid?", a: `Statements are issued every quarter, even when there are no sales. Once your balance reaches US$${FACTS.minPayoutUsd} it is paid electronically, no later than ${FACTS.payoutDays} days after quarter end, subject to cleared receipts and your agreement. Smaller balances roll forward. Tax information may be required.` },
  { q: "What if I used AI in my book?", a: "AI-assisted work is not automatically excluded. Any material use of AI must be disclosed when you submit, and you remain responsible for originality, accuracy, permissions and legal compliance." },
  { q: "Do you publish religious books?", a: "We do not publish purely doctrinal religious instruction or proselytizing. Works that engage religion through history, culture, scholarship or critical thought may fit our list." },
  { q: "Can I submit again after a decline?", a: "If we decline a manuscript as revisable, you are welcome to resubmit after addressing the issues in your report, and you never need to buy a Sankofa service to do so. A decline for a work outside our program is final." },
  { q: "Do you publish audiobooks?", a: "Yes, as an option. You can supply files that meet our quality requirements or purchase production from us. Audiobook sales flow into the same royalty statements as your other formats." },
  { q: "Are optional services required?", a: "Never. Optional services are never required for acceptance or publication, and buying them does not influence our decision." },
]

export const SITE = {
  name: "Sankofa Publishers",
  url: "https://sankofapublishers.com",
  tagline: "A selective independent publishing house for Africa, the Caribbean and the global African diaspora.",
}
