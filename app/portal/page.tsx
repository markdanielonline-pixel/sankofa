"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabase"

/* eslint-disable @typescript-eslint/no-explicit-any */
const STEPS = ["Review", "Decision", "Agreement", "Production", "Launch", "Published"]
const PHASE_STEP: Record<string, number> = { intake: 0, assessment: 0, decision: 1, contracting: 2, production: 3, launch: 4, live: 5, exit: 5, hold: 3 }

const STATE_TEXT: Record<string, string> = {
  automated_screening: "We have your manuscript and it is in our review queue.",
  submitted: "We have your manuscript and it is in our review queue.",
  editorial_assessment: "Our editors are reading your manuscript.",
  owner_review: "Your manuscript is with the publisher for a final decision.",
  accepted: "Congratulations. Your book has been accepted.",
  conditional_acceptance: "We would like to move forward, subject to some changes. See the note below.",
  declined_revisable: "We could not accept it in its current form. You are welcome to revise and resubmit.",
  declined_final: "We are not able to offer to publish this book.",
  author_onboarding: "We are getting your author details ready.",
  contract_generation: "Your publishing agreement is being prepared.",
  awaiting_signature: "Your publishing agreement is ready for you to read and sign.",
  contracted: "Agreement signed. Production will begin shortly.",
  editorial_preparation: "Preparing your manuscript for production.",
  production: "Your book is in production.",
  cover_production: "Your cover is being designed.",
  interior_production: "Your interior is being typeset.",
  proofing: "Proofs are being prepared.",
  author_approval: "Your proof is ready for your approval.",
  metadata: "Preparing your book's listing details.",
  distribution_setup: "Setting up distribution.",
  prelaunch: "Getting ready for launch.",
  scheduled: "Your launch is scheduled.",
  published: "Your book is published.",
  active: "Your book is live and selling.",
}

const money = (n: number) => "$" + Number(n || 0).toFixed(2)
const label = (s: string) => s.replace(/_/g, " ")

export default function Portal() {
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<any>(null)
  const [signedIn, setSignedIn] = useState(false)
  const [name, setName] = useState("")
  const [agree, setAgree] = useState(false)
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession()
    setSignedIn(!!s.session)
    if (s.session) {
      const { data: d } = await supabase.rpc("author_portal")
      setData(d)
    }
    setReady(true)
  }, [])
  useEffect(() => { load() }, [load])

  const [pay, setPay] = useState<string>("")
  useEffect(() => {
    if (!signedIn) return
    ;(async () => {
      const { data: s } = await supabase.auth.getSession()
      const tok = s.session?.access_token
      if (!tok) return
      try {
        const r = await fetch("/api/stripe/status", { headers: { Authorization: `Bearer ${tok}` } })
        const j = await r.json()
        setPay(j.status || "")
      } catch { /* payments card stays hidden */ }
    })()
  }, [signedIn])

  async function setupPayments() {
    setBusy(true); setMsg("")
    const { data: s } = await supabase.auth.getSession()
    const r = await fetch("/api/stripe/connect", { method: "POST", headers: { Authorization: `Bearer ${s.session?.access_token}` } })
    const j = await r.json()
    setBusy(false)
    if (j.url) window.location.href = j.url; else setMsg(j.error || "Could not start payment setup. Please try again.")
  }

  const [proofNote, setProofNote] = useState<Record<string, string>>({})
  async function respondProof(id: string, approve: boolean) {
    setBusy(true); setMsg("")
    const { data: d, error } = await supabase.rpc("author_respond_request", { p_request: id, p_approve: approve, p_note: proofNote[id] || "" })
    setBusy(false)
    if (error) { setMsg(error.message); return }
    const res = (d as any)?.result
    setMsg(res === "approved" ? "Thank you. Your proofs are approved and your book moves to the next step."
      : res === "beyond_included_rounds" ? "We received your changes. Because they go past the two included rounds, we will contact you shortly about next steps."
      : "Thank you. We received your changes and will send revised proofs.")
    load()
  }

  async function sign(titleId: string) {
    setBusy(true); setMsg("")
    const { error } = await supabase.rpc("author_sign_contract", { p_title: titleId, p_typed_name: name })
    setBusy(false)
    if (error) setMsg(error.message); else { setMsg("Thank you. Your agreement is signed."); setName(""); setAgree(false); load() }
  }

  if (!ready) return <div className="sk-body"><div className="sk-wrap" style={{ padding: "80px 0" }}>Loading...</div></div>

  if (!signedIn) {
    return (
      <div className="sk-body">
        <div className="sk-narrow" style={{ padding: "90px 0", textAlign: "center" }}>
          <span className="sk-kicker">Author portal</span>
          <h1 className="sk-h2">Sign in to see your books.</h1>
          <p className="sk-p">Follow your manuscript, sign your agreement and read your statements.</p>
          <div className="sk-btnrow" style={{ justifyContent: "center" }}>
            <Link className="sk-btn primary" href="/auth/login">Sign In</Link>
            <Link className="sk-btn ghost onlight" href="/auth/signup">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  const titles: any[] = data?.titles || []
  const statements: any[] = data?.statements || []
  const estimates: any[] = data?.estimates || []

  return (
    <div className="sk-body">
      <section className="sk-section"><div className="sk-wrap">
        <span className="sk-kicker">Author portal</span>
        <h1 className="sk-h2">{data?.author?.name ? `Welcome, ${data.author.name}.` : "Welcome."}</h1>
        <div className="sk-btnrow" style={{ marginBottom: 28 }}>
          <Link className="sk-btn primary" href="/submissions">Submit a new manuscript</Link>
          <Link className="sk-btn ghost onlight" href="/portal/profile">Edit my author page</Link>
        </div>

        {(pay === "not_started" || pay === "incomplete" || pay === "ready") && (
          <div className="sk-card" style={{ marginBottom: 20 }}>
            <h3 className="sk-h3" style={{ marginBottom: 6 }}>Royalty payments</h3>
            {pay === "ready" ? (
              <p style={{ margin: 0 }}>Your payment details are set up. Royalties are paid automatically each quarter once you reach the $50 minimum.</p>
            ) : (
              <>
                <p style={{ margin: "0 0 12px" }}>{pay === "incomplete" ? "Your payment setup is not finished yet. Finish it so we can pay you." : "Set up where we send your royalties. It takes a few minutes and is handled securely by Stripe."}</p>
                <button className="sk-btn primary" onClick={setupPayments} disabled={busy}>{pay === "incomplete" ? "Finish payment setup" : "Set up payments"}</button>
              </>
            )}
          </div>
        )}
        {msg && <p className="sk-p">{msg}</p>}

        {titles.length === 0 && (
          <div className="sk-callout"><p className="sk-p">You have not submitted a manuscript yet. Submitting is free.</p></div>
        )}

        {titles.map(t => {
          const step = PHASE_STEP[t.phase] ?? 0
          const reviewing = ["submitted", "automated_screening", "editorial_assessment", "owner_review"].includes(t.state)
          const held = t.phase === "hold"
          return (
            <div key={t.id} className="sk-card" style={{ marginBottom: 20 }}>
              <h3 className="sk-h3" style={{ marginBottom: 6 }}>{t.title}</h3>
              <p style={{ margin: "0 0 14px" }}>{held ? "We need to talk to you about this book. We will be in touch shortly." : (STATE_TEXT[t.state] || label(t.state))}</p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {STEPS.map((s, i) => (
                  <span key={s} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: i <= step ? "var(--sk-gold, #C9A227)" : "rgba(0,0,0,.06)", color: i <= step ? "#111" : "rgba(0,0,0,.5)" }}>{s}</span>
                ))}
              </div>

              {reviewing && <p className="sk-note">We aim to respond by {new Date(t.respond_by).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</p>}
              {t.summary && <div className="sk-callout"><b>A note from the publisher</b><p style={{ margin: "6px 0 0" }}>{t.summary}</p></div>}

              {(t.requests || []).filter((r: any) => r.kind === "proof_approval").map((r: any) => (
                <div key={r.id} className="sk-callout" style={{ marginTop: 12 }}>
                  <b>Your proofs are ready{r.round > 1 ? ` (revision ${r.round - 1})` : ""}</b>
                  <p className="sk-p">Please review your cover and interior{r.due_at ? ` by ${new Date(r.due_at).toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : ""}. Your agreement includes two rounds of revisions.</p>
                  {t.proof_url ? <p className="sk-p"><a href={t.proof_url} target="_blank" rel="noopener noreferrer">Open your proofs</a></p> : <p className="sk-note">Your proof link is being attached. Check back shortly or reply to our email.</p>}
                  <div className="sk-form">
                    <div className="sk-field"><label>Changes you would like (leave blank if approving)</label>
                      <textarea rows={3} value={proofNote[r.id] || ""} onChange={e => setProofNote({ ...proofNote, [r.id]: e.target.value })} />
                    </div>
                    <div className="sk-btnrow">
                      <button className="sk-btn primary" disabled={busy} onClick={() => respondProof(r.id, true)}>Approve as it is</button>
                      <button className="sk-btn ghost onlight" disabled={busy || !(proofNote[r.id] || "").trim()} onClick={() => respondProof(r.id, false)}>Send my changes</button>
                    </div>
                  </div>
                </div>
              ))}

              {(t.requests || []).filter((r: any) => r.kind !== "proof_approval").map((r: any) => (
                <p key={r.id} className="sk-note"><b>Waiting on you:</b> {label(r.kind)}{r.due_at ? `, due ${new Date(r.due_at).toLocaleDateString()}` : ""}{r.status === "overdue" ? " (overdue)" : ""}</p>
              ))}

              {t.contract?.status === "sent" && (
                <div className="sk-callout" style={{ marginTop: 12 }}>
                  <b>Your publishing agreement</b>
                  <p className="sk-p">Key terms: you keep your copyright. Sankofa holds an exclusive worldwide license for print, ebook and audio for {t.contract.term_years} years. You receive 60% of defined net receipts, with no advance and no publishing fee. Please read the full agreement sent to your email and take advice if you wish.</p>
                  <div className="sk-form">
                    <label className="check"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /> I have read and agree to the publishing agreement.</label>
                    <div className="sk-field"><label>Type your full legal name to sign</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                    <button className="sk-btn primary" disabled={!agree || name.trim().length < 3 || busy} onClick={() => sign(t.id)}>Sign agreement</button>
                    {msg && <p className={msg.startsWith("Thank") ? "ok" : "err"}>{msg}</p>}
                  </div>
                </div>
              )}
              {t.contract?.status === "signed" && <p className="sk-note">Agreement signed on {new Date(t.contract.signed_at).toLocaleDateString()}.</p>}
            </div>
          )
        })}

        <h2 className="sk-h2" style={{ marginTop: 40 }}>Royalty statements</h2>
        {statements.length === 0 ? (
          <p className="sk-p">Your first statement will appear here after your book is on sale and a quarter has ended. Statements are issued every quarter, even when there are no sales.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sk-example" style={{ width: "100%", minWidth: 560 }}>
              <thead><tr><th style={{ textAlign: "left" }}>Quarter</th><th>Units</th><th>Net receipts</th><th>Your 60%</th><th>Balance</th><th style={{ textAlign: "left" }}>Payment</th></tr></thead>
              <tbody>
                {statements.map(s => (
                  <tr key={s.id}>
                    <td>{s.period}</td><td>{s.units}</td><td>{money(s.net_receipts)}</td><td>{money(s.earnings)}</td><td>{money(s.closing_balance)}</td>
                    <td>{s.payout_amount > 0 ? `${money(s.payout_amount)} by ${s.payout_due_by}` : "Rolls forward (under $50)"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {estimates.length > 0 && (
          <>
            <h2 className="sk-h2" style={{ marginTop: 40 }}>Estimated sales this quarter</h2>
            <p className="sk-note">Estimates only. Your official figures are in your quarterly statement.</p>
            <div style={{ overflowX: "auto" }}>
              <table className="sk-example" style={{ width: "100%", minWidth: 480 }}>
                <thead><tr><th style={{ textAlign: "left" }}>Channel</th><th>Units</th><th>Estimated earnings</th></tr></thead>
                <tbody>{estimates.map((e, i) => <tr key={i}><td>{e.label || e.channel}</td><td>{e.units}</td><td>{money(e.estimated_earnings)}</td></tr>)}</tbody>
              </table>
            </div>
          </>
        )}
        <p className="sk-note" style={{ marginTop: 28 }}>Questions? Write to <a href="mailto:contact@sankofapublishers.com">contact@sankofapublishers.com</a>.</p>
      </div></section>
    </div>
  )
}
