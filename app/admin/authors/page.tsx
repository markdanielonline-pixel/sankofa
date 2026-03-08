"use client"

import React, { useEffect, useState, useMemo } from "react"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"
import { useAdmin } from "../_context"
import { adminCss } from "../_styles"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ─────────────────────────── Types ─────────────────────────── */

interface UserProfile {
  id:          string
  full_name:   string | null
  email:       string | null
  role:        string
  created_at:  string
  updated_at:  string
  submissions: { status: string; path: string }[]
}

interface BookRecord {
  id:           string
  title:        string
  description:  string | null
  cover_url:    string | null
  genre:        string | null
  buy_link:     string | null
  published_at: string | null
}

interface MiniSite {
  id:           string
  user_id:      string | null
  slug:         string | null
  name:         string
  bio:          string | null
  tagline:      string | null
  photo_url:    string | null
  is_published: boolean
  created_at:   string
  books:        BookRecord[]
}

const EMPTY_BOOK = { title: "", description: "", cover_url: "", genre: "", buy_link: "", published_at: "" }

/* ─────────────────────────── Component ─────────────────────────── */

export default function AuthorsPage() {
  const admin = useAdmin()
  const canEdit = admin.role === "super_admin" || admin.role === "editor"

  const [tab, setTab] = useState<"users" | "minisites">("users")
  const [toast, setToast] = useState<string | null>(null)

  /* ── Users tab state ── */
  const [users,        setUsers]        = useState<UserProfile[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [userSearch,   setUserSearch]   = useState("")
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  /* ── Minisites tab state ── */
  const [minisites,   setMinisites]   = useState<MiniSite[]>([])
  const [msLoading,   setMsLoading]   = useState(true)
  const [expandedMs,  setExpandedMs]  = useState<string | null>(null)

  /* new minisite form */
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName,     setNewName]     = useState("")
  const [newSlug,     setNewSlug]     = useState("")
  const [creating,    setCreating]    = useState(false)

  /* slug edit per row */
  const [slugDraft, setSlugDraft] = useState<Record<string, string>>({})
  const [savingSlug, setSavingSlug] = useState<string | null>(null)

  /* buy-link edit per book */
  const [buyDraft,    setBuyDraft]    = useState<Record<string, string>>({})
  const [savingBuy,   setSavingBuy]   = useState<string | null>(null)

  /* add-book form per minisite */
  const [bookFormMs, setBookFormMs] = useState<string | null>(null)
  const [bookDraft,  setBookDraft]  = useState(EMPTY_BOOK)
  const [addingBook, setAddingBook] = useState(false)

  /* link user per minisite */
  const [linkDraft,   setLinkDraft]  = useState<Record<string, string>>({})
  const [savingLink,  setSavingLink] = useState<string | null>(null)

  /* ── Helpers ── */
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  /* ── Load ── */
  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at, updated_at, submissions:submissions(status, path)")
        .eq("role", "author")
        .order("created_at", { ascending: false })
      setUsers((data ?? []) as UserProfile[])
      setUsersLoading(false)
    }

    async function loadMinisites() {
      const { data } = await supabase
        .from("authors")
        .select("id, user_id, slug, name, bio, tagline, photo_url, is_published, created_at, books:books(id, title, description, cover_url, genre, buy_link, published_at)")
        .order("created_at", { ascending: false })
      setMinisites((data ?? []) as MiniSite[])
      setMsLoading(false)
    }

    loadUsers()
    loadMinisites()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.full_name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
    )
  }, [users, userSearch])

  /* ── Minisite handlers ── */

  async function createMinisite() {
    if (!newName.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from("authors")
      .insert({ name: newName.trim(), slug: newSlug.trim() || null, is_published: false })
      .select("id, user_id, slug, name, bio, tagline, photo_url, is_published, created_at, books:books(id, title, description, cover_url, genre, buy_link, published_at)")
      .single()
    if (!error && data) {
      setMinisites(p => [data as MiniSite, ...p])
      showToast(`Minisite "${newName}" created`)
    } else {
      showToast(error?.message ?? "Error creating minisite")
    }
    setNewName(""); setNewSlug(""); setShowNewForm(false); setCreating(false)
  }

  async function togglePublish(ms: MiniSite) {
    if (!ms.slug && !ms.is_published) {
      showToast("Set a slug before publishing."); return
    }
    const { error } = await supabase
      .from("authors")
      .update({ is_published: !ms.is_published, updated_at: new Date().toISOString() })
      .eq("id", ms.id)
    if (!error) {
      setMinisites(p => p.map(m => m.id === ms.id ? { ...m, is_published: !m.is_published } : m))
      showToast(!ms.is_published ? "Minisite published" : "Minisite unpublished")
    } else {
      showToast(error.message)
    }
  }

  async function saveSlug(ms: MiniSite) {
    const slug = (slugDraft[ms.id] ?? ms.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-")
    setSavingSlug(ms.id)
    const { error } = await supabase
      .from("authors")
      .update({ slug, updated_at: new Date().toISOString() })
      .eq("id", ms.id)
    if (!error) {
      setMinisites(p => p.map(m => m.id === ms.id ? { ...m, slug } : m))
      showToast("Slug saved")
    } else {
      showToast(error.message)
    }
    setSavingSlug(null)
  }

  async function saveLink(ms: MiniSite) {
    const userId = (linkDraft[ms.id] ?? "").trim() || null
    setSavingLink(ms.id)
    const { error } = await supabase
      .from("authors")
      .update({ user_id: userId, updated_at: new Date().toISOString() })
      .eq("id", ms.id)
    if (!error) {
      setMinisites(p => p.map(m => m.id === ms.id ? { ...m, user_id: userId } : m))
      showToast("User linked")
    } else {
      showToast(error.message)
    }
    setSavingLink(null)
  }

  async function addBook(authorId: string) {
    if (!bookDraft.title.trim()) return
    setAddingBook(true)
    const payload = {
      author_id:    authorId,
      title:        bookDraft.title.trim(),
      description:  bookDraft.description.trim() || null,
      cover_url:    bookDraft.cover_url.trim() || null,
      genre:        bookDraft.genre.trim() || null,
      buy_link:     bookDraft.buy_link.trim() || null,
      published_at: bookDraft.published_at || null,
    }
    const { data, error } = await supabase.from("books").insert(payload).select("*").single()
    if (!error && data) {
      setMinisites(p => p.map(m =>
        m.id === authorId ? { ...m, books: [...m.books, data as BookRecord] } : m
      ))
      showToast(`Book "${bookDraft.title}" added`)
      setBookDraft(EMPTY_BOOK); setBookFormMs(null)
    } else {
      showToast(error?.message ?? "Error adding book")
    }
    setAddingBook(false)
  }

  async function removeBook(authorId: string, bookId: string, title: string) {
    if (!confirm(`Remove "${title}"?`)) return
    const { error } = await supabase.from("books").delete().eq("id", bookId)
    if (!error) {
      setMinisites(p => p.map(m =>
        m.id === authorId ? { ...m, books: m.books.filter(b => b.id !== bookId) } : m
      ))
      showToast("Book removed")
    } else {
      showToast(error.message)
    }
  }

  async function saveBuyLink(authorId: string, bookId: string) {
    const buyLink = (buyDraft[bookId] ?? "").trim() || null
    setSavingBuy(bookId)
    const { error } = await supabase.from("books").update({ buy_link: buyLink }).eq("id", bookId)
    if (!error) {
      setMinisites(p => p.map(m =>
        m.id === authorId
          ? { ...m, books: m.books.map(b => b.id === bookId ? { ...b, buy_link: buyLink } : b) }
          : m
      ))
      showToast("Buy link saved")
    } else {
      showToast(error.message)
    }
    setSavingBuy(null)
  }

  const manuscriptStatus = (u: UserProfile) => u.submissions?.[0]?.status ?? null
  const statusClass      = (s: string | null) => s ? `a-badge a-badge-${s}` : "a-badge a-badge-author"

  /* ─────────────────────────── Render ─────────────────────────── */

  return (
    <div className={`a-page ${body.className}`}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      <div className="a-grain" aria-hidden />

      {toast && (
        <div className="a-toast">
          <span className="a-toast-dot" />
          {toast}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <span className="ak">Admin Console · Authors</span>
        <h1 className={`a-title ${display.className}`}>Authors</h1>
        <p className="a-subtitle">
          Manage registered authors and their public minisites.
        </p>
      </div>

      {/* Tabs */}
      <div className="a-tabs" style={{ marginBottom: 24 }}>
        <button className={`a-tab ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}>
          Registered Users{!usersLoading && ` (${users.length})`}
        </button>
        <button className={`a-tab ${tab === "minisites" ? "active" : ""}`}
          onClick={() => setTab("minisites")}>
          Author Minisites{!msLoading && ` (${minisites.length})`}
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1: REGISTERED USERS
      ══════════════════════════════════════════ */}
      {tab === "users" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <input
              className="a-search"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
            />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.28)", margin: 0 }}>
              {admin.role === "support" ? "View only" : ""}
            </p>
          </div>

          <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
            {usersLoading ? (
              <div className="a-empty">Loading authors…</div>
            ) : filteredUsers.length === 0 ? (
              <div className="a-empty">
                {userSearch ? "No authors match your search." : "No authors yet."}
              </div>
            ) : (
              <div className="a-table-wrap">
                <table className="a-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Submissions</th>
                      <th>Manuscript Status</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => {
                      const ms    = manuscriptStatus(user)
                      const isExp = expandedUser === user.id
                      return (
                        <React.Fragment key={user.id}>
                          <tr
                            onClick={() => setExpandedUser(isExp ? null : user.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                  width: 28, height: 28, borderRadius: "50%",
                                  background: "rgba(201,162,39,.12)",
                                  border: "1px solid rgba(201,162,39,.22)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 11, fontWeight: 700, color: "#C9A227", flexShrink: 0,
                                }}>
                                  {(user.full_name ?? user.email ?? "?").slice(0, 2).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 500 }}>{user.full_name ?? "—"}</span>
                              </div>
                            </td>
                            <td style={{ color: "rgba(255,255,255,.45)", fontSize: 12 }}>{user.email ?? "—"}</td>
                            <td style={{ color: "rgba(255,255,255,.38)", fontSize: 12, whiteSpace: "nowrap" }}>{fmtDate(user.created_at)}</td>
                            <td>
                              <span style={{ fontSize: 13, color: user.submissions?.length ? "#C9A227" : "rgba(255,255,255,.28)", fontWeight: 600 }}>
                                {user.submissions?.length ?? 0}
                              </span>
                            </td>
                            <td>
                              <span className={statusClass(ms)}>
                                {ms ? <><span className="a-badge-dot" />{ms}</> : "None"}
                              </span>
                            </td>
                            <td style={{ color: "rgba(255,255,255,.30)", fontSize: 12, whiteSpace: "nowrap" }}>
                              {fmtDate(user.updated_at)}
                            </td>
                          </tr>
                          {isExp && (
                            <tr>
                              <td colSpan={6} style={{ background: "rgba(201,162,39,.04)", padding: "16px 20px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>User ID</p>
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.42)", margin: 0, wordBreak: "break-all" }}>{user.id}</p>
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Submission History</p>
                                    {user.submissions?.length ? user.submissions.map((s, i) => (
                                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>Path {s.path}</span>
                                        <span className={`a-badge a-badge-${s.status}`} style={{ fontSize: 10, padding: "1px 7px" }}>{s.status}</span>
                                      </div>
                                    )) : (
                                      <p style={{ fontSize: 11, color: "rgba(255,255,255,.25)", margin: 0 }}>No submissions</p>
                                    )}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Portal Activity</p>
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.42)", margin: 0 }}>Last seen {fmtDate(user.updated_at)}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.18)", marginTop: 14, letterSpacing: ".04em" }}>
            Click any row to expand author details.
          </p>
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 2: AUTHOR MINISITES
      ══════════════════════════════════════════ */}
      {tab === "minisites" && (
        <>
          {/* Toolbar */}
          {canEdit && (
            <div style={{ marginBottom: 20 }}>
              {showNewForm ? (
                <div className="a-card" style={{ padding: "20px 24px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.75)", margin: "0 0 14px" }}>
                    Create New Minisite
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 10, alignItems: "flex-end" }}>
                    <div>
                      <label className="a-label">Author Name *</label>
                      <input className="a-input" placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)} />
                    </div>
                    <div>
                      <label className="a-label">Slug (optional)</label>
                      <input className="a-input" placeholder="e.g. jane-doe" value={newSlug} onChange={e => setNewSlug(e.target.value)} />
                    </div>
                    <button className="a-btn-gold" onClick={createMinisite} disabled={creating || !newName.trim()}>
                      {creating ? "Creating…" : "Create"}
                    </button>
                    <button className="a-btn-ghost" onClick={() => { setShowNewForm(false); setNewName(""); setNewSlug("") }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button className="a-btn-gold" onClick={() => setShowNewForm(true)}>
                  + New Minisite
                </button>
              )}
            </div>
          )}

          {/* Minisites table */}
          <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
            {msLoading ? (
              <div className="a-empty">Loading minisites…</div>
            ) : minisites.length === 0 ? (
              <div className="a-empty">No author minisites yet. Create one above.</div>
            ) : (
              <div className="a-table-wrap">
                <table className="a-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Books</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {minisites.map(ms => {
                      const isExp = expandedMs === ms.id
                      return (
                        <React.Fragment key={ms.id}>
                          <tr
                            onClick={() => setExpandedMs(isExp ? null : ms.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {ms.photo_url ? (
                                  <img src={ms.photo_url} alt={ms.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,162,39,.25)", flexShrink: 0 }} />
                                ) : (
                                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,162,39,.12)", border: "1px solid rgba(201,162,39,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#C9A227", flexShrink: 0 }}>
                                    {ms.name.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <span style={{ fontWeight: 500 }}>{ms.name}</span>
                              </div>
                            </td>
                            <td style={{ color: ms.slug ? "#C9A227" : "rgba(255,255,255,.25)", fontSize: 12, fontFamily: "monospace" }}>
                              {ms.slug ?? "—"}
                            </td>
                            <td onClick={e => { e.stopPropagation(); canEdit && togglePublish(ms) }}>
                              <span
                                className={`a-badge ${ms.is_published ? "a-badge-accepted" : "a-badge-pending"}`}
                                style={{ cursor: canEdit ? "pointer" : "default" }}
                                title={canEdit ? `Click to ${ms.is_published ? "unpublish" : "publish"}` : ""}
                              >
                                <span className="a-badge-dot" />
                                {ms.is_published ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 13, color: ms.books.length ? "#C9A227" : "rgba(255,255,255,.28)", fontWeight: 600 }}>
                                {ms.books.length}
                              </span>
                            </td>
                            <td style={{ color: "rgba(255,255,255,.38)", fontSize: 12, whiteSpace: "nowrap" }}>
                              {fmtDate(ms.created_at)}
                            </td>
                            <td>
                              {ms.slug && ms.is_published && (
                                <a
                                  href={`/authors/${ms.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ fontSize: 11, color: "#C9A227", textDecoration: "none", fontWeight: 600 }}
                                  onClick={e => e.stopPropagation()}
                                >
                                  View →
                                </a>
                              )}
                            </td>
                          </tr>

                          {/* ── Expanded management row ── */}
                          {isExp && (
                            <tr>
                              <td colSpan={6} style={{ background: "rgba(201,162,39,.03)", padding: "22px 24px" }}>

                                {/* ── Section 1: Slug + Publish + Link User ── */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>

                                  {/* Slug */}
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 8px" }}>
                                      Slug (URL path)
                                    </p>
                                    {canEdit ? (
                                      <div style={{ display: "flex", gap: 6 }}>
                                        <input
                                          className="a-input"
                                          style={{ fontSize: 12, padding: "7px 10px", fontFamily: "monospace" }}
                                          placeholder="author-slug"
                                          value={slugDraft[ms.id] ?? ms.slug ?? ""}
                                          onChange={e => setSlugDraft(p => ({ ...p, [ms.id]: e.target.value.toLowerCase().replace(/\s/g, "-") }))}
                                        />
                                        <button
                                          className="a-btn-gold"
                                          style={{ padding: "7px 12px", fontSize: 11, whiteSpace: "nowrap" }}
                                          disabled={savingSlug === ms.id}
                                          onClick={() => saveSlug(ms)}
                                        >
                                          {savingSlug === ms.id ? "…" : "Save"}
                                        </button>
                                      </div>
                                    ) : (
                                      <p style={{ fontSize: 12, color: "rgba(255,255,255,.42)", margin: 0, fontFamily: "monospace" }}>
                                        {ms.slug ?? "Not set"}
                                      </p>
                                    )}
                                  </div>

                                  {/* Publish toggle */}
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 8px" }}>
                                      Visibility
                                    </p>
                                    {canEdit ? (
                                      <button
                                        className={ms.is_published ? "a-btn-danger" : "a-btn-gold"}
                                        style={{ fontSize: 12, padding: "8px 14px" }}
                                        onClick={() => togglePublish(ms)}
                                      >
                                        {ms.is_published ? "Unpublish Minisite" : "Publish Minisite"}
                                      </button>
                                    ) : (
                                      <span className={`a-badge ${ms.is_published ? "a-badge-accepted" : "a-badge-pending"}`}>
                                        {ms.is_published ? "Published" : "Draft"}
                                      </span>
                                    )}
                                  </div>

                                  {/* Link to portal user */}
                                  <div>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 8px" }}>
                                      Linked Portal User
                                    </p>
                                    {canEdit ? (
                                      <div style={{ display: "flex", gap: 6 }}>
                                        <select
                                          className="a-select"
                                          style={{ fontSize: 12 }}
                                          value={linkDraft[ms.id] ?? ms.user_id ?? ""}
                                          onChange={e => setLinkDraft(p => ({ ...p, [ms.id]: e.target.value }))}
                                        >
                                          <option value="">— None —</option>
                                          {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                              {u.full_name ?? u.email ?? u.id.slice(0, 8)}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          className="a-btn-ghost"
                                          style={{ padding: "7px 12px", fontSize: 11, whiteSpace: "nowrap" }}
                                          disabled={savingLink === ms.id}
                                          onClick={() => saveLink(ms)}
                                        >
                                          {savingLink === ms.id ? "…" : "Link"}
                                        </button>
                                      </div>
                                    ) : (
                                      <p style={{ fontSize: 12, color: "rgba(255,255,255,.42)", margin: 0 }}>
                                        {ms.user_id ? users.find(u => u.id === ms.user_id)?.full_name ?? ms.user_id.slice(0, 12) + "…" : "Not linked"}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* ── Section 2: Books ── */}
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: 0 }}>
                                      Books ({ms.books.length})
                                    </p>
                                    {canEdit && bookFormMs !== ms.id && (
                                      <button
                                        className="a-btn-ghost"
                                        style={{ fontSize: 11, padding: "5px 12px" }}
                                        onClick={() => { setBookFormMs(ms.id); setBookDraft(EMPTY_BOOK) }}
                                      >
                                        + Add Book
                                      </button>
                                    )}
                                  </div>

                                  {/* Existing books */}
                                  {ms.books.map(book => (
                                    <div key={book.id} style={{
                                      display: "grid", gridTemplateColumns: "1fr auto auto",
                                      gap: 10, alignItems: "center",
                                      padding: "10px 14px",
                                      background: "rgba(255,255,255,.03)",
                                      border: "1px solid rgba(255,255,255,.07)",
                                      borderRadius: 10,
                                      marginBottom: 8,
                                    }}>
                                      <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.78)", margin: "0 0 3px" }}>{book.title}</p>
                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,.32)", margin: 0 }}>
                                          {book.genre ?? "No genre"} · {book.published_at ?? "No date"}
                                        </p>
                                      </div>
                                      {/* Buy link inline editor */}
                                      {canEdit ? (
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                          <input
                                            className="a-input"
                                            style={{ fontSize: 11, padding: "5px 9px", width: 200 }}
                                            placeholder="Buy link URL"
                                            value={buyDraft[book.id] ?? book.buy_link ?? ""}
                                            onChange={e => setBuyDraft(p => ({ ...p, [book.id]: e.target.value }))}
                                          />
                                          <button
                                            className="a-btn-ghost"
                                            style={{ fontSize: 11, padding: "5px 10px", whiteSpace: "nowrap" }}
                                            disabled={savingBuy === book.id}
                                            onClick={() => saveBuyLink(ms.id, book.id)}
                                          >
                                            {savingBuy === book.id ? "…" : "Save Link"}
                                          </button>
                                        </div>
                                      ) : (
                                        <span style={{ fontSize: 11, color: book.buy_link ? "#C9A227" : "rgba(255,255,255,.25)" }}>
                                          {book.buy_link ? "Link set" : "No link"}
                                        </span>
                                      )}
                                      {canEdit && (
                                        <button
                                          className="a-btn-danger"
                                          style={{ fontSize: 11, padding: "5px 10px" }}
                                          onClick={() => removeBook(ms.id, book.id, book.title)}
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                  ))}

                                  {ms.books.length === 0 && bookFormMs !== ms.id && (
                                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.22)", margin: "4px 0 0" }}>
                                      No books yet.
                                    </p>
                                  )}

                                  {/* Add book form */}
                                  {bookFormMs === ms.id && (
                                    <div style={{ padding: "16px 18px", background: "rgba(201,162,39,.04)", border: "1px solid rgba(201,162,39,.18)", borderRadius: 12, marginTop: 10 }}>
                                      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.65)", margin: "0 0 12px" }}>Add Book</p>
                                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                                        <div>
                                          <label className="a-label">Title *</label>
                                          <input className="a-input" placeholder="Book title" value={bookDraft.title} onChange={e => setBookDraft(p => ({ ...p, title: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label className="a-label">Genre</label>
                                          <input className="a-input" placeholder="e.g. Fiction" value={bookDraft.genre} onChange={e => setBookDraft(p => ({ ...p, genre: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label className="a-label">Cover URL</label>
                                          <input className="a-input" placeholder="https://…" value={bookDraft.cover_url} onChange={e => setBookDraft(p => ({ ...p, cover_url: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label className="a-label">Buy Link</label>
                                          <input className="a-input" placeholder="https://…" value={bookDraft.buy_link} onChange={e => setBookDraft(p => ({ ...p, buy_link: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label className="a-label">Published Date</label>
                                          <input className="a-input" type="date" value={bookDraft.published_at} onChange={e => setBookDraft(p => ({ ...p, published_at: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label className="a-label">Description</label>
                                          <input className="a-input" placeholder="Short description" value={bookDraft.description} onChange={e => setBookDraft(p => ({ ...p, description: e.target.value }))} />
                                        </div>
                                      </div>
                                      <div style={{ display: "flex", gap: 8 }}>
                                        <button className="a-btn-gold" style={{ fontSize: 12 }} disabled={addingBook || !bookDraft.title.trim()} onClick={() => addBook(ms.id)}>
                                          {addingBook ? "Adding…" : "Add Book"}
                                        </button>
                                        <button className="a-btn-ghost" style={{ fontSize: 12 }} onClick={() => { setBookFormMs(null); setBookDraft(EMPTY_BOOK) }}>
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.18)", marginTop: 14, letterSpacing: ".04em" }}>
            Click any row to manage slug, publish status, and books. Status badge is clickable to toggle publish.
          </p>
        </>
      )}
    </div>
  )
}
