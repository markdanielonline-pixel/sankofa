"use client"

import React, { useEffect, useState, useMemo } from "react"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"
import { useAdmin } from "../_context"
import { adminCss } from "../_styles"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

interface Author {
  id:             string
  full_name:      string | null
  email:          string | null
  role:           string
  created_at:     string
  updated_at:     string
  submissions:    { status: string; path: string }[]
}

export default function AuthorsPage() {
  const admin = useAdmin()
  const [authors,  setAuthors]  = useState<Author[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select(`
          id, full_name, email, role, created_at, updated_at,
          submissions:submissions(status, path)
        `)
        .eq("role", "author")
        .order("created_at", { ascending: false })

      setAuthors((data ?? []) as Author[])
      setLoading(false)
    }
    load()
  }, [])

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return authors
    return authors.filter(a =>
      (a.full_name ?? "").toLowerCase().includes(q) ||
      (a.email ?? "").toLowerCase().includes(q)
    )
  }, [authors, search])

  const manuscriptStatus = (a: Author) => {
    if (!a.submissions?.length) return null
    const latest = a.submissions[0]
    return latest.status
  }

  const statusClass = (s: string | null) => s ? `a-badge a-badge-${s}` : "a-badge a-badge-author"

  return (
    <div className={`a-page ${body.className}`}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      <div className="a-grain" aria-hidden />

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <span className="ak">Admin Console · Authors</span>
        <h1 className={`a-title ${display.className}`}>Authors</h1>
        <p className="a-subtitle">
          All registered authors on the platform.
          {!loading && ` ${filtered.length} of ${authors.length} shown.`}
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          className="a-search"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.28)", margin: 0 }}>
          {admin.role === "support" ? "View only" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="a-empty">Loading authors…</div>
        ) : filtered.length === 0 ? (
          <div className="a-empty">
            {search ? "No authors match your search." : "No authors yet. Authors appear here once they create an account."}
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
                {filtered.map(author => {
                  const ms    = manuscriptStatus(author)
                  const isExp = expanded === author.id
                  return (
                    <React.Fragment key={author.id}>
                      <tr
                        onClick={() => setExpanded(isExp ? null : author.id)}
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
                              {(author.full_name ?? author.email ?? "?").slice(0,2).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{author.full_name ?? "—"}</span>
                          </div>
                        </td>
                        <td style={{ color: "rgba(255,255,255,.45)", fontSize: 12 }}>
                          {author.email ?? "—"}
                        </td>
                        <td style={{ color: "rgba(255,255,255,.38)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {fmtDate(author.created_at)}
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: author.submissions?.length ? "#C9A227" : "rgba(255,255,255,.28)", fontWeight: 600 }}>
                            {author.submissions?.length ?? 0}
                          </span>
                        </td>
                        <td>
                          <span className={statusClass(ms)}>
                            {ms ? <><span className="a-badge-dot" />{ms}</> : "None"}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,.30)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {fmtDate(author.updated_at)}
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExp && (
                        <tr>
                          <td colSpan={6} style={{ background: "rgba(201,162,39,.04)", padding: "16px 20px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Author ID</p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.42)", margin: 0, wordBreak: "break-all" }}>{author.id}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Submission History</p>
                                {author.submissions?.length ? (
                                  author.submissions.map((s, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>Path {s.path}</span>
                                      <span className={`a-badge a-badge-${s.status}`} style={{ fontSize: 10, padding: "1px 7px" }}>{s.status}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ fontSize: 11, color: "rgba(255,255,255,.25)", margin: 0 }}>No submissions</p>
                                )}
                              </div>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Portal Activity</p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,.42)", margin: 0 }}>Last seen {fmtDate(author.updated_at)}</p>
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
    </div>
  )
}
