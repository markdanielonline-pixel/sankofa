"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase"

/* eslint-disable @typescript-eslint/no-explicit-any */

// Column names we accept (any spelling in this list, case-insensitive).
const ALIASES: Record<string, string[]> = {
  isbn: ["isbn", "isbn13", "isbn-13", "ean"],
  sale_date: ["date", "sale_date", "sale date", "order date", "transaction date", "period"],
  units: ["units", "quantity", "qty", "net units"],
  gross: ["gross", "gross receipts", "revenue", "amount", "sales", "list price total", "total received"],
  manufacturing: ["manufacturing", "printing", "print cost", "printing cost", "production cost"],
  commission: ["commission", "channel commission", "retailer fee", "wholesale discount", "distribution fee"],
  processing: ["processing", "payment processing", "processing fee"],
  taxes: ["taxes", "tax", "taxes collected"],
  channel: ["channel", "sales channel", "market"],
  source_ref: ["reference", "source_ref", "order id", "order number", "transaction id", "id", "line id"],
  type: ["type", "entry type", "transaction type"],
  currency: ["currency"],
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cur = "", q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === ",") { row.push(cur); cur = "" }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cur); cur = ""
      if (row.some(x => x.trim() !== "")) rows.push(row)
      row = []
    } else cur += c
  }
  row.push(cur)
  if (row.some(x => x.trim() !== "")) rows.push(row)
  return rows
}

const money = (s: string) => {
  const t = (s || "").replace(/[$,\s]/g, "")
  const neg = /^\(.*\)$/.test(t)
  const n = Number(t.replace(/[()]/g, ""))
  return Number.isFinite(n) ? (neg ? -n : n) : 0
}

function hash(s: string) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export default function SalesImport({ onDone }: { onDone?: () => void }) {
  const [preview, setPreview] = useState<any[]>([])
  const [fileName, setFileName] = useState("")
  const [source, setSource] = useState("bookvault")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  async function onFile(f: File | undefined) {
    setNote(""); setPreview([])
    if (!f) return
    setFileName(f.name)
    const rows = parseCsv(await f.text())
    if (rows.length < 2) { setNote("That file has no data rows."); return }
    const head = rows[0].map(h => h.trim().toLowerCase())
    const idx: Record<string, number> = {}
    for (const [k, names] of Object.entries(ALIASES)) {
      const i = head.findIndex(h => names.includes(h))
      if (i >= 0) idx[k] = i
    }
    if (idx.isbn === undefined || idx.gross === undefined) {
      setNote("I could not find an ISBN column and a gross/revenue column. Check the first row of the file has headers.")
      return
    }
    const out = rows.slice(1).map((r, n) => {
      const g = (k: string) => (idx[k] !== undefined ? (r[idx[k]] || "").trim() : "")
      const rawType = g("type").toLowerCase()
      const type = /refund/.test(rawType) ? "refund" : /return/.test(rawType) ? "return" : "sale"
      const e: any = {
        isbn: g("isbn"), sale_date: g("sale_date"), units: g("units") || "1", gross: Math.abs(money(g("gross"))),
        manufacturing: Math.abs(money(g("manufacturing"))), commission: Math.abs(money(g("commission"))),
        processing: Math.abs(money(g("processing"))), taxes: Math.abs(money(g("taxes"))),
        channel: g("channel"), type, currency: g("currency"),
      }
      const parsed = e.sale_date ? new Date(e.sale_date) : null
      e.sale_date = parsed && !isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : ""
      // Stable reference so uploading the same file twice never double counts.
      e.source_ref = g("source_ref") || `${source}-${hash(r.join("|"))}-${n}`
      return e
    })
    setPreview(out)
  }

  async function submit() {
    setBusy(true); setNote("")
    const { data, error } = await supabase.rpc("owner_import_sales", { p_rows: preview, p_source: `upload_${source}` })
    setBusy(false)
    if (error) { setNote(error.message); return }
    const d: any = data
    setNote(`Imported ${d.imported}. Already on file (skipped): ${d.duplicates_skipped}. Needs a look: ${d.failed}${d.failed ? " (see Needs attention)" : ""}.`)
    setPreview([]); setFileName("")
    onDone?.()
  }

  const total = preview.reduce((s, r) => s + (r.gross || 0), 0)

  return (
    <div className="a-card" style={{ marginTop: 12 }}>
      <b>Import sales</b>
      <p style={{ fontSize: 13, opacity: 0.7, margin: "6px 0 10px" }}>
        Upload a sales report (CSV) from BookVault, IngramSpark or any retailer. Each line is matched to a book by ISBN and sent to the royalty ledger. Uploading the same file twice is safe.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={source} onChange={e => setSource(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="bookvault">BookVault</option>
          <option value="ingramspark">IngramSpark</option>
          <option value="direct">Direct sales</option>
          <option value="other">Other</option>
        </select>
        <input type="file" accept=".csv,text/csv" onChange={e => onFile(e.target.files?.[0])} />
      </div>
      {preview.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 13 }}>
          {fileName}: {preview.length} lines, ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })} gross.
          <div><button className="a-btn-gold" style={{ marginTop: 8 }} onClick={submit} disabled={busy}>{busy ? "Importing..." : "Import these sales"}</button></div>
        </div>
      )}
      {note && <p style={{ fontSize: 13, marginTop: 10 }}>{note}</p>}
    </div>
  )
}
