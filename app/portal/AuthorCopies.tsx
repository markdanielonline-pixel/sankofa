"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { COUNTRIES } from "../components/site/BuyPanel"

/* eslint-disable @typescript-eslint/no-explicit-any */
const money = (n: number) => "$" + Number(n || 0).toFixed(2)

export default function AuthorCopies() {
  const [books, setBooks] = useState<any[]>([])
  const [isbn, setIsbn] = useState("")
  const [qty, setQty] = useState(10)
  const [country, setCountry] = useState("US")
  const [post, setPost] = useState("")
  const [quote, setQuote] = useState<any>(null)
  const [pick, setPick] = useState<number | null>(null)
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.rpc("author_my_copy_titles")
      const list = (data as any[]) || []
      setBooks(list)
      if (list[0]) setIsbn(list[0].isbn)
    })()
  }, [])

  if (books.length === 0) return null
  const book = books.find(b => b.isbn === isbn) || books[0]
  const field: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }

  async function call(body: any) {
    const { data: s } = await supabase.auth.getSession()
    const r = await fetch("/api/author-copies", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session?.access_token}` }, body: JSON.stringify(body) })
    return r.json()
  }
  async function getQuote() {
    setBusy(true); setErr("")
    const j = await call({ isbn, qty, country, postcode: post })
    setBusy(false)
    if (j.error) { setErr(j.error); return }
    setQuote(j); setPick(j.options?.[0]?.servID ?? null)
  }
  async function pay() {
    setBusy(true); setErr("")
    const j = await call({ isbn, qty, country, postcode: post, servID: pick })
    if (j.url) { window.location.href = j.url; return }
    setBusy(false); setErr(j.error || "Something went wrong")
  }
  const opt = quote?.options?.find((o: any) => o.servID === pick)

  return (
    <div className="sk-card" style={{ marginBottom: 20 }}>
      <h3 className="sk-h3" style={{ marginBottom: 6 }}>Order author copies</h3>
      <p style={{ margin: "0 0 12px" }}>Buy copies of your own book at {book.discount_pct}% off the list price. Shipping is charged at cost. Author copies do not earn royalties.</p>
      <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        {books.length > 1 && (
          <select style={field} value={isbn} onChange={e => { setIsbn(e.target.value); setQuote(null) }}>
            {books.map(b => <option key={b.isbn} value={b.isbn}>{b.title}</option>)}
          </select>
        )}
        <div>Your price: <b>{money(book.unit_usd)}</b> per copy (list {money(book.list_usd)})</div>
        <label>Copies
          <select style={field} value={qty} onChange={e => { setQty(Number(e.target.value)); setQuote(null) }}>
            {[1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>Ship to
          <select style={field} value={country} onChange={e => { setCountry(e.target.value); setQuote(null) }}>
            {COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </label>
        <label>Postcode (if your country uses one)
          <input style={field} value={post} onChange={e => { setPost(e.target.value); setQuote(null) }} />
        </label>
        {!quote && <button className="sk-btn primary" onClick={getQuote} disabled={busy}>{busy ? "Checking..." : "See shipping and total"}</button>}
        {quote && (
          <>
            {quote.options.map((o: any) => (
              <label key={o.servID} style={{ display: "block" }}>
                <input type="radio" checked={pick === o.servID} onChange={() => setPick(o.servID)} /> {o.name}, {money(o.shipping_usd)} ({o.daysMin}-{o.daysMax} days)
              </label>
            ))}
            {opt && <div>Books {money(quote.book_usd)} + shipping {money(opt.shipping_usd)} = <b>{money(quote.book_usd + opt.shipping_usd)}</b></div>}
            <button className="sk-btn primary" onClick={pay} disabled={busy || pick == null}>{busy ? "Opening secure checkout..." : "Pay securely"}</button>
          </>
        )}
        {err && <p className="sk-note" style={{ color: "#b00020" }}>{err}</p>}
      </div>
    </div>
  )
}
