"use client"

import { useMemo, useState } from "react"

export default function ServicesPage() {

  const [praTier, setPraTier] = useState<"short" | "standard" | "extended">("standard")
  const [formatTier, setFormatTier] = useState<"standard" | "advanced" | "premium">("advanced")
  const [coverTier, setCoverTier] = useState<"essential" | "strategic" | "signature">("strategic")

  const praPrice = useMemo(() => {
    if (praTier === "short") return "$395"
    if (praTier === "standard") return "$550"
    return "$750"
  }, [praTier])

  const formatPrice = useMemo(() => {
    if (formatTier === "standard") return "$500"
    if (formatTier === "advanced") return "$850"
    return "$1,200"
  }, [formatTier])

  const coverPrice = useMemo(() => {
    if (coverTier === "essential") return "$600"
    if (coverTier === "strategic") return "$1,200"
    return "$1,800"
  }, [coverTier])

  return (
    <main>

      <style>{`

:root{
  --ink:#0c0f14;
  --muted:#5a6676;
  --line:rgba(12,15,20,.10);
  --panel:#ffffff;
  --wash:#f6f3ee;
  --gold:rgba(212,175,55,.9);
  --shadow: 0 18px 40px rgba(12,15,20,.10);
  --shadow2: 0 10px 24px rgba(12,15,20,.08);
}

.page{
  background: var(--wash);
  color: var(--ink);
  min-height: 100vh;
}

.wrap{
  max-width: 1180px;
  margin: 0 auto;
  padding: 90px 20px;
  position: relative;
}

.hero{
  padding: 10px 0 28px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.kicker{
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
}

.h1{
  font-size: 48px;
  line-height: 1.05;
  font-weight: 800;
  margin: 0;
}

.sub{
  max-width: 820px;
  font-size: 16.5px;
  line-height: 1.45;
  color: rgba(12,15,20,.82);
}

.quote{
  font-size: 18px;
  font-weight: 700;
  color: rgba(12,15,20,.88);
}

.floatSlot{
  position: absolute;
  right: 10px;
  top: 40px;
  width: 340px;
  height: 340px;
  pointer-events: none;
  opacity: .9;
}

@media(max-width: 980px){
  .floatSlot{ display:none; }
  .h1{ font-size: 36px; }
}

.section{
  margin-top: 34px;
}

.sectionTitle{
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.sectionDesc{
  margin: 0 0 14px 0;
  color: rgba(12,15,20,.78);
  line-height: 1.45;
}

.notice{
  border: 1px solid var(--line);
  background: rgba(255,255,255,.7);
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: var(--shadow2);
}

.noticeTitle{
  font-weight: 800;
  margin: 0 0 6px 0;
}

.noticeText{
  margin: 0;
  color: rgba(12,15,20,.78);
  line-height: 1.45;
}

.grid4{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.grid3{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.grid2{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media(max-width: 1100px){
  .grid4{ grid-template-columns: repeat(2, 1fr); }
}
@media(max-width: 740px){
  .grid4{ grid-template-columns: 1fr; }
  .grid3{ grid-template-columns: 1fr; }
  .grid2{ grid-template-columns: 1fr; }
}

.card{
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow2);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 260px;
}

.cardTop{
  display:flex;
  flex-direction: column;
  gap: 6px;
}

.cardTitle{
  font-size: 18px;
  font-weight: 850;
  margin: 0;
}

.cardPrice{
  font-size: 26px;
  font-weight: 900;
  margin: 0;
}

.cardRange{
  font-size: 13px;
  color: rgba(12,15,20,.70);
  margin: 0;
}

.cardBody{
  color: rgba(12,15,20,.78);
  line-height: 1.42;
  font-size: 14.5px;
}

.bullets{
  margin: 0;
  padding-left: 18px;
}
.bullets li{
  margin-bottom: 6px;
}

.pills{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.pill{
  border: 1px solid rgba(12,15,20,.12);
  background: rgba(12,15,20,.03);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}
.pillActive{
  border-color: rgba(212,175,55,.55);
  background: rgba(212,175,55,.14);
}

.actions{
  margin-top: auto;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn{
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 800;
  font-size: 14px;
  border: 1px solid rgba(12,15,20,.14);
  background: #fff;
  cursor: pointer;
}

.btnPrimary{
  border-color: rgba(212,175,55,.65);
  background: rgba(212,175,55,.16);
}

.hr{
  height: 1px;
  background: rgba(12,15,20,.10);
  margin: 18px 0;
}

.listCard{
  background: rgba(255,255,255,.75);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow2);
  padding: 18px;
}

.row{
  display:flex;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(12,15,20,.08);
}
.row:last-child{
  border-bottom: 0;
}

.rowTitle{
  font-weight: 850;
}

.rowMeta{
  color: rgba(12,15,20,.70);
  font-weight: 750;
  white-space: nowrap;
}

.upsell{
  margin-top: 18px;
  background: #fff;
  border: 1px solid rgba(12,15,20,.10);
  border-radius: 16px;
  padding: 18px;
  box-shadow: var(--shadow2);
}

.upsellTitle{
  font-weight: 900;
  margin: 0 0 8px 0;
}

.upsellText{
  margin: 0;
  color: rgba(12,15,20,.78);
  line-height: 1.45;
}

      `}</style>

      <div className="page">
        <div className="wrap">

          <div className="floatSlot" aria-hidden="true">
            {/* drop your floating image here later */}
          </div>

          <header className="hero">
            <div className="kicker">Professional Services</div>
            <h1 className="h1">We do not dilute. We refine.</h1>
            <div className="sub">
              Sankofa Publishers offers professional publishing services for authors who require structural, editorial, production, or strategic support. Using our services does not guarantee publication. It guarantees professional preparation.
            </div>
          </header>

          <section className="section">
            <div className="notice">
              <div className="noticeTitle">Consultation Notice</div>
              <p className="noticeText">
                If you need clarity before purchasing, contact us first. Some services require a free pre purchase consultation to ensure authors do not purchase a service that is not necessary for their specific situation. This consultation is always free.
              </p>
            </div>
          </section>

          <section className="section">
            <h2 className="sectionTitle">Direct Purchase Services</h2>
            <p className="sectionDesc">Structured, fixed investment services that can be selected immediately.</p>

            <div className="grid4">

              <div className="card">
                <div className="cardTop">
                  <p className="cardTitle">Publishing Readiness Assessment (PRA)</p>
                  <p className="cardPrice">{praPrice}</p>
                  <p className="cardRange">Investment: $395 – $750 depending on manuscript length</p>
                </div>

                <div className="cardBody">
                  For authors submitting manuscripts they believe are publication ready. Even strong manuscripts benefit from structured professional evaluation before entering distribution.
                </div>

                <div className="pills">
                  <div className={`pill ${praTier === "short" ? "pillActive" : ""}`} onClick={() => setPraTier("short")}>
                    Up to 40,000 words
                  </div>
                  <div className={`pill ${praTier === "standard" ? "pillActive" : ""}`} onClick={() => setPraTier("standard")}>
                    40,001 – 80,000
                  </div>
                  <div className={`pill ${praTier === "extended" ? "pillActive" : ""}`} onClick={() => setPraTier("extended")}>
                    80,001 – 120,000
                  </div>
                </div>

                <div className="cardBody">
                  <ul className="bullets">
                    <li>Structural integrity review</li>
                    <li>Argument and narrative coherence analysis</li>
                    <li>Formatting and compliance review</li>
                    <li>Production viability assessment</li>
                    <li>AI disclosure verification</li>
                    <li>Risk and legal flagging</li>
                    <li>Written editorial report with recommendations</li>
                  </ul>
                  <div className="hr" />
                  <div>
                    <strong>Refund Guarantee</strong><br/>
                    If you purchase the PRA at the time of submission and your manuscript is not accepted for publication, you will receive a 100 percent refund of your PRA investment. The purpose of this service is protection, not profit.
                  </div>
                </div>

                <div className="actions">
                  <button className="btn btnPrimary">Purchase PRA</button>
                  <button className="btn">Ask a question</button>
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <p className="cardTitle">Cover Design</p>
                  <p className="cardPrice">{coverPrice}</p>
                  <p className="cardRange">Investment: $600 – $1,800</p>
                </div>

                <div className="pills">
                  <div className={`pill ${coverTier === "essential" ? "pillActive" : ""}`} onClick={() => setCoverTier("essential")}>
                    Essential
                  </div>
                  <div className={`pill ${coverTier === "strategic" ? "pillActive" : ""}`} onClick={() => setCoverTier("strategic")}>
                    Strategic
                  </div>
                  <div className={`pill ${coverTier === "signature" ? "pillActive" : ""}`} onClick={() => setCoverTier("signature")}>
                    Signature
                  </div>
                </div>

                <div className="cardBody">
                  {coverTier === "essential" && (
                    <>
                      Your cover determines whether your book is considered. We design market competitive, genre aligned, strategically positioned covers.
                      <ul className="bullets">
                        <li>Market research</li>
                        <li>One primary concept</li>
                        <li>Two refinement rounds</li>
                        <li>Custom design</li>
                        <li>Print ready files</li>
                        <li>eBook version</li>
                      </ul>
                    </>
                  )}

                  {coverTier === "strategic" && (
                    <>
                      Designed for stronger positioning and higher confidence at shelf level.
                      <ul className="bullets">
                        <li>Market research</li>
                        <li>Three concept directions</li>
                        <li>Strategic positioning guidance</li>
                        <li>Refinement within scope</li>
                        <li>Print ready files</li>
                        <li>eBook version</li>
                      </ul>
                    </>
                  )}

                  {coverTier === "signature" && (
                    <>
                      Premium differentiation for authors seeking maximum market impact.
                      <ul className="bullets">
                        <li>Market research</li>
                        <li>Advanced concept presentation</li>
                        <li>Strategic positioning consultation</li>
                        <li>Custom design</li>
                        <li>Print ready files</li>
                        <li>eBook version</li>
                      </ul>
                      <div className="hr" />
                      Premium illustrated covers priced separately.
                    </>
                  )}
                </div>

                <div className="actions">
                  <button className="btn btnPrimary">Purchase Cover Design</button>
                  <button className="btn">Ask a question</button>
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <p className="cardTitle">Interior Formatting</p>
                  <p className="cardPrice">{formatPrice}</p>
                  <p className="cardRange">Investment: $500 – $1,200</p>
                </div>

                <div className="pills">
                  <div className={`pill ${formatTier === "standard" ? "pillActive" : ""}`} onClick={() => setFormatTier("standard")}>
                    Up to 50,000 words
                  </div>
                  <div className={`pill ${formatTier === "advanced" ? "pillActive" : ""}`} onClick={() => setFormatTier("advanced")}>
                    50,001 – 90,000
                  </div>
                  <div className={`pill ${formatTier === "premium" ? "pillActive" : ""}`} onClick={() => setFormatTier("premium")}>
                    90,001 – 130,000
                  </div>
                </div>

                <div className="cardBody">
                  Professional interior design for paperback, hardcover, and eBook.
                  <ul className="bullets">
                    <li>Typography alignment</li>
                    <li>Chapter styling</li>
                    <li>Front and back matter formatting</li>
                    <li>Print compliance</li>
                  </ul>
                </div>

                <div className="actions">
                  <button className="btn btnPrimary">Purchase Formatting</button>
                  <button className="btn">Ask a question</button>
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <p className="cardTitle">Author Portal Automation</p>
                  <p className="cardPrice">$49</p>
                  <p className="cardRange">Per month</p>
                </div>

                <div className="cardBody">
                  Optional enhanced reporting and payout system.
                  <ul className="bullets">
                    <li>Real time sales tracking</li>
                    <li>Automated royalty payouts</li>
                    <li>Detailed financial dashboard</li>
                  </ul>
                  Manual reporting every six months remains available at no cost.
                </div>

                <div className="actions">
                  <button className="btn btnPrimary">Start Subscription</button>
                  <button className="btn">Ask a question</button>
                </div>
              </div>

            </div>
          </section>

          <section className="section">
            <h2 className="sectionTitle">Consultation Required Services</h2>
            <p className="sectionDesc">These services require a free consultation to confirm scope and ensure correct selection.</p>

            <div className="listCard">

              <div className="row">
                <div>
                  <div className="rowTitle">Developmental Editing</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    For manuscripts requiring structural refinement.
                  </div>
                </div>
                <div className="rowMeta">$0.04 – $0.07 per word</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Line Editing</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    For sentence level clarity and stylistic precision.
                  </div>
                </div>
                <div className="rowMeta">$0.02 – $0.04 per word</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Proofreading</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    Final polish before production.
                  </div>
                </div>
                <div className="rowMeta">$0.01 – $0.02 per word</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Ghostwriting</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    Fully confidential. White label. Contractually protected.
                  </div>
                </div>
                <div className="rowMeta">$0.50 – $1.50 per word<br/>$20,000 – $100,000+</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Audiobook Production</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    Professional narration sourcing, recording coordination, mastering, distribution preparation.
                  </div>
                </div>
                <div className="rowMeta">$3,000 – $10,000</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Marketing Services</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    Campaign based marketing and ongoing support.
                  </div>
                </div>
                <div className="rowMeta">$1,500 – $7,500<br/>$750 – $2,500 per month</div>
              </div>

              <div className="row">
                <div>
                  <div className="rowTitle">Corporate & Institutional Publishing</div>
                  <div className="sectionDesc" style={{ margin: "4px 0 0 0" }}>
                    Thought leadership, policy books, cultural documentation projects.
                  </div>
                </div>
                <div className="rowMeta">Custom pricing</div>
              </div>

            </div>

            <div className="actions" style={{ marginTop: 14 }}>
              <button className="btn btnPrimary">Request Free Consultation</button>
              <button className="btn">Contact Us</button>
            </div>

            <div className="upsell">
              <div className="upsellTitle">We do not upsell</div>
              <p className="upsellText">
                We do not pressure authors into unnecessary services. If your manuscript is ready, we will say so. If you require support, we will recommend only what strengthens the work. We advise. We do not exploit.
              </p>
            </div>
          </section>

        </div>
      </div>

    </main>
  )
}