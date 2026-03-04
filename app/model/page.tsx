"use client"

import { useEffect, useState } from "react"

export default function LearnModelPage() {

  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const h = document.body.scrollHeight - window.innerHeight
      const progress = y / h
      setScale(1 + progress * 0.08)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>

<style>{`

/* ---------------- HERO ---------------- */

.hero {
  position: relative;
  height: 85vh;
  display: flex;
  align-items: center;
  color: white;
  overflow: hidden;
}

.hero img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.9) 0%,
    rgba(80,50,20,0.75) 45%,
    rgba(0,0,0,0.65) 100%
  );
}

.heroContent {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 2;
}

.heroTitle {
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 12px;
}

.heroSub {
  font-size: 20px;
  margin-bottom: 14px;
  opacity: .95;
}

.heroText {
  max-width: 720px;
  font-size: 16px;
  line-height: 1.32;
  opacity: .92;
}

/* ---------------- BODY BACKGROUND ---------------- */

.pageBackground {
  position: relative;
  background: url("/images/background_two.png") center/cover fixed no-repeat;
}

.pageOverlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.82);
}

.sectionContainer {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 70px 20px;
  z-index: 2;
}

/* ---------------- PANELS ---------------- */

.panelGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.panel {
  border-radius: 12px;
  border: 1px solid rgba(212,175,55,.5);
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(6px);
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
  padding: 26px;
}

.panelWide {
  grid-column: 1 / -1;
}

.sectionTitle {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
}

.divider {
  width: 60px;
  height: 2px;
  background: rgba(212,175,55,.85);
  margin-bottom: 12px;
}

.bodyText {
  font-size: 16px;
  line-height: 1.28;
}

.bodyText p {
  margin-bottom: 2px;
}

.bodyText ul {
  margin-left: 18px;
  margin-bottom: 4px;
}

.bodyText li {
  margin-bottom: 2px;
}

/* ---------------- FLOATING AFRICA ---------------- */

.africaFloat {
  position: fixed;
  right: -80px;
  bottom: 10%;
  width: 480px;
  opacity: .09;
  pointer-events: none;
  z-index: 1;
  transition: transform .3s ease;
}

@media(max-width:980px){
  .panelGrid { grid-template-columns: 1fr; }
  .heroTitle { font-size: 32px; }
  .africaFloat { display:none; }
}

`}</style>


{/* HERO */}

<section className="hero">

<img src="/images/sankofa_office.png" alt="Sankofa Office" />

<div className="heroOverlay"/>

<div className="heroContent">

<h1 className="heroTitle">Learn About Our Model</h1>

<div className="heroSub">
Publishing Without Financial Barriers<br/>
Ownership Without Extraction
</div>

<div className="heroText">
Sankofa Publishers operates a standards based hybrid publishing model structured to remove financial barriers while preserving professional publishing discipline, economic clarity, and author sovereignty.
</div>

</div>

</section>


{/* BODY */}

<section className="pageBackground">

<div className="pageOverlay"/>

<div className="sectionContainer">

<div className="panelGrid">

{/* Publishing Without Financial Barriers */}

<div className="panel">

<h2 className="sectionTitle">Publishing Without Financial Barriers</h2>
<div className="divider"/>
<div className="bodyText">
<p>Sankofa Publishers operates on a standards-based hybrid publishing model.</p>
<p>If your manuscript meets our editorial and structural requirements and is publication ready, we publish it at no cost.</p>
<p>No submission fees.</p>
<p>No mandatory service purchases.</p>
<p>No rights acquisition.</p>
<p>No forced royalty splits.</p>
<p>We remove financial barriers while maintaining professional publishing infrastructure.</p>
<p>Publishing should not be limited to those with disposable capital.</p>
</div>

</div>

{/* What Free Actually Means */}

<div className="panel">

<h2 className="sectionTitle">What “Free” Actually Means</h2>
<div className="divider"/>
<div className="bodyText">
<p>Free does not mean casual.</p>
<p>Free does not mean rushed.</p>
<p>Free does not mean lower standards.</p>
<p>It means access without exploitation.</p>
<p>Accepted authors receive:</p>
<ul>
<li>Global paperback distribution</li>
<li>Hardcover production</li>
<li>eBook production and international retail placement</li>
<li>ISBN registration</li>
<li>Metadata optimization</li>
<li>Sales reporting transparency</li>
<li>Dedicated author page</li>
<li>Basic platform marketing exposure</li>
<li>Audiobook pathway access</li>
</ul>
<p>All without upfront publishing fees.</p>
</div>

</div>


{/* Royalties — Full Width (Dense Section) */}

<div className="panel panelWide">

<h2 className="sectionTitle">Royalties, Payment, and Transparency</h2>
<div className="divider"/>
<div className="bodyText">
<p>Authors retain:</p>
<ul>
<li>100 percent copyright ownership</li>
<li>100 percent intellectual property control</li>
<li>100 percent of net royalty earnings</li>
</ul>
<p>Sankofa Publishers does not hold or retain author royalties.</p>
<p>Royalty payments are issued directly to authors through the Sankofa Author Portal.</p>
<p>Each author will:</p>
<ul>
<li>Connect their secure bank account</li>
<li>Receive automated royalty payments</li>
<li>Receive detailed sales reporting</li>
<li>Access transparent breakdown of revenue and deductions</li>
</ul>
<p>Royalty Structure</p>
<p>Royalty is calculated as 100 percent of net revenue.</p>
<p>Net revenue is defined as gross retail sales minus:</p>
<ul>
<li>Retailer fees</li>
<li>Distribution fees</li>
<li>Printing costs</li>
<li>Payment processing costs</li>
</ul>
<p>Authors are not required to pay for books prior to sale.</p>
<p>Books are printed upon order. Once sold, the print cost and associated distribution fees are deducted from the sale price before net royalty is calculated.</p>
<p>Authors are notified of all transactions and have full visibility into reporting.</p>
</div>

</div>


{/* Retail Pricing */}

<div className="panel">

<h2 className="sectionTitle">Retail Pricing</h2>
<div className="divider"/>
<div className="bodyText">
<p>Sankofa works collaboratively with authors to determine retail pricing.</p>
<p>We provide strategic pricing recommendations designed to:</p>
<ul>
<li>Protect author profitability</li>
<li>Maintain market competitiveness</li>
<li>Ensure sustainable margin</li>
</ul>
<p>Final pricing decisions are made with transparency and author involvement.</p>
</div>

</div>


{/* Operational Transparency */}

<div className="panel">

<h2 className="sectionTitle">Operational Transparency</h2>
<div className="divider"/>
<div className="bodyText">
<p>We operate with full reporting clarity.</p>
<p>Our systems are structured to show:</p>
<ul>
<li>Unit sales</li>
<li>Retail price</li>
<li>Fees deducted</li>
<li>Net revenue</li>
<li>Royalty payout</li>
</ul>
<p>Transparency is not optional. It is structural.</p>
</div>

</div>


{/* Revenue Structure */}

<div className="panel">

<h2 className="sectionTitle">Our Revenue Structure</h2>
<div className="divider"/>
<div className="bodyText">
<p>Sankofa generates revenue through:</p>
<ul>
<li>Optional editorial services</li>
<li>Design services</li>
<li>Publishing readiness assessments</li>
<li>Marketing services</li>
<li>Ghostwriting services</li>
<li>Voluntary author contributions</li>
</ul>
<p>Our publishing decisions are never influenced by service purchases.</p>
<p>Editorial acceptance is based solely on manuscript quality and alignment.</p>
</div>

</div>


{/* Editorial Review Process */}

<div className="panel">

<h2 className="sectionTitle">Editorial Review Process</h2>
<div className="divider"/>
<div className="bodyText">
<p>All submissions undergo structured evaluation.</p>
<p>Review window: up to 45 days.</p>
<p>Possible outcomes:</p>
<p>Full Acceptance</p>
<p>The manuscript proceeds directly to agreement and production.</p>
<p>Rejection</p>
<p>The manuscript does not meet our standards or alignment criteria.</p>
<p>Conditional Acceptance</p>
<p>The manuscript shows strong potential but requires specified revisions, clarification, or compliance adjustments before publication proceeds.</p>
<p>We communicate clearly and decisively.</p>
</div>

</div>


{/* Publishing Readiness */}

<div className="panel">

<h2 className="sectionTitle">Publishing Readiness</h2>
<div className="divider"/>
<div className="bodyText">
<p>If you choose not to use our editing services, we may recommend a paid Publishing Readiness Assessment.</p>
<p>This service evaluates:</p>
<ul>
<li>Structural coherence</li>
<li>Formatting compliance</li>
<li>Editorial consistency</li>
<li>Production viability</li>
</ul>
<p>Readiness protects both author and press.</p>
</div>

</div>


{/* Rights and Withdrawal */}

<div className="panel">

<h2 className="sectionTitle">Rights and Withdrawal</h2>
<div className="divider"/>
<div className="bodyText">
<p>Authors retain full ownership of their work at all times.</p>
<p>Should an author wish to discontinue publishing with Sankofa, a 30 day written notice is required to allow proper distribution withdrawal and record management according to industry standards.</p>
<p>We prioritize professional exit procedures that protect the author’s intellectual property.</p>
</div>

</div>


{/* Why This Model Exists */}

<div className="panel panelWide">

<h2 className="sectionTitle">Why This Model Exists</h2>
<div className="divider"/>
<div className="bodyText">
<p>The richest natural continent on Earth remains economically constrained not because of absence of resources, but because of extraction.</p>
<p>Aid without ownership becomes dependency.</p>
<p>We are building ownership.</p>
<p>Publishing infrastructure is part of economic circulation.</p>
<p>Narrative control strengthens policy influence.</p>
<p>Policy influence strengthens economic positioning.</p>
<p>We are not offering charity.</p>
<p>We are offering structure.</p>
</div>

</div>

</div>

</div>

</section>

    </main>

  )

}