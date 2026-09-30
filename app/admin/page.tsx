"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAdmin } from "./_context"
import { adminCss } from "./_styles"
import SalesImport from "./SalesImport"
import { IsbnPanel, BookDetails } from "./BookTools"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* eslint-disable @typescript-eslint/no-explicit-any */
type MC = any
type Tab = "decisions" | "pipeline" | "exceptions" | "contracts" | "money" | "system"

const money = (n: number) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const label = (s: string) => s.replace(/_/g, " ")

export default function MissionControl() {
  const admin = useAdmin()
  const isOwner = admin.role === "super_admin"
  const [mc, setMc] = useState<MC>(null)
  const [err, setErr] = useState("")
  const [tab, setTab] = useState<Tab>("decisions")
  const [toast, setToast] = useState("")
  const [open, setOpen] = useState<string | null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [summary, setSummary] = useState("")
  const [nexts, setNexts] = useState<Record<string, string[]>>({})
  const [busy, setBusy] = useState(false)
  const [detailsFor, setDetailsFor] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("mission_control")
    if (error) setErr(error.message)
    else { setMc(data); setErr("") }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    supabase.from("title_transitions_allowed").select("from_state,to_state").then(({ data }) => {
      const m: Record<string, string[]> = {}
      ;(data || []).forEach((r: any) => { (m[r.from_state] ||= []).push(r.to_state) })
      setNexts(m)
    })
    return () => clearInterval(t)
  }, [load])

  function say(m: string) { setToast(m); setTimeout(() => setToast(""), 3500) }

  async function expand(d: any) {
    if (open === d.id) { setOpen(null); return }
    setOpen(d.id); setSummary(""); setDetail(null)
    const { data } = await supabase.from("submissions").select("synopsis,author_bio,ai_disclosure,ai_use_details,word_count,file_url,genre,target_audience,third_party_material").eq("id", d.submission_id).maybeSingle()
    let url = ""
    if (data?.file_url) {
      const s = await supabase.storage.from("manuscripts").createSignedUrl(data.file_url, 3600)
      url = s.data?.signedUrl || ""
    }
    setDetail({ ...data, url })
  }

  async function decide(id: string, decision: string) {
    if (decision !== "accepted" && summary.trim().length < 20) { say("Please write a short note to the author first (at least 20 characters)."); return }
    setBusy(true)
    const { error } = await supabase.rpc("owner_decide", { p_title: id, p_decision: decision, p_summary: summary, p_note: "" })
    setBusy(false)
    if (error) say("Could not save: " + error.message)
    else { say("Decision saved. The author has been emailed."); setOpen(null); load() }
  }

  async function advance(id: string, to: string) {
    if (!to) return
    const { error } = await supabase.rpc("staff_advance", { p_title: id, p_to: to, p_note: "" })
    if (error) say(error.message); else { say("Moved to " + label(to)); load() }
  }
  async function setProofLink(id: string) {
    const url = window.prompt("Paste the https:// link to the cover and interior proofs (Drive, Dropbox, etc.). Set this BEFORE moving the book to author approval.")
    if (!url) return
    const { error } = await supabase.rpc("staff_set_proof_link", { p_title: id, p_url: url.trim() })
    if (error) say(error.message); else say("Proof link saved")
  }
  async function resolve(id: string) {
    const { error } = await supabase.rpc("resolve_exception", { p_id: id, p_note: "" })
    if (error) say(error.message); else { say("Marked resolved"); load() }
  }
  async function sendContract(title_id: string) {
    const { error } = await supabase.rpc("owner_send_contract", { p_title: title_id })
    if (error) say(error.message); else { say("Agreement sent to the author"); load() }
  }

  const decisions: any[] = mc?.decisions_waiting || []
  const exceptions: any[] = mc?.exceptions || []
  const urgent = exceptions.filter(e => e.severity === "urgent").length
  const inProd = (mc?.active_titles || []).filter((t: any) => ["contracting", "production", "launch"].includes(t.phase)).length
  const live = (mc?.active_titles || []).filter((t: any) => t.phase === "live").length
  const sys = mc?.system || {}
  const m = mc?.money || {}

  const tabs: [Tab, string][] = [
    ["decisions", `Decisions (${decisions.length})`], ["pipeline", "Pipeline"], ["exceptions", `Exceptions (${exceptions.length})`],
    ["contracts", "Agreements"], ["money", "Money"], ["system", "System"],
  ]

  return (
    <div className={`a-page ${body.className}`}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      <div className="a-grain" aria-hidden />
      <div style={{ marginBottom: 24 }}>
        <span className="ak">Mission Control</span>
        <h1 className={`a-title ${display.className}`}>Sankofa at a glance</h1>
        <p className="a-subtitle">Everything that needs you, in one place. Everything else runs itself.</p>
      </div>

      {err ? <div className="a-card" style={{ marginBottom: 16 }}>Could not load: {err}</div> : null}

      <div className="a-stats">
        {[
          { l: "Decisions waiting", v: decisions.length, n: "Target: answer within 7 days" },
          { l: "Needs attention", v: exceptions.length, n: urgent ? `${urgent} urgent` : "Nothing urgent" },
          { l: "In production", v: inProd, n: "Contracting to launch" },
          { l: "Published", v: live, n: "Live titles" },
        ].map(s => (
          <div key={s.l} className="a-card">
            <p className={`a-stat-num ${display.className}`}>{mc ? s.v : "-"}</p>
            <p className="a-stat-label">{s.l}</p>
            <p style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{s.n}</p>
          </div>
        ))}
      </div>

      <div className="a-tabs" style={{ margin: "22px 0 14px", flexWrap: "wrap" }}>
        {tabs.map(([k, l]) => (
          <button key={k} className={`a-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "decisions" && (
        <div style={{ display: "grid", gap: 12 }}>
          {decisions.length === 0 && <div className="a-empty">No manuscripts are waiting. You are all caught up.</div>}
          {decisions.map(d => (
            <div key={d.id} className="a-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", cursor: "pointer" }} onClick={() => expand(d)}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>{d.author || "Author"} &middot; {d.genre} &middot; {label(d.state)}</div>
                </div>
                <div style={{ fontSize: 12, color: d.age_days >= 6 ? "#ff8a7a" : d.age_days >= 3 ? "#e3c05a" : undefined }}>
                  Day {d.age_days} of 7
                </div>
              </div>
              {open === d.id && (
                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {!detail ? <div className="a-empty">Loading...</div> : (
                    <>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}><b>Synopsis.</b> {detail.synopsis}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}><b>Author.</b> {detail.author_bio}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Audience: {detail.target_audience} &middot; Words: {detail.word_count || "not given"} &middot; AI use: {detail.ai_disclosure}
                        {detail.ai_use_details ? ` (${detail.ai_use_details})` : ""}
                        {detail.third_party_material ? ` · Third-party material: ${detail.third_party_material}` : ""}
                      </div>
                      {detail.url ? <a className="a-btn-ghost" style={{ width: "fit-content" }} href={detail.url} target="_blank" rel="noreferrer">Open manuscript</a> : null}
                      {isOwner ? (
                        <>
                          <label className="a-label">Note to the author (shown in their email and portal)</label>
                          <textarea className="a-input" rows={4} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Be kind and specific. For an acceptance this is optional." />
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button disabled={busy} className="a-btn-gold" onClick={() => decide(d.id, "accepted")}>Accept</button>
                            <button disabled={busy} className="a-btn-ghost" onClick={() => decide(d.id, "conditional_acceptance")}>Accept with changes</button>
                            <button disabled={busy} className="a-btn-ghost" onClick={() => decide(d.id, "declined_revisable")}>Decline, may revise</button>
                            <button disabled={busy} className="a-btn-danger" onClick={() => decide(d.id, "declined_final")}>Decline</button>
                          </div>
                        </>
                      ) : <div style={{ fontSize: 12, opacity: 0.6 }}>Only the owner can make decisions.</div>}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "pipeline" && (
        <>
          <div className="a-card" style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(mc?.pipeline || []).filter((p: any) => p.count > 0).map((p: any) => (
              <span key={p.state} className="a-badge">{label(p.state)}: {p.count}</span>
            ))}
            {mc && (mc.pipeline || []).every((p: any) => p.count === 0) ? <span className="a-empty">No titles yet.</span> : null}
          </div>
          <div className="a-table-wrap">
            <table className="a-table">
              <thead><tr><th>Title</th><th>Author</th><th>Stage</th><th>Days here</th><th>Move to</th></tr></thead>
              <tbody>
                {(mc?.active_titles || []).map((t: any) => (
                  <tr key={t.id}>
                    <td>{t.title}</td><td>{t.author}</td><td>{label(t.state)}</td><td>{t.days_in_state}</td>
                    <td>
                      {["production", "cover_production", "interior_production", "proofing", "author_approval", "metadata", "distribution_setup", "prelaunch", "scheduled"].includes(t.state) && (
                        <button className="a-btn-ghost" style={{ marginRight: 8 }} onClick={() => setDetailsFor(detailsFor === t.id ? null : t.id)}>Book details</button>
                      )}
                      {["proofing", "author_approval"].includes(t.state) && (
                        <button className="a-btn-ghost" style={{ marginRight: 8 }} onClick={() => setProofLink(t.id)}>Proof link</button>
                      )}
                      <select className="a-select" defaultValue="" onChange={e => advance(t.id, e.target.value)}>
                        <option value="">Choose...</option>
                        {(nexts[t.state] || []).filter(s => !["accepted", "conditional_acceptance", "declined_revisable", "declined_final"].includes(s)).map(s => <option key={s} value={s}>{label(s)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {detailsFor && (() => {
            const tt = (mc?.active_titles || []).find((x: any) => x.id === detailsFor)
            return tt ? <BookDetails key={detailsFor} titleId={detailsFor} title={tt.title} onClose={() => setDetailsFor(null)} onSaved={load} /> : null
          })()}
        </>
      )}

      {tab === "exceptions" && (
        <div style={{ display: "grid", gap: 10 }}>
          {exceptions.length === 0 && <div className="a-empty">Nothing needs attention.</div>}
          {exceptions.map(e => (
            <div key={e.id} className="a-card" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <span className="a-badge">{e.severity}</span>
                <div style={{ marginTop: 6 }}>{e.summary}</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>{label(e.kind)} &middot; {new Date(e.created_at).toLocaleDateString()}</div>
              </div>
              <button className="a-btn-ghost" onClick={() => resolve(e.id)}>Mark resolved</button>
            </div>
          ))}
        </div>
      )}

      {tab === "contracts" && (
        <div style={{ display: "grid", gap: 10 }}>
          <div className="a-card" style={{ fontSize: 13 }}>Publishing agreements. Before sending the first one, have your lawyer approve the agreement wording.</div>
          {(mc?.contracts || []).length === 0 && <div className="a-empty">No agreements in progress.</div>}
          {(mc?.contracts || []).map((c: any) => (
            <div key={c.id} className="a-card" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div><b>{c.title}</b><div style={{ fontSize: 12, opacity: 0.6 }}>Status: {c.status === "sent" ? "sent, waiting for author signature" : c.status}</div></div>
              {isOwner && c.status === "draft" ? <button className="a-btn-gold" onClick={() => sendContract(c.title_id)}>Send to author</button> : null}
            </div>
          ))}
        </div>
      )}

      {tab === "money" && (
        <>
          <div className="a-stats">
            {[
              ["Net receipts this year", money(m.net_receipts_ytd)], ["Owed to authors this year", money(m.author_share_ytd)],
              ["Sankofa share this year", money(m.sankofa_share_ytd)], ["Payments scheduled", `${money(m.payouts_scheduled)} (${m.payouts_count || 0})`],
            ].map(([l, v]) => (
              <div key={l} className="a-card"><p className={`a-stat-num ${display.className}`} style={{ fontSize: 26 }}>{v}</p><p className="a-stat-label">{l}</p></div>
            ))}
          </div>
          <div className="a-card" style={{ marginTop: 12, fontSize: 13 }}>
            Reserves held for returns: {money(m.reserves_held)}. Statements are issued automatically each quarter and payments are due within 45 days of quarter end.
            Payments go out automatically through Stripe Connect to authors who have finished payment setup. Keep the Sankofa Stripe balance funded.
          </div>
          <SalesImport />
          {(m.payouts_count || 0) === 0 && <div className="a-empty" style={{ marginTop: 12 }}>No payments scheduled yet.</div>}
        </>
      )}

      {tab === "system" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div className="a-card">
            <b>Automation health</b>
            <div style={{ fontSize: 13, lineHeight: 1.9, marginTop: 8 }}>
              Email sending: {sys.email_ready ? "connected" : "NOT connected yet (emails wait in the queue)"}<br />
              Emails waiting: {sys.emails_queued ?? 0} &middot; Sent in 30 days: {sys.emails_sent_30d ?? 0} &middot; Failed: {sys.emails_failed ?? 0}<br />
              Staff AI connection: {sys.staffai_connected ? "connected" : "not connected"} &middot; Events waiting: {sys.events_pending ?? 0}<br />
              Submissions in 30 days: {sys.submissions_30d ?? 0}
            </div>
          </div>
          <IsbnPanel />
          <div className="a-table-wrap">
            <table className="a-table">
              <thead><tr><th>Automated service</th><th>Today</th><th>Daily limit</th><th>This month</th><th>Status</th></tr></thead>
              <tbody>
                {(mc?.spend || []).map((s: any) => (
                  <tr key={s.provider}><td>{s.provider}</td><td>{money(s.today)}</td><td>{money(s.daily_limit)}</td><td>{money(s.month)}</td><td>{s.circuit_open ? "Paused (limit hit)" : "OK"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>More: <Link href="/admin/submissions">all submissions</Link> &middot; <Link href="/admin/authors">authors</Link></div>
        </div>
      )}

      {toast ? <div className="a-toast"><span className="a-toast-dot" />{toast}</div> : null}
    </div>
  )
}
