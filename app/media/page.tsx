"use client"

export default function MediaPage() {
  return (
    <main>

<style>{`
:root{
  --ink:#0c0f14;
  --muted:#5f6b7a;
  --line:rgba(12,15,20,.10);
  --wash:#f6f3ee;
  --panel:#ffffff;
  --shadow:0 16px 34px rgba(12,15,20,.08);
  --gold:rgba(212,175,55,.85);
}

.page{
  background:var(--wash);
  min-height:100vh;
  color:var(--ink);
}

.wrapWide{
  max-width:1240px;
  margin:0 auto;
  padding:70px 20px 110px 20px;
}

.heroMedia{
  padding:70px 30px 0px 5px;
  background:var(--wash);
}

.heroFrame{
  max-width:1240px;
  margin:0 auto;
  border-radius:22px;
  overflow:hidden;
  border:
  background:
  box-shadow:var(--shadow);
}

@keyframes heroFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.heroFrame img{
  width:70%;
  height:auto;
  animation: heroFloat 14s ease-in-out infinite;
}

.kicker{
  font-size:12px;
  letter-spacing:.08em;
  text-transform:uppercase;
  font-weight:800;
  color:var(--muted);
}

.h1{
  font-size:46px;
  font-weight:900;
  margin:10px 0 8px 0;
}

.quote{
  font-size:18px;
  font-weight:800;
  margin:0 0 12px 0;
}

.subhead{
  font-size:16.5px;
  line-height:1.5;
  color:rgba(12,15,20,.82);
  max-width:980px;
}

.rule{
  width:72px;
  height:2px;
  background:var(--gold);
  margin:16px 0 18px 0;
}

.grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:22px;
  margin-top:26px;
}

@media(max-width: 980px){
  .grid2{ grid-template-columns:1fr; }
  .h1{ font-size:36px; }
}

.block{
  background:rgba(255,255,255,.72);
  border:1px solid rgba(12,15,20,.09);
  border-radius:18px;
  padding:22px;
  box-shadow: 0 10px 22px rgba(12,15,20,.06);
}

.blockTitle{
  font-size:22px;
  font-weight:900;
  margin:0 0 8px 0;
}

.blockRule{
  width:54px;
  height:2px;
  background:var(--gold);
  margin:10px 0 14px 0;
}

.p{
  margin:0 0 8px 0;
  line-height:1.5;
  color:rgba(12,15,20,.84);
}

ul{
  margin:8px 0 0 18px;
}

li{
  margin-bottom:6px;
  color:rgba(12,15,20,.84);
}

.email{
  font-weight:900;
}

.emph{
  background:
  border:1px solid rgba(12,15,20,.10);
  border-radius:18px;
  padding:24px;
  box-shadow:var(--shadow);
}

`}</style>

<div className="page">

  <section className="heroMedia">
    <div className="heroFrame">
      <img src="/images/media.png" alt="Media and press" />
    </div>
  </section>

  <section className="wrapWide">

    <div className="kicker">Media & Press</div>
    <h1 className="h1">MEDIA & PRESS</h1>
    <div className="quote">“We are not emerging. We are returning.”</div>
    <div className="subhead">
      Institutional Publishing. Cultural Infrastructure.<br/>
      Sankofa Publishers is a New Mexico based hybrid publishing house dedicated to intellectual rigor, cultural integrity, and narrative sovereignty.<br/>
      We publish work that contributes to disciplined discourse across the African world and global diaspora.<br/>
      For press inquiries, interview requests, or institutional collaborations, please contact:<br/>
      <span className="email">press@sankofapublishers.com</span><br/>
      or<br/>
      <span className="email">compliance@sankofapublishers.com</span>
    </div>

    <div className="rule" />

    <div className="grid2">

      <div className="block">
        <div className="blockTitle">About Sankofa Publishers</div>
        <div className="blockRule" />
        <p className="p">Sankofa Publishers operates on a standards-based hybrid publishing model that removes financial barriers while preserving editorial discipline.</p>
        <p className="p">We publish across genres, including:</p>
        <ul>
          <li>Literary fiction</li>
          <li>Memoir</li>
          <li>Investigative work</li>
          <li>Cultural analysis</li>
          <li>Economic thought</li>
          <li>Structured social critique</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>Our model ensures:</p>
        <ul>
          <li>100 percent copyright retention for authors</li>
          <li>100 percent net royalty earnings</li>
          <li>Transparent reporting systems</li>
          <li>Professional distribution infrastructure</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>Sankofa does not acquire author ownership.</p>
        <p className="p">We build record. We do not exploit it.</p>
      </div>

      <div className="block">
        <div className="blockTitle">Leadership</div>
        <div className="blockRule" />
        <p className="p">Sankofa was founded by Mark Daniel, a Caribbean born citizen of Trinidad and Tobago and former Pastor of 33 years who transitioned from ministry into cultural infrastructure building. He has earned several degrees including n MBA from Don Bosco University, India and a Ph.D from New Life Seminary, USA.</p>
        <p className="p">The founder’s journey includes lived experience with:</p>
        <ul>
          <li>Institutional exclusion</li>
          <li>Cultural minimization</li>
          <li>Systemic dismissal</li>
          <li>Identity suppression</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>Sankofa emerged from the conviction that disciplined love of African identity is not hostility toward others, but alignment with self.</p>
        <p className="p">Full biography available upon request.</p>
      </div>

    </div>
    <div className="grid2">

      <div className="block">
        <div className="blockTitle">Press Resources</div>
        <div className="blockRule" />
        <p className="p">Members of the press may request:</p>
        <ul>
          <li>Company overview</li>
          <li>Founder biography</li>
          <li>High resolution logos</li>
          <li>Author interviews</li>
          <li>Book review copies</li>
          <li>Media kits</li>
          <li>Speaking engagement coordination</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>
          Please allow reasonable response time for interview scheduling.
        </p>
      </div>

      <div className="block">
        <div className="blockTitle">Areas of Commentary</div>
        <div className="blockRule" />
        <p className="p">Sankofa leadership is available for commentary on:</p>
        <ul>
          <li>Hybrid publishing models</li>
          <li>Narrative sovereignty</li>
          <li>Diaspora economic circulation</li>
          <li>Intellectual property ownership</li>
          <li>Publishing ethics</li>
          <li>Cultural infrastructure development</li>
          <li>AI disclosure in publishing</li>
        </ul>
      </div>

    </div>

    <div className="grid2">

      <div className="block">
        <div className="blockTitle">Review Copies</div>
        <div className="blockRule" />
        <p className="p">
          Review copies may be provided at the discretion of Sankofa for legitimate media outlets, reviewers, academic institutions, and bookstores.
        </p>
        <p className="p">Requests should include:</p>
        <ul>
          <li>Outlet name</li>
          <li>Circulation or reach</li>
          <li>Review timeline</li>
          <li>Contact information</li>
        </ul>
      </div>

      <div className="block">
        <div className="blockTitle">Media Guidelines</div>
        <div className="blockRule" />
        <p className="p">Sankofa welcomes fair and responsible reporting.</p>
        <p className="p">We request that:</p>
        <ul>
          <li>Quotes be accurately represented</li>
          <li>Context not be materially altered</li>
          <li>Attribution be clearly stated</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>
          Unauthorized reproduction of proprietary materials is prohibited.
        </p>
      </div>

    </div>

    <div className="block" style={{ marginTop: 28 }}>
      <div className="blockTitle">Speaking Engagements</div>
      <div className="blockRule" />
      <p className="p">Sankofa leadership is available for:</p>
      <ul>
        <li>Panels</li>
        <li>Academic forums</li>
        <li>Cultural events</li>
        <li>Industry conferences</li>
        <li>Institutional roundtables</li>
      </ul>
      <p className="p" style={{ marginTop: 12 }}>
        Speaking inquiries may be directed to <span className="email">press@sankofapublishers.com</span>
      </p>
    </div>

    <div className="emph" style={{ marginTop: 30 }}>
      <div className="blockTitle">Institutional Statement</div>
      <div className="blockRule" />
      <p className="p">Colonization did not begin with chains. It began with distortion.</p>
      <p className="p">
        The richest natural continent on Earth remains economically constrained because extraction systems were normalized.
      </p>
      <p className="p">
        Publishing is not separate from economic structure.
      </p>
      <p className="p">Narrative control shapes perception.</p>
      <p className="p">Perception shapes policy.</p>
      <p className="p">Policy shapes economic outcomes.</p>
      <p className="p">
        Sankofa Publishers operates at the intersection of culture and infrastructure.
      </p>
    </div>

  </section>
</div>

</main>
  )
}