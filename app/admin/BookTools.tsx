"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function IsbnPanel() {
  const [st, setSt] = useState<any>(null)
  const [text, setText] = useState("")
  const [msg, setMsg] = useState("")
  const [fmt, setFmt] = useState("print")
  async function onFile(f?: File) { if (f) setText(await f.text()) }
  const load = async () => { const { data } = await supabase.rpc("isbn_pool_status"); setSt(data) }
  useEffect(() => { load() }, [])
  async function add() {
    setMsg("")
    const { data, error } = await supabase.rpc("owner_add_isbns", { p_text: text, p_format: fmt })
    if (error) { setMsg(error.message); return }
    const d: any = data
    setMsg(`Added ${d.added}. Already had ${d.duplicates}. Invalid numbers skipped: ${d.invalid}.`)
    setText(""); load()
  }
  return (
    <div className="a-card">
      <b>ISBN supply</b>
      <div style={{ fontSize: 13, margin: "6px 0 10px", opacity: 0.8 }}>
        {st ? `${st.available} available, ${st.assigned} assigned.` : "Loading..."} Each new book gets the next one automatically. You will get an email when supply runs low.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
        <select value={fmt} onChange={e => setFmt(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="print">Paperback / hardcover ISBNs</option>
          <option value="ebook">Ebook ISBNs</option>
          <option value="audio">Audiobook ISBNs</option>
        </select>
        <input type="file" accept=".csv,.txt,text/plain,text/csv" onChange={e => onFile(e.target.files?.[0])} />
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3} style={{ width: "100%", padding: 8, borderRadius: 6 }} placeholder="Paste ISBN-13 numbers you bought, one per line or separated by commas" />
      <div style={{ marginTop: 8 }}><button className="a-btn-gold" onClick={add} disabled={!text.trim()}>Add ISBNs</button></div>
      {msg && <p style={{ fontSize: 13, marginTop: 8 }}>{msg}</p>}
    </div>
  )
}

export function BookDetails({ titleId, title, onClose, onSaved }: { titleId: string; title: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<any>({})
  const [missing, setMissing] = useState<string[]>([])
  const [msg, setMsg] = useState("")
  useEffect(() => {
    supabase.rpc("staff_get_book_details", { p_title: titleId }).then(({ data }) => {
      const d: any = data || {}
      setMissing(d.missing || [])
      setF({ ...d, page_count: d.page_count ?? "", retail_price: d.retail_price ?? "" })
    })
  }, [titleId])
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  async function save() {
    setMsg("")
    const { error } = await supabase.rpc("staff_set_book_details", { p_title: titleId, p_fields: {
      trim_size: f.trim_size || "", page_count: String(f.page_count || ""), retail_price: String(f.retail_price || ""),
      retailer_description: f.retailer_description || "", keywords: f.keywords || "", bisac_codes: f.bisac_codes || "",
      approved_publication_date: f.approved_publication_date || "",
    } })
    if (error) { setMsg(error.message); return }
    setMsg("Saved. The system will move the book forward on its own once everything is filled in.")
    onSaved()
  }
  async function uploadFile(kind: "cover" | "interior", file?: File) {
    if (!file) return
    setMsg("Uploading " + kind + "...")
    const path = `${titleId}/${kind}-${Date.now()}.pdf`
    const up = await supabase.storage.from("book-files").upload(path, file, { contentType: "application/pdf", upsert: false })
    if (up.error) { setMsg(up.error.message); return }
    const { error } = await supabase.rpc("staff_set_book_files", { p_title: titleId, p_cover: kind === "cover" ? path : "", p_interior: kind === "interior" ? path : "" })
    if (error) { setMsg(error.message); return }
    setF({ ...f, [kind === "cover" ? "cover_path" : "interior_path"]: path, bookvault_step: null, bookvault_error: null })
    setMsg(kind + " uploaded. Once both files are in, the BookVault handoff runs by itself.")
    onSaved()
  }
  const inp = { width: "100%", padding: 8, borderRadius: 6, marginBottom: 8 } as const
  return (
    <div className="a-card" style={{ marginTop: 10 }}>
      <b>Book details: {title}</b>
      {f.isbn_print ? <div style={{ fontSize: 12, opacity: 0.7 }}>ISBN {f.isbn_print}</div> : <div style={{ fontSize: 12, opacity: 0.7 }}>ISBN is assigned automatically at the metadata stage.</div>}
      {missing.length > 0 && <div style={{ fontSize: 12, color: "#e3c05a", margin: "6px 0" }}>Still needed: {missing.join(", ")}</div>}
      <div style={{ display: "grid", gap: 4, marginTop: 8 }}>
        <input style={inp} placeholder="Trim size, e.g. 5.5 x 8.5" value={f.trim_size || ""} onChange={set("trim_size")} />
        <input style={inp} placeholder="Page count" inputMode="numeric" value={f.page_count ?? ""} onChange={set("page_count")} />
        <input style={inp} placeholder="Retail price, e.g. 16.99" inputMode="decimal" value={f.retail_price ?? ""} onChange={set("retail_price")} />
        <PriceCheck titleId={titleId} price={f.retail_price} />
        <textarea style={inp} rows={4} placeholder="Book description for retailers" value={f.retailer_description || ""} onChange={set("retailer_description")} />
        <input style={inp} placeholder="Keywords, separated by commas" value={f.keywords || ""} onChange={set("keywords")} />
        <input style={inp} placeholder="BISAC codes, separated by commas (e.g. REL012000)" value={f.bisac_codes || ""} onChange={set("bisac_codes")} />
        <label style={{ fontSize: 12, opacity: 0.7 }}>Publication date (the book publishes itself on this day)</label>
        <input style={inp} type="date" value={f.approved_publication_date || ""} onChange={set("approved_publication_date")} />
        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 10, marginTop: 6 }}>
          <b style={{ fontSize: 13 }}>Final print files (sent to BookVault automatically)</b>
          <div style={{ fontSize: 12, opacity: 0.7, margin: "4px 0 8px" }}>
            {f.bookvault_step ? "BookVault status: " + f.bookvault_step.replace(/_/g, " ") : "Upload both PDFs and the handoff starts on its own."}
            {f.bookvault_error ? " Problem: " + f.bookvault_error : ""}
          </div>
          <label style={{ fontSize: 12, opacity: 0.7 }}>Full cover PDF (back + spine + front) {f.cover_path ? "(uploaded)" : ""}</label>
          <input style={inp} type="file" accept="application/pdf" onChange={(e) => uploadFile("cover", e.target.files?.[0])} />
          <label style={{ fontSize: 12, opacity: 0.7 }}>Interior PDF {f.interior_path ? "(uploaded)" : ""}</label>
          <input style={inp} type="file" accept="application/pdf" onChange={(e) => uploadFile("interior", e.target.files?.[0])} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="a-btn-gold" onClick={save}>Save</button>
        <button className="a-btn-ghost" onClick={onClose}>Close</button>
      </div>
      {msg && <p style={{ fontSize: 13, marginTop: 8 }}>{msg}</p>}
    </div>
  )
}

function PriceCheck({ titleId, price }: { titleId: string; price: any }) {
  const [pc, setPc] = useState<any>(null)
  useEffect(() => {
    const p = parseFloat(String(price || ""))
    const h = setTimeout(() => {
      supabase.rpc("price_check", { p_title: titleId, p_price: isNaN(p) ? null : p }).then(({ data }) => setPc(data || null))
    }, 400)
    return () => clearTimeout(h)
  }, [titleId, price])
  if (!pc) return null
  const m = (n: any) => (n == null ? "-" : "$" + Number(n).toFixed(2))
  const cell: React.CSSProperties = { padding: "3px 6px", textAlign: "right" }
  return (
    <div style={{ gridColumn: "1 / -1", fontSize: 13, padding: 10, borderRadius: 8, background: pc.ok ? "#eef7ee" : "#fdeeee" }}>
      <b>{pc.ok ? "Margins protected" : "Margin warning"}</b> &nbsp; Print cost {m(pc.print_cost)}{pc.print_cost_is_estimate ? " (estimate until BookVault cost is saved)" : ""}
      <table style={{ width: "100%", marginTop: 6, borderCollapse: "collapse" }}>
        <thead><tr><th style={{ ...cell, textAlign: "left" }}>Sale type</th><th style={cell}>Price</th><th style={cell}>Print</th><th style={cell}>Fees</th><th style={cell}>Author</th><th style={cell}>Sankofa</th><th style={cell}>Our %</th></tr></thead>
        <tbody>{(pc.channels || []).map((c: any) => (
          <tr key={c.key} style={{ borderTop: "1px solid #0002" }}>
            <td style={{ ...cell, textAlign: "left" }}>{c.label}</td><td style={cell}>{m(c.price)}</td><td style={cell}>{m(c.print_cost)}</td><td style={cell}>{m(c.fees)}</td><td style={cell}>{m(c.author_gets)}</td><td style={cell}><b>{m(c.sankofa_gets)}</b></td><td style={cell}>{c.sankofa_pct}%</td>
          </tr>))}</tbody>
      </table>
      <div style={{ marginTop: 6 }}>Lowest safe retail price {m(pc.min_list_price)}. Recommended {m(pc.recommended_list_price)}. Shipping is paid by the buyer and not shown.</div>
      {(pc.issues || []).map((i: string, k: number) => <div key={k}>• {i}</div>)}
    </div>
  )
}