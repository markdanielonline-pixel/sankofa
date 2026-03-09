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
  id:                  string
  slug:                string
  name:                string
  bio:                 string | null
  tagline:             string | null
  photo_url:           string | null
  social_links:        Record<string, string>
  template:            "classic" | "bold" | "minimal"
  template_chosen_at:  string | null
  featured_book_id:    string | null
  press_kit_url:       string | null
  user_id:             string | null
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

export interface EventData {
  id:          string
  title:       string
  description: string | null
  location:    string | null
  event_date:  string
  event_time:  string | null
  ticket_url:  string | null
  is_virtual:  boolean
}

export interface GalleryData {
  id:         string
  image_url:  string
  caption:    string | null
  sort_order: number
}

export interface PressData {
  id:           string
  outlet:       string
  headline:     string
  url:          string | null
  published_at: string | null
  excerpt:      string | null
}

async function getAuthor(slug: string): Promise<AuthorData | null> {
  const { data, error } = await db
    .from("authors")
    .select("id, slug, name, bio, tagline, photo_url, social_links, template, template_chosen_at, featured_book_id, press_kit_url, user_id")
    .eq("slug", slug)
    .maybeSingle()
  if (error) {
    console.error("[getAuthor] Supabase error:", error.message)
    return null
  }
  return data as AuthorData | null
}

async function getBooks(authorId: string): Promise<BookData[]> {
  const { data, error } = await db
    .from("books")
    .select("id, title, description, cover_url, genre, buy_link, published_at")
    .eq("author_id", authorId)
    .order("published_at", { ascending: false })
  if (error) console.error("[getBooks]", error.message)
  return (data ?? []) as BookData[]
}

async function getEvents(authorId: string): Promise<EventData[]> {
  const { data, error } = await db
    .from("author_events")
    .select("id, title, description, location, event_date, event_time, ticket_url, is_virtual")
    .eq("author_id", authorId)
    .order("event_date", { ascending: true })
  if (error) console.error("[getEvents]", error.message)
  return (data ?? []) as EventData[]
}

async function getGallery(authorId: string): Promise<GalleryData[]> {
  const { data, error } = await db
    .from("author_gallery")
    .select("id, image_url, caption, sort_order")
    .eq("author_id", authorId)
    .order("sort_order", { ascending: true })
  if (error) console.error("[getGallery]", error.message)
  return (data ?? []) as GalleryData[]
}

async function getPress(authorId: string): Promise<PressData[]> {
  const { data, error } = await db
    .from("author_press")
    .select("id, outlet, headline, url, published_at, excerpt")
    .eq("author_id", authorId)
    .order("published_at", { ascending: false })
  if (error) console.error("[getPress]", error.message)
  return (data ?? []) as PressData[]
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

  const [books, events, gallery, press] = await Promise.all([
    getBooks(author.id),
    getEvents(author.id),
    getGallery(author.id),
    getPress(author.id),
  ])

  return (
    <AuthorMinisite
      author={author}
      books={books}
      events={events}
      gallery={gallery}
      press={press}
    />
  )
}
