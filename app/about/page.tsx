"use client"

import { useEffect, useState } from "react"

export default function AboutPage() {

  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const h = document.body.scrollHeight - window.innerHeight
      const progress = y / h
      setScale(1 + progress * 0.06)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>

<style>{`

@keyframes maskFloat {
  0% { transform: translateY(0px) rotate(-0.6deg); }
  50% { transform: translateY(-8px) rotate(0.6deg); }
  100% { transform: translateY(0px) rotate(-0.6deg); }
}

.mask {
  position: fixed;
  right: -10px;
  top: 40px;
  height: 100vh;
  z-index: 3;
  pointer-events: none;
  animation: maskFloat 10s ease-in-out infinite;
  filter: drop-shadow(0 30px 80px rgba(0,0,0,.55));
}

.darkSection {
  position: relative;
  background: url("/images/background_two.png") center/cover fixed no-repeat;
}

.darkOverlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.82);
}

.lightSection {
  background: #f6f3ee;
  color: #111;
}

.sectionContainer {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 70px 20px;
  z-index: 2;
}

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
  color: white;
}

.panelLight {
  background: #f6f3ee;
  color: #111;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 30px rgba(0,0,0,.15);
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

@media(max-width:980px){
  .panelGrid { grid-template-columns: 1fr; }
  .mask { display:none; }
}

`}</style>

<img
  src="/images/about_mask.png"
  className="mask"
  style={{ transform: `scale(${scale})` }}
/>

{/* DARK SECTION TOP */}

<section className="darkSection">
<div className="darkOverlay"/>

<div className="sectionContainer">
<div className="panelGrid">

<div className="panel panelWide">
<h2 className="sectionTitle">Who We Are</h2>
<div className="divider"/>
<div className="bodyText">
<p>Sankofa Publishers is a New Mexico based hybrid publishing house built on professional discipline and cultural responsibility.</p>
<p>Though the imprint itself is newly established, our team brings more than 47 years of combined experience across editorial development, manuscript evaluation, design, production management, print systems, and distribution strategy.</p>
<p>We understand publishing as infrastructure.</p>
<p>We understand narrative as power.</p>
<p>We understand ownership as non negotiable.</p>
<p>We are building a press designed to endure.</p>
</div>
</div>

<div className="panel">
<h2 className="sectionTitle">Why Sankofa</h2>
<div className="divider"/>
<div className="bodyText">
<p>Sankofa speaks to retrieval. To go back and bring forward what carries value.</p>
<p>For generations, African and diasporic narratives have been filtered, diluted, reshaped, or dismissed to accommodate external expectations.</p>
<p>Colonization did not begin with chains. It began with distortion.</p>
<p>Africa was not discovered. It was mapped, traded with, and intellectually active while parts of Europe were still tribal.</p>
<p>The diaspora is not scattered weakness. It is dispersed continuity.</p>
<p>Sankofa exists to provide disciplined publishing infrastructure for work that understands this reality and approaches it with seriousness.</p>
<p>We are not reactionary.</p>
<p>We are reconstructive.</p>
</div>
</div>

<div className="panel">
<h2 className="sectionTitle">Ownership and Narrative Sovereignty</h2>
<div className="divider"/>
<div className="bodyText">
<p>The richest natural continent on Earth remains economically constrained not because of lack of resources, but because of extraction systems.</p>
<p>Aid without ownership becomes dependency.</p>
<p>Development without control becomes rebranded colonization.</p>
<p>Publishing intersects with this reality.</p>
<p>Control of narrative influences perception.</p>
<p>Perception influences policy.</p>
<p>Policy influences economic positioning.</p>
<p>Authors published by Sankofa retain:</p>
<ul>
<li>100 percent copyright</li>
<li>100 percent royalty earnings</li>
<li>Full intellectual property ownership</li>
</ul>
<p>We do not hold ownership of your book.</p>
<p>Narrative sovereignty matters.</p>
</div>
</div>

</div>
</div>
</section>

{/* WHITE FOUNDER STRIP */}

<section className="lightSection">
<div className="sectionContainer">

<div className="panel panelLight panelWide">

<h2 className="sectionTitle">Founder Statement</h2>
<div className="divider"/>

<div className="bodyText">
<p>For most of my life, I have lived inside rooms where I was expected to shrink.</p>
<p>I have experienced exclusion that was never formally announced but clearly enforced. I have been overlooked in spaces where my competence was visible. I have felt the quiet pressure to soften my voice, to dilute my identity, to make others comfortable by minimizing myself.</p>
<p>Many in our diaspora know that feeling.</p>
<p>The meeting where you are qualified but not affirmed.</p>
<p>The platform where you are present but not centered.</p>
<p>The moment you are praised for being “articulate” as if intelligence was unexpected.</p>
<p>The subtle suggestion that loving your own people too openly means you must dislike someone else.</p>
<p>For years, I internalized that tension.</p>
<p>I hesitated to speak boldly about my African identity. I thought pride required apology. I thought affirmation of my people required explanation.</p>
<p>It does not.</p>
<p>There comes a point where you realize the discomfort was never about your love. It was about your awakening.</p>
<p>Other communities invest in their own without hesitation. They circulate resources. They preserve narrative. They build institutions. They protect their voice.</p>
<p>Somewhere along the way, many of us were taught that doing the same for ourselves required permission.</p>
<p>It does not.</p>
<p>When I stopped seeking validation from systems that never intended to validate me fully, something shifted. The approval I chased was never external. It was internal alignment. It was clarity. It was dignity.</p>
<p>Sankofa was born from that clarity.</p>
<p>This is not hatred for others. It is not hostility. It is not exclusion.</p>
<p>It is love without apology.</p>
<p>It is the belief that our stories deserve infrastructure.</p>
<p>That our intellectual work deserves discipline.</p>
<p>That our economic circulation deserves structure.</p>
<p>That our people deserve institutions that do not hesitate to say we matter.</p>
<p>Unity across humanity is a worthy goal. But unity without self knowledge is fragile.</p>
<p>We cannot become one while we remain divided within ourselves.</p>
<p>Strength begins with memory.</p>
<p>Memory builds confidence.</p>
<p>Confidence builds unity.</p>
<p>Unity builds power.</p>
<p>Sankofa exists so that those who carry insight, critique, research, imagination, and truth can document it without shrinking.</p>
<p>If you have ever felt the pressure to minimize your voice, this press exists so you do not have to.</p>
</div>

</div>

</div>
</section>

    </main>
  )
}