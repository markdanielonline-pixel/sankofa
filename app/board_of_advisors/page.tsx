"use client"

export default function AdvisoryBoardPage() {

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

.wrap{
  max-width:1050px;
  margin:0 auto;
  padding:90px 20px 120px 20px;
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
  font-weight:800;
  margin:8px 0;
}

.quote{
  font-size:18px;
  font-weight:700;
  margin-bottom:30px;
}

.bodyText{
  line-height:1.5;
  margin-bottom:14px;
}

.sectionTitle{
  font-size:22px;
  font-weight:800;
  margin-top:40px;
  margin-bottom:12px;
}

ul{
  margin:8px 0 14px 20px;
}

li{
  margin-bottom:6px;
}

.hr{
  height:1px;
  background:var(--line);
  margin:30px 0;
}

/* Image Block */

.imageBlock{
  position:relative;
  width:480px;
  max-width:100%;
  float:left;
  margin:20px 40px 30px 0;
}

.imageBlock img{
  width:100%;
  display:block;
}

/* Fade Overlay */

.imageFade{
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    linear-gradient(to right, var(--wash) 0%, transparent 18%),
    linear-gradient(to left, var(--wash) 0%, transparent 18%),
    linear-gradient(to top, var(--wash) 0%, transparent 18%),
    linear-gradient(to bottom, var(--wash) 0%, transparent 18%);
}

.clear{
  clear:both;
}

@media(max-width:900px){
  .imageBlock{
    float:none;
    margin:20px 0 30px 0;
    width:100%;
  }
}

`}</style>

<div className="page">
<div className="wrap">

<div className="kicker">Governance</div>
<h1 className="h1">ADVISORY BOARD</h1>
<div className="quote">“We build with counsel, not impulse.”</div>

<div className="bodyText">
<strong>Advisory Council of Sankofa Publishers</strong><br/>
Sankofa Publishers is guided by a multidisciplinary Advisory Board composed of leaders across publishing, academia, economics, law, and cultural strategy.
</div>

<div className="bodyText">
The Advisory Board provides strategic insight, ethical oversight, and institutional perspective.
</div>

<div className="bodyText">
Advisors do not manage daily operations but contribute to long term structural direction.
</div>

<div className="imageBlock">
  <img src="/images/board.png" alt="Advisory Board Meeting" />
  <div className="imageFade" />
</div>

<div className="sectionTitle">Purpose of the Advisory Board</div>

<div className="bodyText">The Advisory Board exists to:</div>

<ul>
<li>Strengthen institutional credibility</li>
<li>Provide intellectual guidance</li>
<li>Advise on cultural alignment</li>
<li>Offer strategic counsel on expansion</li>
<li>Support ethical publishing standards</li>
</ul>

<div className="bodyText">
This structure ensures Sankofa grows with discipline and foresight.
</div>

<div className="hr"/>

<div className="sectionTitle">Advisory Members</div>

<div className="bodyText"><strong>(Placeholder Profiles – To Be Confirmed)</strong></div>

<div className="bodyText">
<strong>Dr. Amina Okoye</strong><br/>
Economic Development Strategist | Lagos, Nigeria<br/>
Dr. Okoye specializes in diaspora economic circulation models and emerging market infrastructure. Her advisory role supports Sankofa’s long term positioning within global African economic frameworks.
</div>

<div className="bodyText">
<strong>Professor David Laurent</strong><br/>
Comparative Literature Scholar | Paris, France<br/>
Professor Laurent brings academic expertise in post colonial literary theory and global narrative structures. He advises on scholarly and analytical publishing standards.
</div>

<div className="bodyText">
<strong>Advisory Board Member Position</strong><br/>
Profile To Be Announced Soon
</div>

<div className="bodyText">
<strong>Advisory Board Member Position</strong><br/>
Profile To Be Announced Soon
</div>

<div className="bodyText">
<strong>Advisory Board Member Position</strong><br/>
Profile To Be Announced Soon
</div>

<div className="hr"/>

<div className="sectionTitle">Advisory Structure</div>

<div className="bodyText">Advisory roles are:</div>

<ul>
<li>Non executive</li>
<li>Non governing</li>
<li>Consultative</li>
</ul>

<div className="bodyText">
Advisors may serve renewable terms as defined by internal governance policy.
</div>

<div className="hr"/>

<div className="sectionTitle">Future Expansion</div>

<div className="bodyText">
Sankofa anticipates expanding its Advisory Board as institutional growth continues.
</div>

<div className="bodyText">
Prospective advisors may be invited based on demonstrated expertise and alignment with Sankofa’s mission
</div>

<div className="clear" />

</div>
</div>

</main>
  )
}