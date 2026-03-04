"use client"

export default function GovernancePage() {
  return (
    <main>
      <style>{`
:root{
  --ink:#0c0f14;
  --muted:#5f6b7a;
  --line:rgba(12,15,20,.10);
  --wash:#f6f3ee;
  --dark:#0b0d10;
  --gold:rgba(212,175,55,.85);
}

.page{
  background:var(--wash);
  min-height:100vh;
  color:var(--ink);
  position:relative;
  overflow:hidden;
}

/* content stack */
.wrap{
  max-width:1000px;
  margin:0 auto;
  padding:100px 20px 340px 20px; /* big buffer so text never hits footer zone */
  position:relative;
  z-index:3;
}

.h1{
  font-size:44px;
  font-weight:800;
  margin-bottom:30px;
}

.sectionTitle{
  font-size:22px;
  font-weight:800;
  margin-top:50px;
  margin-bottom:12px;
}

.bodyText{
  line-height:1.5;
  margin-bottom:14px;
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

/* TOP IMAGE */
.topImageWrap{
  display:flex;
  justify-content:center;
  margin-bottom:50px;
}

.topImage{
  width:620px;
  max-width:88%;
  animation:subtleFloat 8s ease-in-out infinite;
  transform-origin:center;
}

/* FOOTER BAR */
.footerBar{
  position:absolute;
  left:0;
  bottom:0;
  width:100%;
  height:170px;
  background:var(--dark);
  z-index:0;
}

/* BOTTOM IMAGE */
.bottomImageWrap{
  position:absolute;
  left:0;
  bottom:-90px; /* pushed further down into footer */
  width:100%;
  pointer-events:none;
  z-index:2;
}

.bottomImage{
  width:720px; /* requested larger */
  max-width:92%;
  margin-left:40px;
  animation:subtleDrift 10s ease-in-out infinite;
}

/* soft fade so it melts into page above, no hard edge */
.bottomFade{
  position:absolute;
  left:0;
  top:-70px;
  width:100%;
  height:140px;
  pointer-events:none;
  z-index:1;
  background:linear-gradient(to bottom, var(--wash) 0%, rgba(246,243,238,0) 100%);
}

/* ANIMATIONS: premium micro motion */
@keyframes subtleFloat{
  0%{ transform:translateY(0px) rotate(0deg); }
  50%{ transform:translateY(-6px) rotate(.35deg); }
  100%{ transform:translateY(0px) rotate(0deg); }
}

@keyframes subtleDrift{
  0%{ transform:translateY(0px) rotate(0deg); }
  50%{ transform:translateY(-8px) rotate(-.4deg); }
  100%{ transform:translateY(0px) rotate(0deg); }
}

@media(max-width:900px){
  .topImage{
    width:420px;
    max-width:92%;
  }
  .bottomImage{
    width:560px;
    max-width:94%;
    margin-left:16px;
  }
  .wrap{
    padding:90px 18px 330px 18px;
  }
}

`}</style>

      <div className="page">
        <div className="wrap">
          <div className="topImageWrap">
            <img
              src="/images/writing_hands.png"
              className="topImage"
              alt="Writing Hands"
            />
          </div>

          <h1 className="h1">Governance Framework</h1>

          <div className="sectionTitle">Institutional Design</div>

          <div className="bodyText">
            Sankofa operates with defined roles, documented standards, and consistent decision pathways.
          </div>

          <div className="bodyText">
            Our governance structure is designed to protect:
          </div>

          <ul>
            <li>Authors</li>
            <li>Readers</li>
            <li>Cultural integrity</li>
            <li>Editorial independence</li>
            <li>Operational transparency</li>
          </ul>

          <div className="bodyText">
            Sankofa is founder led and institutionally advised.
          </div>

          <div className="sectionTitle">Leadership</div>

          <div className="bodyText">
            Sankofa is led by Founder and Managing Director, Mark Daniel.
          </div>

          <div className="bodyText">
            Leadership is responsible for:
          </div>

          <ul>
            <li>Strategic direction</li>
            <li>Brand integrity</li>
            <li>Publishing standards</li>
            <li>Institutional growth</li>
            <li>Final operational accountability</li>
          </ul>

          <div className="sectionTitle">Advisory Board</div>

          <div className="bodyText">
            Sankofa maintains an Advisory Board composed of multidisciplinary professionals.
          </div>

          <div className="bodyText">
            The Advisory Board exists to strengthen:
          </div>

          <ul>
            <li>Institutional credibility</li>
            <li>Cultural responsibility</li>
            <li>Intellectual rigor</li>
            <li>Ethical oversight</li>
            <li>Strategic expansion</li>
          </ul>

          <div className="bodyText">
            Advisors serve in consultative capacity.
          </div>

          <div className="bodyText">
            They do not:
          </div>

          <ul>
            <li>Manage daily operations</li>
            <li>Control editorial decisions</li>
            <li>Hold governing authority</li>
            <li>Represent Sankofa without written authorization</li>
          </ul>

          <div className="sectionTitle">Decision Integrity</div>

          <div className="bodyText">
            Sankofa maintains separation between:
          </div>

          <div className="bodyText">Editorial decisions</div>
          <div className="bodyText">and</div>
          <div className="bodyText">Revenue activities</div>

          <div className="bodyText">
            Paid services do not influence acceptance decisions.
          </div>

          <div className="bodyText">
            We do not sell publication.
          </div>

          <div className="bodyText">
            We publish based on standard.
          </div>

          <div className="sectionTitle">Editorial Ethics</div>

          <div className="bodyText">
            standards-based Acceptance
          </div>

          <div className="bodyText">
            Manuscripts are evaluated on:
          </div>

          <ul>
            <li>Quality of writing</li>
            <li>Coherence and structure</li>
            <li>Integrity of argument or story</li>
            <li>Cultural responsibility</li>
            <li>Readiness for production</li>
            <li>Alignment with ethical standards</li>
          </ul>

          <div className="bodyText">
            We do not publish unfinished work as finished product.
          </div>

          <div className="sectionTitle">Intellectual Rigor</div>

          <div className="bodyText">
            We welcome strong ideas and controversial arguments where:
          </div>

          <ul>
            <li>Claims are responsibly made</li>
            <li>Logic is coherent</li>
            <li>Evidence is credible</li>
            <li>Intent is constructive or analytically serious</li>
          </ul>

          <div className="bodyText">
            We do not publish content designed only to inflame.
          </div>

          <div className="sectionTitle">Cultural Integrity</div>

          <div className="bodyText">
            Sankofa exists to support work contributing value to African communities and diasporic discourse.
          </div>

          <div className="bodyText">
            Cultural grounding is not exclusion.
          </div>

          <div className="bodyText">
            It is responsibility.
          </div>

          <div className="sectionTitle">Content Integrity and Compliance</div>

          <div className="sectionTitle">Originality and Plagiarism</div>

          <div className="bodyText">
            We require authors to submit original work or properly licensed material.
          </div>

          <div className="bodyText">
            Manuscripts may be screened for plagiarism.
          </div>

          <div className="bodyText">
            If plagiarism is identified, the submission may be rejected or publication terminated.
          </div>

          <div className="sectionTitle">AI Disclosure</div>

          <div className="bodyText">
            AI assisted content is permitted only if fully disclosed.
          </div>

          <div className="bodyText">
            Failure to disclose AI usage may result in:
          </div>

          <ul>
            <li>Rejection</li>
            <li>Conditional acceptance with compliance requirements</li>
            <li>Termination after publication if discovered later</li>
          </ul>

          <div className="bodyText">
            Transparency protects authors and institution.
          </div>

          <div className="sectionTitle">Defamation and Legal Risk</div>

          <div className="bodyText">
            We do not publish defamatory or slanderous material.
          </div>

          <div className="bodyText">
            Where works include real persons, events, or allegations, Sankofa may require:
          </div>

          <ul>
            <li>Clarifying language</li>
            <li>Documentation</li>
            <li>Legal review at author expense</li>
            <li>Risk reduction edits</li>
          </ul>

          <div className="bodyText">
            Sankofa reserves the right to decline high risk works.
          </div>

          <div className="sectionTitle">Author Ethics and Professional Conduct</div>

          <div className="bodyText">
            We expect professional engagement.
          </div>

          <div className="bodyText">
            Authors are expected to:
          </div>

          <ul>
            <li>Communicate respectfully</li>
            <li>Meet agreed deadlines</li>
            <li>Respond to editorial requests</li>
            <li>Disclose relevant content risks</li>
            <li>Uphold contractual standards</li>
          </ul>

          <div className="bodyText">
            We do not tolerate harassment, threats, or abusive conduct.
          </div>

          <div className="sectionTitle">Royalty and Financial Ethics</div>

          <div className="bodyText">
            Sankofa is structured for transparency.
          </div>

          <div className="bodyText">
            Authors retain:
          </div>

          <ul>
            <li>100 percent copyright</li>
            <li>100 percent intellectual property</li>
            <li>100 percent net royalty earnings</li>
          </ul>

          <div className="bodyText">
            We do not withhold royalties as leverage.
          </div>

          <div className="bodyText">
            We operate with clear reporting practices and defined payment cycles.
          </div>

          <div className="sectionTitle">Conflict of Interest</div>

          <div className="bodyText">
            Sankofa avoids conflicts of interest in:
          </div>

          <ul>
            <li>Manuscript evaluation</li>
            <li>Service recommendations</li>
            <li>Vendor selection</li>
            <li>Partnership decisions</li>
          </ul>

          <div className="bodyText">
            Where a conflict exists, Sankofa will:
          </div>

          <ul>
            <li>Disclose the conflict where appropriate</li>
            <li>Recuse decision makers where feasible</li>
            <li>Prioritize institutional integrity</li>
          </ul>

          <div className="sectionTitle">Privacy and Confidentiality</div>

          <div className="bodyText">
            Submitted manuscripts are treated as confidential.
          </div>

          <div className="bodyText">
            Ghostwriting engagements are protected by written confidentiality terms.
          </div>

          <div className="bodyText">
            Sensitive author data is handled using secure operational practices and verified third party processors.
          </div>

          <div className="sectionTitle">Enforcement and Remedies</div>

          <div className="bodyText">
            Sankofa reserves the right to:
          </div>

          <ul>
            <li>Reject submissions</li>
            <li>Suspend distribution</li>
            <li>Terminate agreements</li>
            <li>Decline service engagements</li>
          </ul>

          <div className="bodyText">
            when standards, compliance, or ethical requirements are breached.
          </div>

          <div className="bodyText">
            These protections exist to safeguard:
          </div>

          <ul>
            <li>Authors</li>
            <li>Readers</li>
            <li>Institutional credibility</li>
          </ul>

          <div className="sectionTitle">Closing Standard</div>

          <div className="bodyText">
            We publish with discipline because our history deserves seriousness.
          </div>

          <div className="bodyText">
            We do not rush record.
          </div>

          <div className="bodyText">
            We do not dilute legacy.
          </div>

          <div className="bodyText">
            We build infrastructure that outlives trend.
          </div>
        </div>

        <div className="footerBar" />

        <div className="bottomFade" />

        <div className="bottomImageWrap">
          <img
            src="/images/antique_writing.png"
            className="bottomImage"
            alt="Antique Writing"
          />
        </div>
      </div>

    </main>
  )
}