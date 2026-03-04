"use client"

import { useState } from "react"

export default function QuestionsPage() {

  const [active, setActive] = useState<number | null>(0)

  const toggle = (index:number) => {
    setActive(active === index ? null : index)
  }

  const faqs = [
    {
      q:"Is Sankofa a vanity press?",
      a:`No.
We do not charge mandatory publishing fees.
We do not guarantee publication in exchange for payment.
We do not accept manuscripts based on service purchases.
Editorial acceptance is based solely on quality, preparation, and alignment with our standards.
Optional services are available, but they do not influence publishing decisions.`
    },
    {
      q:"Why is publishing free?",
      a:`Because access to infrastructure should not be restricted by capital.
Too many capable voices are blocked by upfront costs.
We remove that barrier while maintaining professional standards.
Free does not mean casual.
Free does not mean rushed.
Free does not mean lower quality.
It means access without exploitation.`
    },
    {
      q:"How does Sankofa make money?",
      a:`We generate revenue through:
• Optional editorial services
• Design services
• Publishing readiness assessments
• Marketing services
• Ghostwriting services
• Voluntary royalty contributions
• Optional author portal automation services
Our sustainability does not depend on seizing author rights or withholding royalties.`
    },
    {
      q:"Do you take ownership of my book?",
      a:`No.
Authors retain 100 percent copyright ownership and intellectual property control.
We receive limited non-exclusive publishing and distribution permission under formal agreement.
You own your work.`
    },
    {
      q:"Can only African or Black authors publish here?",
      a:`No.
Sankofa Publishers welcomes authors of all backgrounds.
However, the work must contribute value to African communities, diasporic discourse, or related intellectual and cultural conversations.
We are culturally grounded.
We are not racially exclusionary.`
    },
    {
      q:"What countries can publish with Sankofa?",
      a:`We accept submissions internationally.
Authors from multiple countries may publish with us.
Royalty payouts can be issued to many international banking systems.
For countries outside our direct payment gateway reach, special arrangements can be made.
Please note: international payouts may be subject to minimal but mandatory payment processing fees outside the control of Sankofa Publishers.`
    },
    {
      q:"Do you publish religious or faith based material?",
      a:`We do not publish faith based doctrine, religious advocacy, or theological promotion.
We may consider academic, sociological, or critical examination of religion if it is structured, analytical, and non evangelical in nature.
Our focus is intellectual rigor, not religious promotion.`
    },
    {
      q:"Are books selected based on the political or cultural views of Sankofa leadership?",
      a:`No manuscript is evaluated based on whether it aligns with personal beliefs of leadership.
We evaluate based on:
• Structural integrity
• Intellectual seriousness
• Ethical responsibility
• Cultural alignment
• Preparedness
We welcome controversial ideas.
We do not welcome reckless argument, hate speech, or defamatory content.`
    },
    {
      q:"Do you allow AI generated or AI assisted content?",
      a:`AI assisted content is permitted if fully disclosed at submission.
Failure to disclose AI usage may result in rejection or termination of publishing agreement if discovered later.
Transparency protects both author and publisher.`
    },
    {
      q:"How long does review take?",
      a:`Up to 45 days.
Every manuscript undergoes structured evaluation.
Possible outcomes:
Full Acceptance
Rejection
Conditional Acceptance with specified revision requirements.
We communicate clearly and decisively.`
    },
    {
      q:"What if my manuscript is rejected?",
      a:`Rejection simply means the manuscript does not meet current standards or alignment.
It does not mean you lack ability.
You may revise and resubmit at a later date.`
    },
    {
      q:"Can my book be placed in physical bookstores?",
      a:`We actively market titles to physical bookstores and retail buyers.
However, the decision to stock a book rests entirely with the individual bookseller.
Booksellers evaluate titles based on demand, market fit, and commercial viability.
While we cannot guarantee shelf placement, we are highly resourceful in working with retailers across multiple markets when the bookseller elects to stock the title.`
    },
    {
      q:"Can I withdraw my book later?",
      a:`Yes.
Authors may withdraw their book by providing 30 days written notice.
This allows for proper discontinuation of distribution and protection of intellectual property records according to industry standards.`
    },
    {
      q:"Are there hidden fees?",
      a:`No.
Publishing is free for accepted, publication ready manuscripts.
Optional services are clearly defined and separately priced.
Transparency is structural to our model.`
    },
    {
      q:"Is Sankofa political?",
      a:`We are culturally grounded.
We publish work that may critique systems, analyze power structures, or examine historical realities.
We are not a partisan organization.
We are a standards driven publishing institution.`
    }
  ]

  return (
    <main>

<style>{`

:root{
  --ink:#0c0f14;
  --wash:#f6f3ee;
  --line:rgba(12,15,20,.12);
  --gold:rgba(212,175,55,.85);
}

.page{
  background:var(--wash);
  min-height:100vh;
  color:var(--ink);
}

.wrap{
  max-width:1100px;
  margin:0 auto;
  padding:100px 20px 120px 20px;
}

.h1{
  font-size:44px;
  font-weight:800;
  margin-bottom:20px;
}

.goldRule{
  width:60px;
  height:2px;
  background:var(--gold);
  margin-bottom:40px;
}

/* TOP SPLIT */

.topSection{
  display:flex;
  gap:60px;
  align-items:flex-start;
  margin-bottom:80px;
}

.leftCol{
  flex:1;
}

.rightImage{
  width:520px;
  max-width:45%;
  position:relative;
}

.rightImage img{
  width:100%;
  display:block;
}

.fade{
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    linear-gradient(to left, var(--wash) 0%, transparent 35%),
    linear-gradient(to top, var(--wash) 0%, transparent 30%);
}

/* ACCORDION */

.item{
  border-bottom:1px solid var(--line);
  padding:22px 0;
  cursor:pointer;
}

.question{
  font-weight:700;
  font-size:18px;
  display:flex;
  justify-content:space-between;
}

.icon{
  transition:transform .3s ease;
}

.iconOpen{
  transform:rotate(45deg);
}

.answer{
  margin-top:16px;
  line-height:1.55;
  white-space:pre-line;
  max-height:0;
  overflow:hidden;
  opacity:0;
  transition:max-height .4s ease, opacity .3s ease;
}

.answerOpen{
  max-height:2000px;
  opacity:1;
}

.fullWidth{
  margin-top:40px;
}

@media(max-width:900px){
  .topSection{
    flex-direction:column;
  }
  .rightImage{
    max-width:100%;
  }
}

`}</style>

<div className="page">
<div className="wrap">

<h1 className="h1">QUESTIONS & ANSWERS</h1>
<div className="goldRule"/>

<div className="topSection">

  <div className="leftCol">
    {faqs.slice(0,3).map((item, index)=>(
      <div key={index}
        className="item"
        onClick={()=>toggle(index)}
      >
        <div className="question">
          {item.q}
          <span className={`icon ${active === index ? "iconOpen" : ""}`}>+</span>
        </div>
        <div className={`answer ${active === index ? "answerOpen" : ""}`}>
          {item.a}
        </div>
      </div>
    ))}
  </div>

  <div className="rightImage">
    <img src="/images/bookshelf.png" alt="Bookshelf" />
    <div className="fade"/>
  </div>

</div>

<div className="fullWidth">
  {faqs.slice(3).map((item, index)=>(
    <div key={index+3}
      className="item"
      onClick={()=>toggle(index+3)}
    >
      <div className="question">
        {item.q}
        <span className={`icon ${active === index+3 ? "iconOpen" : ""}`}>+</span>
      </div>
      <div className={`answer ${active === index+3 ? "answerOpen" : ""}`}>
        {item.a}
      </div>
    </div>
  ))}
</div>

</div>
</div>

</main>
  )
}