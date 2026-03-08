"use client"

import React, { useEffect, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAdmin } from "./_context"
import { adminCss } from "./_styles"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

interface Stats {
  totalAuthors:      number
  pendingSubmissions: number
  totalStaff:        number
  totalSubmissions:  number
}
interface RecentAuthor {
  id:         string
  full_name:  string | null
  email:      string | null
  role:       string
  created_at: string
}
interface RecentSubmission {
  id:          string
  title:       string
  author_name: string | null
  path:        string
  status:      string
  submitted_at:string
}

export default function AdminDashboard() {
  const admin = useAdmin()
  const [stats,       setStats]       = useState<Stats | null>(null)
  const [authors,     setAuthors]     = useState<RecentAuthor[]>([])
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: totalAuthors },
        { count: pendingSubmissions },
        { count: totalStaff },
        { count: totalSubmissions },
        { data: recentAuthors },
        { data: recentSubs },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "author"),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).in("role", ["super_admin", "editor", "support"]),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("id,full_name,email,role,created_at").eq("role","author").order("created_at", { ascending: false }).limit(5),
        supabase.from("submissions").select("id,title,author_name,path,status,submitted_at").order("submitted_at", { ascending: false }).limit(5),
      ])

      setStats({
        totalAuthors:       totalAuthors      ?? 0,
        pendingSubmissions: pendingSubmissions ?? 0,
        totalStaff:         totalStaff        ?? 0,
        totalSubmissions:   totalSubmissions  ?? 0,
      })
      setAuthors(recentAuthors ?? [])
      setSubmissions(recentSubs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const statusClass = (s: string) => `a-badge a-badge-${s}`

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div className={`a-page ${body.className}`}>
      <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      <div className="a-grain" aria-hidden />

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <span className="ak">Admin Console · Dashboard</span>
        <h1 className={`a-title ${display.className}`}>
          Good to see you, {admin.name.split(" ")[0]}.
        </h1>
        <p className="a-subtitle">{today} · {admin.role.replace("_", " ")}</p>
      </div>

      {/* Stat cards */}
      <div className="a-stats">
        {[
          { label: "Registered Authors",    value: stats?.totalAuthors      ?? "—", link: "/admin/authors",     note: "All time" },
          { label: "Pending Submissions",   value: stats?.pendingSubmissions ?? "—", link: "/admin/submissions", note: "Awaiting review" },
          { label: "Total Submissions",     value: stats?.totalSubmissions   ?? "—", link: "/admin/submissions", note: "All statuses" },
          { label: "Revenue",               value: "$0",                             link: null,                 note: "Placeholder" },
        ].map(({ label, value, link, note }) => (
          <div key={label} className="a-card" style={{ position: "relative" }}>
            {link ? (
              <Link href={link} style={{ position: "absolute", inset: 0, borderRadius: 16 }} aria-label={label} />
            ) : null}
            <p className={`a-stat-num ${display.className}`}>{loading ? "—" : value}</p>
            <p className="a-stat-label">{label}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.22)", marginTop: 4, letterSpacing: ".04em" }}>{note}</p>
          </div>
        ))}
      </div>

      {/* Two column: recent authors + recent submissions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Recent Signups */}
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span className="ak" style={{ marginBottom: 0 }}>Recent Signups</span>
            <Link href="/admin/authors" style={{ fontSize: 12, color: "rgba(201,162,39,.7)", fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="a-empty">Loading…</div>
          ) : authors.length === 0 ? (
            <div className="a-empty">No authors yet.<br />They appear here once authors sign up.</div>
          ) : (
            <table className="a-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {authors.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.full_name ?? "—"}</td>
                    <td style={{ color: "rgba(255,255,255,.45)", fontSize: 12 }}>{a.email ?? "—"}</td>
                    <td style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>{fmtDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span className="ak" style={{ marginBottom: 0 }}>Recent Submissions</span>
            <Link href="/admin/submissions" style={{ fontSize: 12, color: "rgba(201,162,39,.7)", fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="a-empty">Loading…</div>
          ) : submissions.length === 0 ? (
            <div className="a-empty">No submissions yet.<br />They appear here once authors submit manuscripts.</div>
          ) : (
            <table className="a-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.title}
                    </td>
                    <td style={{ color: "rgba(255,255,255,.45)", fontSize: 12 }}>{s.author_name ?? "—"}</td>
                    <td>
                      <span className={statusClass(s.status)}>
                        <span className="a-badge-dot" />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Revenue placeholder */}
      <div className="a-card a-card-gold">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <span className="ak">Revenue Summary</span>
            <p className={display.className} style={{ fontSize: 36, fontWeight: 300, color: "#C9A227", margin: "0 0 4px", lineHeight: 1 }}>
              $0.00
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", margin: 0 }}>
              Revenue tracking will display here once payment processing is enabled.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 180 }}>
            {[
              { label: "Services Revenue",  val: "$0.00" },
              { label: "Assessments",       val: "$0.00" },
              { label: "Royalty Payouts",   val: "$0.00" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <span style={{ color: "rgba(255,255,255,.38)" }}>{label}</span>
                <span style={{ color: "#C9A227", fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
