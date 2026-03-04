"use client"

import { useEffect, useState } from "react"

export default function SupportPage() {

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.15)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>

<style>{`

:root{
  --ink:#0c0f14;
  --muted:#5f6b7a;
  --line:rgba(12,15,20,.10);
  --wash:#f6f3ee;
  --panel:#ffffff;
  --shadow:0 18px 40px rgba(12,15,20,.08);
  --gold:rgba(212,175,55,.85);
}

.page{
  background:var(--wash);
  min-height:100vh;
  color:var(--ink);
}

.heroImage{
  position:relative;
  width:100%;
  height:380px;
  overflow:hidden;
}

.heroImage img{
  width:100%;
  height:140%;
  object-fit:cover;
  transition:transform .2s ease-out;
  opacity:.92;
}

.overlayFade{
  position:absolute;
  inset:0;
  background:linear-gradient(to bottom, rgba(246,243,238,0) 50%, rgba(246,243,238,1) 95%);
}

.wrap{
  max-width:980px;
  margin:0 auto;
  padding:70px 20px 110px 20px;
}

.kicker{
  font-size:12px;
  letter-spacing:.08em;
  text-transform:uppercase;
  font-weight:700;
  color:var(--muted);
}

.h1{
  font-size:44px;
  font-weight:900;
  margin:10px 0;
}

.quote{
  font-size:18px;
  font-weight:700;
  margin-bottom:28px;
}

.section{
  margin-bottom:36px;
}

.sectionTitle{
  font-size:22px;
  font-weight:900;
  margin-bottom:12px;
}

.bodyText{
  line-height:1.5;
  margin-bottom:10px;
}

ul{
  margin:8px 0 14px 20px;
}

li{
  margin-bottom:6px;
}

.ctaBox{
  margin-top:30px;
  padding:28px;
  background:#ffffff;
  border:1px solid var(--line);
  border-radius:18px;
  box-shadow:var(--shadow);
}

.btnRow{
  display:flex;
  gap:14px;
  flex-wrap:wrap;
  margin-top:18px;
}

.btn{
  padding:14px 22px;
  border-radius:12px;
  font-weight:800;
  border:1px solid rgba(212,175,55,.6);
  background:rgba(212,175,55,.18);
  cursor:pointer;
}

.btnSecondary{
  border:1px solid var(--line);
  background:#fff;
}

@media(max-width:768px){
  .h1{ font-size:34px; }
  .heroImage{ height:280px; }
}

`}</style>

<div className="page">

<div className="heroImage">
  <img
    src="/images/hieroglyphics.png"
    style={{ transform: `translateY(${offset}px)` }}
    alt="Hieroglyphics"
  />
  <div className="overlayFade" />
</div>

<div className="wrap">

<div className="kicker">Contribution</div>
<h1 className="h1">CONTRIBUTION</h1>
<div className="quote">“We are not fragments. We are foundation.”</div>

<div className="section">
<div className="sectionTitle">Support the Infrastructure</div>
<div className="bodyText">
Sankofa Publishers exists to remove financial barriers while maintaining professional publishing standards.
</div>
<div className="bodyText">
Publishing infrastructure costs money.
Editorial systems. Distribution coordination. Platform development. Compliance. Reporting. Production management.
</div>
<div className="bodyText">
We chose to eliminate mandatory publishing fees.
That decision requires collective strength.
</div>
</div>

<div className="section">
<div className="sectionTitle">Why Contributions Matter</div>
<div className="bodyText">
The richest natural continent on Earth remains economically constrained not because of absence, but because of extraction.
</div>
<div className="bodyText">
Circulation builds stability.
</div>
<div className="bodyText">
When authors voluntarily contribute a portion of their royalty or supporters give directly, they strengthen:
</div>
<ul>
<li>Access for emerging writers</li>
<li>Institutional independence</li>
<li>Sustainable publishing infrastructure</li>
<li>Long term cultural record building</li>
</ul>
<div className="bodyText">
This is not charity.
</div>
<div className="bodyText">
This is investment in narrative sovereignty.
</div>
</div>

<div className="section">
<div className="sectionTitle">How You Can Contribute</div>
<ul>
<li>Make a one time contribution</li>
<li>Set up monthly support</li>
<li>Allocate a voluntary portion of your royalties</li>
</ul>
<div className="bodyText">
All contributions are voluntary.
</div>
<div className="bodyText">
Authors who choose not to contribute receive the same editorial respect and publishing commitment.
</div>
<div className="bodyText">
Strength is encouraged.
It is never coerced.
</div>
</div>

<div className="section">
<div className="sectionTitle">What Your Contribution Supports</div>
<ul>
<li>Platform infrastructure</li>
<li>Operational sustainability</li>
<li>Access for authors without capital</li>
<li>Ongoing cultural publishing development</li>
</ul>
<div className="bodyText">
Ownership grows where circulation exists.
</div>
</div>

<div className="section">
<div className="sectionTitle">Our Commitment</div>
<div className="bodyText">
We operate with transparency.
</div>
<div className="bodyText">
We publish with discipline.
</div>
<div className="bodyText">
We do not exploit authors.
</div>
<div className="bodyText">
We build infrastructure that endures.
</div>
</div>

<div className="ctaBox">
<div className="sectionTitle">Give With Intention</div>
<div className="bodyText">
If Sankofa has strengthened your work, protected your voice, or aligned with your values, we invite you to participate in sustaining it.
</div>
<div className="bodyText">
Legacy requires structure.
</div>

<div className="btnRow">
<button className="btn">Contribute Once</button>
<button className="btn btnSecondary">Become a Monthly Supporter</button>
</div>
</div>

</div>
</div>

</main>
  )
}