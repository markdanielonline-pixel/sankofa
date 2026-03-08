import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import AuthorMinisite from "./AuthorMinisite"

/* ── Server-side Supabase client (public data, no auth required) ── */
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AuthorData {
  id:           string
  slug:         string
  name:         string
  bio:          string | null
  tagline:      string | null
  photo_url:    string | null
  social_links: Record<string, string>
}

export interface BookData {
  id:           string
  title:        string
  description:  string | null
  cover_url:    string | null
  genre:        string | null
  buy_link:     string | null
  published_at: string | null
}

async function getAuthor(slug: string): Promise<AuthorData | null> {
  const { data } = await db
    .from("authors")
    .select("id, slug, name, bio, tagline, photo_url, social_links")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()
  return data as AuthorData | null
}

async function getBooks(authorId: string): Promise<BookData[]> {
  const { data } = await db
    .from("books")
    .select("id, title, description, cover_url, genre, buy_link, published_at")
    .eq("author_id", authorId)
    .order("published_at", { ascending: false })
  return (data ?? []) as BookData[]
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const author   = await getAuthor(slug)

  if (!author) return { title: "Not Found — Sankofa Publishers" }

  const desc =
    author.tagline ??
    (author.bio ? author.bio.slice(0, 160) : null) ??
    `${author.name} is published with Sankofa Publishers.`

  return {
    title:       `${author.name} — Sankofa Publishers`,
    description: desc,
    openGraph: {
      title:       `${author.name} — Sankofa Publishers`,
      description: desc,
      images:      author.photo_url ? [{ url: author.photo_url }] : [],
      type:        "profile",
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${author.name} — Sankofa Publishers`,
      description: desc,
      images:      author.photo_url ? [author.photo_url] : [],
    },
  }
}

export default async function AuthorPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const author   = await getAuthor(slug)

  if (!author) notFound()

  const books = await getBooks(author.id)
  return <AuthorMinisite author={author} books={books} />
}
