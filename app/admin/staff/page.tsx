"use client"

import React, { useEffect, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAdmin, type AdminRole } from "../_context"
import { adminCss } from "../_styles"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

interface StaffMember {
  id:         string
  full_name:  string | null
  email:      string | null
  role:       AdminRole
  created_at: string
}

const ROLE_OPTIONS: { value: AdminRole; label: string; desc: string }[] = [
  { value: "editor",      label: "Editor",      desc: "View and update submission statuses" },
  { value: "support",     label: "Support",     desc: "View authors and submissions only" },
  { value: "super_admin", label: "Super Admin", desc: "Full access including staff management" },
]

export default function StaffPage() {
  const admin  = useAdmin()
  const router = useRouter()

  // Only Super Admins may access this page
  useEffect(() => {
    if (admin.role !== "super_admin") router.replace("/admin")
  }, [admin.role, router])

  const [staff,   setStaff]   = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<string | null>(null)

  // Add staff form
  const [email,   setEmail]   = useState("")
  const [role,    setRole]    = useState<AdminRole>("editor")
  const [adding,  setAdding]  = useState(false)
  const [formErr, setFormErr] = useState("")

  // Confirm remove
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [removing,  setRemoving]  = useState(false)

  useEffect(() => {
    if (admin.role === "super_admin") loadStaff()
  }, [admin.role])

  async function loadStaff() {
    const { data } = await supabase
      .from("profiles")
      .select("id,full_name,email,role,created_at")
      .in("role", ["super_admin", "editor", "support"])
      .order("created_at", { ascending: false })

    setStaff((data ?? []) as StaffMember[])
    setLoading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault()
    setFormErr("")
    if (!email.trim()) { setFormErr("Email is required."); return }

    setAdding(true)
    // Find the user's profile by email and update their role
    const { data: profile, error: findErr } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("email", email.trim().toLowerCase())
      .single()

    if (findErr || !profile) {
      setFormErr("No account found with that email. The user must sign up first.")
      setAdding(false)
      return
    }

    if (profile.role === role) {
      setFormErr(`That user already has the "${role}" role.`)
      setAdding(false)
      return
    }

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", profile.id)

    if (updateErr) {
      setFormErr(`Failed to assign role: ${updateErr.message}`)
      setAdding(false)
      return
    }

    showToast(`${profile.full_name ?? email} added as ${role.replace("_", " ")}.`)
    setEmail("")
    setRole("editor")
    await loadStaff()
    setAdding(false)
  }

  async function handleRemoveStaff(memberId: string) {
    setRemoving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ role: "author", updated_at: new Date().toISOString() })
      .eq("id", memberId)

    if (!error) {
      setStaff(prev => prev.filter(s => s.id !== memberId))
      showToast("Staff member removed. Their role has been set to Author.")
    } else {
      showToast(`Error: ${error.message}`)
    }
    setConfirmId(null)
    setRemoving(false)
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  if (admin.role !== "super_admin") return null

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
        <span className="ak">Admin Console · Staff</span>
        <h1 className={`a-title ${display.className}`}>Staff Manager</h1>
        <p className="a-subtitle">
          Add, remove, and reassign staff roles. Super Admin access only.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

        {/* Staff table */}
        <div>
          <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
            {loading ? (
              <div className="a-empty">Loading staff…</div>
            ) : staff.length === 0 ? (
              <div className="a-empty">No staff yet. Use the form to add the first team member.</div>
            ) : (
              <div className="a-table-wrap">
                <table className="a-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Added</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: "50%",
                              background: member.role === "super_admin" ? "rgba(201,162,39,.2)" : "rgba(255,255,255,.06)",
                              border: `1px solid ${member.role === "super_admin" ? "rgba(201,162,39,.4)" : "rgba(255,255,255,.1)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700,
                              color: member.role === "super_admin" ? "#f5d878" : "rgba(255,255,255,.5)",
                              flexShrink: 0,
                            }}>
                              {(member.full_name ?? member.email ?? "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span style={{ display: "block", fontWeight: 500, fontSize: 13 }}>
                                {member.full_name ?? "—"}
                                {member.id === admin.id && (
                                  <span style={{ marginLeft: 6, fontSize: 10, color: "rgba(201,162,39,.6)", letterSpacing: ".08em" }}>You</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "rgba(255,255,255,.42)", fontSize: 12 }}>
                          {member.email ?? "—"}
                        </td>
                        <td>
                          <span className={`a-badge a-badge-${member.role}`}>
                            {member.role.replace("_", " ")}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,.32)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {fmtDate(member.created_at)}
                        </td>
                        <td>
                          {member.id !== admin.id ? (
                            confirmId === member.id ? (
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  className="a-btn-danger"
                                  onClick={() => handleRemoveStaff(member.id)}
                                  disabled={removing}
                                  style={{ fontSize: 11 }}
                                >
                                  {removing ? "Removing…" : "Confirm"}
                                </button>
                                <button
                                  className="a-btn-ghost"
                                  onClick={() => setConfirmId(null)}
                                  style={{ fontSize: 11, padding: "6px 10px" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="a-btn-ghost"
                                style={{ fontSize: 12, padding: "6px 12px", color: "rgba(255,100,100,.65)", borderColor: "rgba(255,80,80,.15)" }}
                                onClick={() => setConfirmId(member.id)}
                              >
                                Remove
                              </button>
                            )
                          ) : (
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,.18)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add staff form */}
        <div>
          <div className="a-card a-card-gold">
            <span className="ak">Add Staff Member</span>
            <p className={display.className} style={{ fontSize: 18, fontWeight: 400, color: "white", margin: "0 0 18px", lineHeight: 1.2 }}>
              Assign a Role
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", margin: "0 0 20px", lineHeight: 1.6 }}>
              The user must already have a Sankofa account. Enter their email to assign an admin role.
            </p>

            <form onSubmit={handleAddStaff}>
              <div className="a-field">
                <label className="a-label">Email Address</label>
                <input
                  type="email"
                  className={`a-input ${body.className}`}
                  placeholder="staff@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="a-field">
                <label className="a-label">Role</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ROLE_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                        background: role === opt.value ? "rgba(201,162,39,.1)" : "rgba(255,255,255,.03)",
                        border: `1px solid ${role === opt.value ? "rgba(201,162,39,.35)" : "rgba(255,255,255,.07)"}`,
                        transition: "background .18s, border-color .18s",
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={opt.value}
                        checked={role === opt.value}
                        onChange={() => setRole(opt.value)}
                        style={{ marginTop: 3, accentColor: "#C9A227", flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: role === opt.value ? "#C9A227" : "rgba(255,255,255,.72)", margin: "0 0 2px" }}>
                          {opt.label}
                        </p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,.32)", margin: 0, lineHeight: 1.4 }}>
                          {opt.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formErr && (
                <div style={{
                  padding: "11px 14px", borderRadius: 10,
                  background: "rgba(255,60,60,.07)", border: "1px solid rgba(255,60,60,.2)",
                  fontSize: 13, color: "rgba(255,100,100,.85)", marginBottom: 16,
                }}>
                  {formErr}
                </div>
              )}

              <button type="submit" className={`a-btn-gold ${body.className}`} disabled={adding} style={{ width: "100%", justifyContent: "center" }}>
                {adding ? "Assigning role…" : "Add Staff Member →"}
              </button>
            </form>
          </div>

          {/* Role reference card */}
          <div className="a-card" style={{ marginTop: 14 }}>
            <span className="ak" style={{ marginBottom: 14 }}>Role Permissions</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { role: "Super Admin", perms: ["Full admin access", "Manage staff & roles", "View all data", "Update submissions"] },
                { role: "Editor",      perms: ["View all data", "Update submission statuses", "Add staff notes"] },
                { role: "Support",     perms: ["View authors", "View submissions", "No editing"] },
              ].map(({ role: r, perms }) => (
                <div key={r} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: r === "Super Admin" ? "#C9A227" : "rgba(255,255,255,.65)", margin: "0 0 6px" }}>
                    {r}
                  </p>
                  {perms.map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                      <span style={{ color: "rgba(201,162,39,.5)", fontSize: 10 }}>·</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
