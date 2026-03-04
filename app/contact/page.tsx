"use client"

export default function ContactPage() {
  return (
    <main>

<style>{`

:root{
  --ink:#0c0f14;
  --muted:#5f6b7a;
  --line:rgba(12,15,20,.10);
  --wash:#f6f3ee;
  --panel:#ffffff;
  --gold:rgba(212,175,55,.85);
}

.page{
  background:var(--wash);
  min-height:100vh;
  color:var(--ink);
}

.layout{
  display:grid;
  grid-template-columns: 48% 52%;
  min-height:100vh;
}

/* LEFT IMAGE */

.leftPanel{
  position:relative;
  background:var(--wash);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px;
}

.leftPanel img{
  width:100%;
  max-width:620px;
  object-fit:contain;
}

/* subtle fade toward text side */
.leftFade{
  position:absolute;
  right:0;
  top:0;
  bottom:0;
  width:120px;
  background:linear-gradient(to right, transparent, var(--wash));
  pointer-events:none;
}

/* RIGHT CONTENT */

.rightPanel{
  padding:100px 80px 120px 80px;
  display:flex;
  flex-direction:column;
  justify-content:center;
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
  font-size:18px;
  font-weight:800;
  margin-top:28px;
  margin-bottom:8px;
}

.hr{
  height:1px;
  background:var(--line);
  margin:22px 0;
}

.mono{
  font-weight:800;
}

/* FORM */

.form{
  margin-top:30px;
  max-width:520px;
}

.inputGroup{
  margin-bottom:14px;
}

input, textarea{
  width:100%;
  padding:12px;
  border-radius:10px;
  border:1px solid var(--line);
  font-size:14px;
  background:#fff;
  color:var(--ink);
}

textarea{
  min-height:140px;
  resize:vertical;
}

.btn{
  padding:12px 18px;
  border-radius:10px;
  border:1px solid rgba(212,175,55,.6);
  background:rgba(212,175,55,.18);
  font-weight:800;
  cursor:pointer;
}

.note{
  font-size:13px;
  color:var(--muted);
  margin-top:12px;
}

@media(max-width:1000px){
  .layout{
    grid-template-columns:1fr;
  }
  .rightPanel{
    padding:60px 24px 100px 24px;
  }
  .leftPanel{
    padding:40px 24px;
  }
}

`}</style>

<div className="page">

<div className="layout">

  <div className="leftPanel">
    <img src="/images/open_door.png" alt="Open Door" />
    <div className="leftFade"/>
  </div>

  <div className="rightPanel">

    <div className="kicker">Contact</div>
    <h1 className="h1">CONTACT</h1>
    <div className="quote">“Legacy requires structure.”</div>

    <div className="bodyText">
      <strong>Get in Touch</strong><br/>
      For general inquiries, submissions support, services, media, or partnerships, contact us below.
    </div>

    <div className="sectionTitle">Address</div>
    <div className="bodyText">
      Sankofa Publishers, LLC<br/>
      102 Marquez Place<br/>
      Santa Fe, NM 87505<br/>
      USA
    </div>

    <div className="hr"/>

    <div className="sectionTitle">Email</div>
    <div className="bodyText mono">
      contact@sankofapublishers.com
    </div>

    <div className="hr"/>

    <div className="sectionTitle">Additional Department Emails</div>
    <div className="bodyText">
      submissions@sankofapublishers.com<br/>
      services@sankofapublishers.com<br/>
      partnerships@sankofapublishers.com<br/>
      press@sankofapublishers.com<br/>
      compliance@sankofapublishers.com
    </div>

    <form className="form">
      <div className="sectionTitle">Send a Message</div>

      <div className="inputGroup">
        <input name="name" placeholder="Full Name" />
      </div>

      <div className="inputGroup">
        <input name="email" type="email" placeholder="Email Address" />
      </div>

      <div className="inputGroup">
        <textarea name="message" placeholder="Message" />
      </div>

      <button type="submit" className="btn">
        Send Message
      </button>

      <div className="note">
        We respond as promptly as possible. Complex inquiries may require additional processing time.
      </div>
    </form>

  </div>

</div>

</div>

</main>
  )
}