import type { Metadata } from "next"
import { Hero, Section, Heading, Cta } from "../components/site/Ui"
import BookShelf, { getShelfBooks } from "../components/site/BookShelf"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Our Books | Sankofa Publishers",
  description: "Books published by Sankofa Publishers, an independent publishing house for African, Caribbean and diaspora voices. Our first title is out now, with more on the way.",
  alternates: { canonical: "/books" },
}

export default async function BooksPage() {
  const books = await getShelfBooks()
  return (
    <div className="sk-body">
      <Hero
        compact
        kicker="The Sankofa list"
        title="Our books."
        lead="Every title on this shelf was chosen, not bought. Our first book is out now, and the shelf is filling."
      />

      <Section tone="paper">
        <Heading kicker="Now on the shelf" title="Published by Sankofa." />
        <BookShelf books={books} slots={4} />
      </Section>

      <Cta
        title="The next book on this shelf could be yours."
        body="Submission is free and needs no payment details. If we accept your book, you pay nothing to publish it."
        secondary={{ href: "/what-we-publish", label: "What We Publish" }}
      />
    </div>
  )
}
