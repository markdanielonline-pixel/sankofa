"use client"

import React, { useState } from "react"

const COUNTRIES: [string, string][] = [
  ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"], ["AU", "Australia"],
  ["TT", "Trinidad and Tobago"], ["JM", "Jamaica"], ["BB", "Barbados"], ["GY", "Guyana"], ["BS", "Bahamas"],
  ["GD", "Grenada"], ["LC", "Saint Lucia"], ["VC", "Saint Vincent and the Grenadines"], ["AG", "Antigua and Barbuda"],
  ["KN", "Saint Kitts and Nevis"], ["DM", "Dominica"], ["BZ", "Belize"], ["SR", "Suriname"], ["HT", "Haiti"],
  ["DO", "Dominican Republic"], ["KY", "Cayman Islands"], ["BM", "Bermuda"], ["NG", "Nigeria"], ["GH", "Ghana"],
  ["KE", "Kenya"], ["ZA", "South Africa"], ["UG", "Uganda"], ["TZ", "Tanzania"], ["SL", "Sierra Leone"],
  ["LR", "Liberia"], ["SN", "Senegal"], ["CM", "Cameroon"], ["ET", "Ethiopia"], ["IE", "Ireland"],
  ["FR", "France"], ["DE", "Germany"], ["NL", "Netherlands"], ["BE", "Belgium"], ["ES", "Spain"], ["IT", "Italy"],
  ["PT", "Portugal"], ["SE", "Sweden"], ["NO", "Norway"], ["DK", "Denmark"], ["NZ", "New Zealand"], ["IN", "India"],
  ["AE", "United Arab Emirates"], ["SG", "Singapore"], ["BR", "Brazil"], ["MX", "Mexico"],
]

type Opt = { servID: number; name: string; tracked: boolean; daysMin: number; daysMax: number; shipping_usd: number }
type Quote = { title: string; qty: number; unit_usd: number; book_usd: number; options: Opt[]; error?: string }

export default function BuyPanel({ isbn, unit }: { isbn: string; unit: number }) {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState("US")
  const [postcode, setPostcode] = useState("")
  const [qty, setQty] = useState(1)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [pick, setPick] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")

  const money = (n: number) => "$" + n.toFixed(2)
  const reset = () => { setQuote(null); setPick(null); setMsg("") }

  async function getQuote() {
    setBusy(true); setMsg(""); setQuote(null); setPick(null)
    try {
      const r = await fetch("/api/store/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isbn, qty, country, postcode }) })
      const j = await r.json()
      if (j.error) { setMsg(j.error); return }
      setQuote(j); setPick(j.options?.[0]?.servID ?? null)
    } catch { setMsg("Could not get shipping just now. Please try again.") }
    finally { setBusy(false) }
  }

  async function checkout() {
    if (!quote || pick == null) return
    setBusy(true); setMsg("")
    try {
      const r = await fetch("/api/store/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isbn, qty, country, postcode, servID: pick }) })
      const j = await r.json()
      if (j.url) { window.location.href = j.url; return }
      setMsg(j.error || "Checkout is not available right now. Please email contact@sankofapublishers.com and we will take your order by hand.")
    } catch { setMsg("Checkout is not available right now. Please try again.") }
    finally { setBusy(false) }
  }

  const sel = quote?.options.find((o) => o.servID === pick)
  const total = quote && sel ? quote.book_usd + sel.shipping_usd : null

  const field: React.CSSProperties = { width: "100%", padding: "11px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.07)", color: "#fff", fontSize: 15 }
  const lab: React.CSSProperties = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sk-gold)", fontWeight: 600, display: "block", marginBottom: 6 }

  if (!open) return <button className="sk-btn primary" onClick={() => setOpen(true)}>Buy the paperback</button>

  return (
    <div style={{ border: "1px solid rgba(201,162,39,.5)", borderRadius: 10, padding: 20, background: "rgba(255,255,255,.04)", maxWidth: 470 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 12 }}>
        <div>
          <label style={lab}>Ship to</label>
          <select style={field} value={country} onChange={(e) => { setCountry(e.target.value); reset() }}>
            {COUNTRIES.map(([c, n]) => <option key={c} value={c} style={{ color: "#000" }}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={lab}>Copies</label>
          <select style={field} value={qty} onChange={(e) => { setQty(Number(e.target.value)); reset() }}>
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n} style={{ color: "#000" }}>{n}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label style={lab}>Postcode / ZIP (if your country uses one)</label>
        <input style={field} value={postcode} onChange={(e) => { setPostcode(e.target.value); reset() }} placeholder="e.g. 10001" />
      </div>
      {!quote && <button className="sk-btn primary" style={{ marginTop: 16 }} onClick={getQuote} disabled={busy}>{busy ? "Checking..." : "See shipping and total"}</button>}

      {quote && (
        <div style={{ marginTop: 18 }}>
          <span style={lab}>Choose delivery</span>
          {quote.options.map((o) => (
            <label key={o.servID} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", border: "1px solid " + (pick === o.servID ? "var(--sk-gold)" : "rgba(255,255,255,.2)"), borderRadius: 8, marginBottom: 8, cursor: "pointer" }}>
              <input type="radio" name="svc" checked={pick === o.servID} onChange={() => setPick(o.servID)} style={{ marginTop: 4 }} />
              <span style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>
                {o.name}<br /><span style={{ opacity: 0.7, fontSize: 12 }}>{o.tracked ? "Tracked" : "Not tracked"}, about {o.daysMin}-{o.daysMax} working days after printing</span>
              </span>
              <b>{money(o.shipping_usd)}</b>
            </label>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", marginTop: 12, paddingTop: 12, fontSize: 15, lineHeight: 1.8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Book{quote.qty > 1 ? ` x${quote.qty}` : ""} ({money(unit)} each)</span><span>{money(quote.book_usd)}</span></div>
            {sel && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Shipping</span><span>{money(sel.shipping_usd)}</span></div>}
            {total != null && <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18 }}><span>Total (USD)</span><span>{money(total)}</span></div>}
          </div>
          <button className="sk-btn primary" style={{ marginTop: 14, width: "100%" }} onClick={checkout} disabled={busy || pick == null}>{busy ? "Opening secure checkout..." : "Pay securely"}</button>
          <p style={{ fontSize: 12, opacity: 0.65, margin: "10px 0 0", lineHeight: 1.5 }}>Charged in US dollars; your bank converts to your local currency. Printed on demand, so delivery time starts after printing (usually 2-4 working days). Secure payment by Stripe.</p>
        </div>
      )}
      {msg && <p style={{ color: "#f0b4a8", fontSize: 14, marginTop: 12 }}>{msg}</p>}
    </div>
  )
}
