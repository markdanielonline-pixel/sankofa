"use client"

import React, { useEffect, useState, useMemo } from "react"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"
import { useAdmin } from "../_context"
import { adminCss } from "../_styles"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

type SubmissionStatus = "pending" | "accepted" | "rejected" | "conditional"

interface Submission {
  id:           string
  title:        string
  author_name:  string | null
  author_email: string | null
  path:         string
  status:       SubmissionStatus
  ai_disclosed: boolean
  synopsis:     string | null
  notes:        string | null
  submitted_at: string
  updated_at:   string
}

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "pending",     label: "Pending" },
  { value: "accepted",    label: "Accepted" },
  { value: "rejected",    label: "Rejected" },
  { value: "conditional", label: "Conditional" },
]

type FilterTab = "all" | SubmissionStatus

export default function SubmissionsPage() {
  const admin = useAdmin()
  const canEdit = admin.role === "super_admin" || admin.role === "editor"

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState<FilterTab>("all")
  const [search,      setSearch]      = useState("")
  const [updating,    setUpdating]    = useState<string | null>(null)
  const [toast,       setToast]       = useState<string | null>(null)
  const [expanded,    setExpanded]    = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("submissions")
      .select("id,title,author_name,author_email,path,status,ai_disclosed,synopsis,notes,submitted_at,updated_at")
      .order("submitted_at", { ascending: false })
    setSubmissions((data ?? []) as Submission[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: SubmissionStatus) {
    setUpdating(id)
    const { error } = await supabase
      .from("submissions")
      .update({ status, updated_at: new Date().toISOString(), reviewed_by: admin.id })
      .eq("id", id)

    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
      showToast(`Status updated to "${status}"`)
    } else {
      showToast(`Error: ${error.message}`)
    }
    setUpdating(null)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const counts = useMemo(() => ({
    all:         submissions.length,
    pending:     submissions.filter(s => s.status === "pending").length,
    accepted:    submissions.filter(s => s.status === "accepted").length,
    rejected:    submissions.filter(s => s.status === "rejected").length,
    conditional: submissions.filter(s => s.status === "conditional").length,
  }), [submissions])

  const filtered = useMemo(() => {
    let list = filter === "all" ? submissions : submissions.filter(s => s.status === filter)
    const q = search.toLowerCase()
    if (q) list = list.filter(s =>
      (s.title ?? "").toLowerCase().includes(q) ||
      (s.author_name ?? "").toLowerCase().includes(q) ||
      (s.author_email ?? "").toLowerCase().includes(q)
    )
    return list
  }, [submissions, filter, search])

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",         label: `All (${counts.all})` },
    { key: "pending",     label: `Pending (${counts.pending})` },
    { key: "accepted",    label: `Accepted (${counts.accepted})` },
    { key: "conditional", label: `Conditional (${counts.conditional})` },
    { key: "rejected",    label: `Rejected (${counts.rejected})` },
  ]

  return (
    <div className={`a-page ${body.className}`}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      <div className="a-grain" aria-hidden />

      {/* Toast */}
      {toast && (
        <div className="a-toast">
          <span className="a-toast-dot" />
          {toast}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <span className="ak">Admin Console · Submissions</span>
        <h1 className={`a-title ${display.className}`}>Submissions</h1>
        <p className="a-subtitle">
          All manuscript submissions.
          {!loading && ` ${filtered.length} of ${submissions.length} shown.`}
          {!canEdit && " View only — editing requires Editor or Super Admin role."}
        </p>
      </div>

      {/* Tabs + search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="a-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`a-tab ${filter === tab.key ? "active" : ""}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          className="a-search"
          placeholder="Search title, author…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
      </div>

      {/* Table */}
      <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="a-empty">Loading submissions…</div>
        ) : filtered.length === 0 ? (
          <div className="a-empty">
            {search || filter !== "all" ? "No submissions match your filters." : "No submissions yet."}
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Path</th>
                  <th>AI Disclosed</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => {
                  const isExp     = expanded === sub.id
                  const isUpdating = updating === sub.id
                  return (
                    <React.Fragment key={sub.id}>
                      <tr
                        onClick={() => setExpanded(isExp ? null : sub.id)}
                        style={{ cursor: "pointer", opacity: isUpdating ? .6 : 1, transition: "opacity .2s" }}
                      >
                        <td>
                          <span style={{ fontWeight: 500, display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sub.title}
                          </span>
                        </td>
                        <td>
                          <div>
                            <span style={{ display: "block", fontSize: 13, fontWeight: 500 }}>{sub.author_name ?? "—"}</span>
                            <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,.35)" }}>{sub.author_email ?? ""}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px",
                            borderRadius: 99, letterSpacing: ".08em",
                            background: sub.path === "A" ? "rgba(201,162,39,.12)" : "rgba(120,160,255,.1)",
                            color: sub.path === "A" ? "#C9A227" : "rgba(160,200,255,.85)",
                            border: `1px solid ${sub.path === "A" ? "rgba(201,162,39,.2)" : "rgba(120,160,255,.18)"}`,
                          }}>
                            Path {sub.path}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: sub.ai_disclosed ? "rgba(80,200,120,.8)" : "rgba(255,255,255,.28)" }}>
                            {sub.ai_disclosed ? "Yes" : "No"}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,.38)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {fmtDate(sub.submitted_at)}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {canEdit ? (
                            <select
                              className="a-select"
                              value={sub.status}
                              disabled={isUpdating}
                              onChange={e => updateStatus(sub.id, e.target.value as SubmissionStatus)}
                              style={{
                                color: sub.status === "accepted"    ? "rgba(80,200,120,.9)"  :
                                       sub.status === "rejected"    ? "rgba(255,100,100,.85)":
                                       sub.status === "conditional" ? "rgba(140,180,255,.85)":
                                       "#C9A227"
                              }}
                            >
                              {STATUS_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`a-badge a-badge-${sub.status}`}>
                              <span className="a-badge-dot" />
                              {sub.status}
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExp && (
                        <tr>
                          <td colSpan={6} style={{ background: "rgba(201,162,39,.03)", padding: "18px 20px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Synopsis</p>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", margin: 0, lineHeight: 1.6 }}>
                                  {sub.synopsis ?? "No synopsis provided."}
                                </p>
                              </div>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Staff Notes</p>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,.42)", margin: "0 0 10px", lineHeight: 1.6 }}>
                                  {sub.notes ?? "No notes yet."}
                                </p>
                                {canEdit && (
                                  <NotesEditor
                                    submissionId={sub.id}
                                    currentNotes={sub.notes ?? ""}
                                    onSave={notes => {
                                      setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, notes } : s))
                                      showToast("Notes saved")
                                    }}
                                  />
                                )}
                              </div>
                              <div>
                                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", margin: "0 0 6px" }}>Details</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {[
                                    { k: "Submission ID", v: sub.id.slice(0, 12) + "…" },
                                    { k: "Last Updated", v: fmtDate(sub.updated_at) },
                                    { k: "AI Disclosed",  v: sub.ai_disclosed ? "Yes" : "No" },
                                  ].map(({ k, v }) => (
                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                      <span style={{ color: "rgba(255,255,255,.28)" }}>{k}</span>
                                      <span style={{ color: "rgba(255,255,255,.55)" }}>{v}</span>
                                    </div>
                                  ))}
                                </div>
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
        Click any row to expand details.
        {canEdit ? " Use the status dropdown to update submission decisions." : ""}
      </p>
    </div>
  )
}

/* ── Inline notes editor ── */
function NotesEditor({
  submissionId,
  currentNotes,
  onSave,
}: {
  submissionId: string
  currentNotes: string
  onSave: (notes: string) => void
}) {
  const [val,     setVal]     = useState(currentNotes)
  const [saving,  setSaving]  = useState(false)
  const [editing, setEditing] = useState(false)
  const body = Inter({ subsets: ["latin"], weight: ["400", "500"] })

  if (!editing) {
    return (
      <button
        className="a-btn-ghost"
        style={{ fontSize: 12, padding: "6px 12px" }}
        onClick={() => setEditing(true)}
      >
        {currentNotes ? "Edit notes" : "Add notes"}
      </button>
    )
  }

  async function save() {
    setSaving(true)
    await supabase
      .from("submissions")
      .update({ notes: val, updated_at: new Date().toISOString() })
      .eq("id", submissionId)
    onSave(val)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div>
      <textarea
        className={`a-input ${body.className}`}
        rows={3}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Add internal notes…"
        style={{ resize: "vertical", marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="a-btn-gold" style={{ fontSize: 12, padding: "7px 14px" }} onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="a-btn-ghost" style={{ fontSize: 12, padding: "7px 12px" }} onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </div>
  )
}
