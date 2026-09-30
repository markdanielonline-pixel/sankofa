"use client"

import React, { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function Inner() {
  const sp = useSearchParams()
  const id = sp.get("session_id") || ""
  const [st, setSt] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/store/confirm?session_id=${encodeURIComponent(id)}`).then((r) => r.json()).then(setSt).catch(() => setSt({ error: true }))
  }, [id])

  return (
    <div className="sk-body">
      <section style={{ background: "radial-gradient(120% 100% at 50% 0%,#23201a 0%,#0b0b0c 75%)", color: "#fff", padding: "90px 0" }}>
        <div className="sk-wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <span className="sk-kicker">Order received</span>
          <h1 style={{ fontFamily: "var(--font-display),Georgia,serif", fontSize: "clamp(32px,5vw,48px)", margin: "0 0 16px" }}>Thank you.</h1>
          {!st && <p className="sk-p" style={{ color: "rgba(255,255,255,.8)" }}>Confirming your payment...</p>}
          {st && st.paid === false && <p className="sk-p" style={{ color: "rgba(255,255,255,.8)" }}>We have not received a completed payment for this order. If you were charged, email contact@sankofapublishers.com and we will sort it out straight away.</p>}
          {st && st.paid && (
            <>
              <p className="sk-p" style={{ color: "rgba(255,255,255,.85)", fontSize: 19 }}>
                Your order{st.order_no ? ` #${st.order_no}` : ""} is confirmed and on its way to print.
              </p>
              <p className="sk-p" style={{ color: "rgba(255,255,255,.7)" }}>
                {st.email ? `A confirmation is going to ${st.email}. ` : ""}Your book is printed on demand, then shipped. Tracking details follow by email.
              </p>
            </>
          )}
          {st && st.error && <p className="sk-p" style={{ color: "rgba(255,255,255,.8)" }}>We could not load the order details, but your payment is safe. You will get an email confirmation shortly.</p>}
          <div className="sk-btnrow" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="sk-btn primary" href="/books">Back to our books</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Thanks() {
  return <Suspense fallback={null}><Inner /></Suspense>
}
