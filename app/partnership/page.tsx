"use client"

export default function PartnershipsPage() {
  return (
    <main>

<style>{`

:root{
  --ink:#0c0f14;
  --muted:#5f6b7a;
  --line:rgba(12,15,20,.08);
  --wash:#f6f3ee;
  --panel:#ffffff;
  --shadow:0 18px 40px rgba(12,15,20,.08);
  --gold:#d4af37;
}

.page{
  background:var(--wash);
  color:var(--ink);
  min-height:100vh;
}

.wrap{
  max-width:1200px;
  margin:0 auto;
  padding:120px 24px 100px 24px;
}

/* HEADER */

.kicker{
  font-size:12px;
  letter-spacing:.1em;
  text-transform:uppercase;
  font-weight:700;
  color:var(--muted);
}

.h1{
  font-size:58px;
  font-weight:800;
  margin:8px 0 12px 0;
}

.quote{
  font-size:20px;
  font-weight:600;
  margin-bottom:50px;
}

/* IMAGE + SIDE CARD */

.topSection{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:70px;
  align-items:center;
  margin-bottom:60px;
}

.heroImage{
  width:100%;
  max-width:520px;
  display:block;
}

.card{
  background:var(--panel);
  border-radius:18px;
  padding:40px;
  box-shadow:var(--shadow);
}

.cardTitle{
  font-size:22px;
  font-weight:800;
  margin-bottom:14px;
  position:relative;
}

.cardTitle::after{
  content:"";
  display:block;
  width:60px;
  height:2px;
  background:var(--gold);
  margin-top:10px;
}

.bodyText{
  font-size:17px;
  line-height:1.7;
  margin-bottom:18px;
}

/* MAIN CONTENT CARD */

.fullCard{
  background:var(--panel);
  border-radius:18px;
  padding:60px;
  box-shadow:var(--shadow);
}

.section{
  margin-bottom:50px;
}

.sectionTitle{
  font-size:24px;
  font-weight:800;
  margin-bottom:14px;
  position:relative;
}

.sectionTitle::after{
  content:"";
  display:block;
  width:50px;
  height:2px;
  background:var(--gold);
  margin-top:8px;
}

ul{
  margin:10px 0 16px 22px;
}

li{
  margin-bottom:8px;
}

.email{
  font-weight:800;
}

@media(max-width:1000px){
  .topSection{
    grid-template-columns:1fr;
  }
  .heroImage{
    max-width:480px;
  }
  .fullCard{
    padding:40px;
  }
}

`}</style>

<div className="page">
<div className="wrap">

<div className="kicker">Institutional Alignment</div>
<h1 className="h1">PARTNERSHIPS</h1>
<div className="quote">“We are architects of continuity.”</div>

<div className="topSection">

  <div>
    <img
      src="/images/flags.png"
      alt="Sankofa Partnerships"
      className="heroImage"
    />
  </div>

  <div className="card">
    <div className="cardTitle">
      Building Institutional Strength Through Collaboration
    </div>

    <div className="bodyText">
      Sankofa Publishers operates as an emerging institution committed to intellectual rigor and cultural infrastructure.
    </div>

    <div className="bodyText">
      Sustainable publishing requires collaboration.
    </div>

    <div className="bodyText">
      We pursue strategic partnerships across publishing, academia, culture, commerce, and diaspora networks.
    </div>
  </div>

</div>

<div className="fullCard">

  <div className="section">
    <div className="sectionTitle">Strategic Publishing Alliances</div>

    <div className="bodyText">We collaborate with:</div>

    <ul>
      <li>Distribution networks</li>
      <li>Print manufacturing providers</li>
      <li>Audiobook production partners</li>
      <li>Retail systems</li>
      <li>Technology infrastructure providers</li>
    </ul>

    <div className="bodyText">
      While specific commercial partners are not publicly disclosed, our infrastructure is built on established global publishing systems.
    </div>
  </div>

  <div className="section">
    <div className="sectionTitle">Institutional & Academic Collaborations</div>

    <div className="bodyText">Sankofa welcomes collaboration with:</div>

    <ul>
      <li>Universities</li>
      <li>Research institutions</li>
      <li>Cultural studies departments</li>
      <li>Academic conferences</li>
      <li>Policy research groups</li>
    </ul>

    <div className="bodyText">We support:</div>

    <ul>
      <li>Scholarly publishing</li>
      <li>Cultural documentation</li>
      <li>Research based books</li>
      <li>Diaspora economic studies</li>
      <li>Intellectual forums</li>
    </ul>

    <div className="bodyText">
      Institutional inquiries may be directed to:
    </div>

    <div className="email">
      partnerships@sankofapublishers.com
    </div>
  </div>

  <div className="section">
    <div className="sectionTitle">Cultural & Diaspora Organizations</div>

    <div className="bodyText">
      We seek alignment with organizations focused on:
    </div>

    <ul>
      <li>African heritage preservation</li>
      <li>Diaspora economic circulation</li>
      <li>Cultural education</li>
      <li>Literacy advancement</li>
      <li>Intellectual sovereignty</li>
    </ul>

    <div className="bodyText">
      Partnership models may include:
    </div>

    <ul>
      <li>Co-branded publications</li>
      <li>Event collaboration</li>
      <li>Author panels</li>
      <li>Community distribution initiatives</li>
    </ul>
  </div>

</div>

</div>
</div>

</main>
  )
}