"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function IsbnPanel() {
  const [st, setSt] = useState<any>(null)
  const [text, setText] = useState("")
  const [msg, setMsg] = useState("")
  const load = async () => { const { data } = await supabase.rpc("isbn_pool_status"); setSt(data) }
  useEffect(() => { load() }, [])
  async function add() {
    setMsg("")
    const { data, error } = await supabase.rpc("owner_add_isbns", { p_text: text, p_format: "print" })
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
        <textarea style={inp} rows={4} placeholder="Book description for retailers" value={f.retailer_description || ""} onChange={set("retailer_description")} />
        <input style={inp} placeholder="Keywords, separated by commas" value={f.keywords || ""} onChange={set("keywords")} />
        <input style={inp} placeholder="BISAC codes, separated by commas (e.g. REL012000)" value={f.bisac_codes || ""} onChange={set("bisac_codes")} />
        <label style={{ fontSize: 12, opacity: 0.7 }}>Publication date (the book publishes itself on this day)</label>
        <input style={inp} type="date" value={f.approved_publication_date || ""} onChange={set("approved_publication_date")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="a-btn-gold" onClick={save}>Save</button>
        <button className="a-btn-ghost" onClick={onClose}>Close</button>
      </div>
      {msg && <p style={{ fontSize: 13, marginTop: 8 }}>{msg}</p>}
    </div>
  )
}
