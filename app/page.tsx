"use client"

import ParticlesBg from "./components/animation/Particles"
import { Fraunces, Inter } from "next/font/google"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

export default function HomePage() {
  return (
    <main className={body.className}>
      <style jsx global>{`
        :root {
          --ink: #0B0B0C;
          --paper: #F6F3EE;
          --gold: #C9A227;
          --gold-dim: rgba(201,162,39,.18);
          --line: rgba(11,11,12,.10);
          --shadow: 0 22px 60px rgba(0,0,0,.18);
        }

        html, body {
          margin: 0;
          padding: 0;
          background: #fff;
          color: var(--ink);
        }

        a { color: inherit; text-decoration: none; }

        .pagecontainer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section { padding: 90px 0; }

        .kicker {
          letter-spacing: .22em;
          text-transform: uppercase;
          font-size: 11px;
          color: var(--gold);
          margin-bottom: 18px;
          display: block;
        }

        .h2 {
          font-family: ${display.style.fontFamily};
          font-weight: 400;
          font-size: clamp(32px, 3.5vw, 48px);
          line-height: 1.08;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .p {
          font-size: 17px;
          line-height: 1.7;
          color: rgba(11,11,12,.78);
          margin: 0 0 14px;
        }

        .rule {
          height: 1px;
          background: var(--line);
          margin: 28px 0;
          border: none;
        }

        .card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,.06);
          padding: 40px;
        }

        .btnRow {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 32px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 28px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .btnPrimary {
          background: var(--gold);
          color: #140F05;
          box-shadow: 0 10px 30px rgba(201,162,39,.28);
        }
        .btnPrimary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(201,162,39,.36); }

        .btnGhost {
          border: 1px solid rgba(201,162,39,.6);
          color: var(--gold);
          background: rgba(255,255,255,.08);
          backdrop-filter: blur(8px);
        }
        .btnGhost:hover { transform: translateY(-2px); border-color: var(--gold); }

        .threeCol {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 28px;
        }

        .statBox {
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
        }

        .statNum {
          font-family: ${display.style.fontFamily};
          font-size: 42px;
          font-weight: 300;
          color: var(--gold);
          line-height: 1;
          display: block;
          margin-bottom: 6px;
        }

        .statLabel {
          font-size: 13px;
          color: rgba(11,11,12,.6);
          letter-spacing: .04em;
        }

        .pillRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .pill {
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.08);
          border-radius: 999px;
          padding: 9px 18px;
          color: rgba(255,255,255,.88);
          font-size: 13px;
          letter-spacing: .02em;
          backdrop-filter: blur(6px);
        }

        .quoteBlock {
          border-left: 3px solid var(--gold);
          padding: 6px 0 6px 24px;
          margin: 24px 0;
        }

        @media (max-width: 768px) {
          .threeCol { grid-template-columns: 1fr; }
          .card { padding: 28px 20px; }
          .btnRow { flex-direction: column; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", color: "white" }}>

        {/* Background image */}
        <img
          src="/images/hero2.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.04)",
          }}
        />

        {/* Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.65) 50%, rgba(0,0,0,.80) 100%)",
        }} />

        {/* Gold accent */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 800px 500px at 10% 60%, rgba(201,162,39,.14), transparent 60%)",
        }} />

        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
  <ParticlesBg />
</div>

        {/* Hero content — no flexbox, just padding */}
        <div
          className="pagecontainer"
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "110px",
            paddingBottom: "120px",
          }}
        >
          <span className="kicker">Sankofa Publishers</span>

          <h1
            className={display.className}
            style={{
              fontSize: "clamp(48px, 6.5vw, 96px)",
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              maxWidth: 820,
              margin: "0 0 28px",
            }}
          >
            African Heritage.<br />
            Academic Excellence.<br />
            Global Voice.
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.8vw, 19px)",
            lineHeight: 1.7,
            maxWidth: 560,
            color: "rgba(255,255,255,.80)",
            margin: 0,
          }}>
            A global hybrid publishing house committed to intellectual rigor, cultural integrity, and disciplined storytelling rooted in the African world and its diaspora.
          </p>

          <div className="btnRow">
            <a className="btn btnPrimary" href="/submissions">Submit Your Manuscript</a>
            <a className="btn btnGhost" href="/model">Learn About Our Model</a>
          </div>

          <div className="pillRow">
            <span className="pill">Intellectual rigor over trends</span>
            <span className="pill">Author ownership &amp; control</span>
            <span className="pill">Infrastructure built for longevity</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────── */}
      <section style={{ background: "var(--ink)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div className="pagecontainer">
          <div className="threeCol" style={{ margin: 0, padding: "50px 0" }}>
            <div className="statBox" style={{ border: "none", background: "transparent" }}>
              <span className="statNum" style={{ color: "var(--gold)" }}>47+</span>
              <span className="statLabel" style={{ color: "rgba(255,255,255,.5)" }}>Years Combined Experience</span>
            </div>
            <div className="statBox" style={{ border: "none", background: "transparent" }}>
              <span className="statNum" style={{ color: "var(--gold)" }}>100%</span>
              <span className="statLabel" style={{ color: "rgba(255,255,255,.5)" }}>Author Rights Retained</span>
            </div>
            <div className="statBox" style={{ border: "none", background: "transparent" }}>
              <span className="statNum" style={{ color: "var(--gold)" }}>$0</span>
              <span className="statLabel" style={{ color: "rgba(255,255,255,.5)" }}>Cost to Publish</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTHORITY ────────────────────────────── */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="pagecontainer">
          <div className="card">
            <span className="kicker" style={{ color: "var(--gold)" }}>Who We Are</span>
            <h2 className="h2">Authority &amp; Positioning</h2>
            <p className="p">
              Sankofa Publishers is a New Mexico based hybrid press built on more than 47 years of combined publishing experience across editorial, production, design, and print.
            </p>

            <hr className="rule" />

            <div className="threeCol">
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: 16 }}>
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Not a vanity press.</p>
              </div>
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: 16 }}>
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Not volume driven.</p>
              </div>
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: 16 }}>
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Not trend responsive.</p>
              </div>
            </div>

            <hr className="rule" />

            <p className="p">We publish across genres — fiction, non-fiction, scholarship, cultural analysis, memoir, investigative work, and controversial but disciplined work.</p>

            <div className="quoteBlock">
              <p className="p" style={{ margin: 0, fontSize: 19, fontWeight: 500, color: "var(--ink)" }}>
                Substance over spectacle. Preparation over convenience. Ownership over dependency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREE PUBLISHING ──────────────────────── */}
      <section style={{ position: "relative", color: "white", overflow: "hidden" }}>
        <img
          src="/images/antique_book.png"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.80)" }} />

        <div className="pagecontainer" style={{ position: "relative", zIndex: 2, padding: "90px 24px" }}>
          <div className="card" style={{
            background: "rgba(11,11,12,.55)",
            border: "1px solid rgba(255,255,255,.10)",
            backdropFilter: "blur(12px)",
            color: "white",
          }}>
            <span className="kicker">Our Model</span>
            <h2 className="h2" style={{ color: "white" }}>Why Our Publishing Is Free</h2>

            <p className="p" style={{ color: "rgba(255,255,255,.80)" }}>
              Publishing should not be gated by financial barriers. If a manuscript meets our standards and is publication ready, we publish it at no cost.
            </p>

            <hr className="rule" style={{ background: "rgba(255,255,255,.12)", border: "none", height: 1 }} />

            <div className="threeCol">
              {["No submission fee.", "No rights seizure.", "No forced royalty split."].map(t => (
                <div key={t} style={{
                  border: "1px solid rgba(201,162,39,.25)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  background: "rgba(201,162,39,.06)",
                  color: "rgba(255,255,255,.86)",
                  fontSize: 15,
                }}>
                  {t}
                </div>
              ))}
            </div>

            <hr className="rule" style={{ background: "rgba(255,255,255,.12)", border: "none", height: 1 }} />

            <p className="p" style={{ color: "rgba(255,255,255,.80)" }}>
              <strong style={{ color: "white" }}>Authors retain:</strong> 100% copyright ownership · 100% royalty earnings · Full intellectual property control.
            </p>

            <div style={{
              marginTop: 32,
              padding: "44px 40px",
              border: "1px solid rgba(201,162,39,.4)",
              background: "rgba(201,162,39,.06)",
              borderRadius: 16,
              textAlign: "center",
            }}>
              <p className={display.className} style={{ fontSize: "clamp(32px, 4vw, 54px)", lineHeight: 1.05, color: "#C9A227", margin: "0 0 8px" }}>
                The price barrier is gone.
              </p>
              <p className={display.className} style={{ fontSize: "clamp(32px, 4vw, 54px)", lineHeight: 1.05, color: "white", margin: 0 }}>
                The responsibility remains.
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <a className="btn btnGhost" href="/model">Learn About Our Model</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTION ─────────────────────────── */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="pagecontainer">
          <div className="card">
            <span className="kicker">Infrastructure</span>
            <h2 className="h2">Distribution &amp; Infrastructure</h2>
            <p className="p"><strong>Every accepted title receives:</strong></p>

            <div className="threeCol">
              {[
                "Global paperback distribution",
                "Hardcover production",
                "eBook + global retail placement",
                "Audiobook pathway",
                "ISBN registration",
                "Metadata optimization",
                "Sales transparency",
                "Dedicated author page",
                "Marketing support",
              ].map(item => (
                <div key={item} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 15,
                  color: "rgba(11,11,12,.78)",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--line)",
                }}>
                  <span style={{ color: "var(--gold)", fontWeight: 700, marginTop: 1 }}>→</span>
                  {item}
                </div>
              ))}
            </div>

            <hr className="rule" />
            <p className="p" style={{ fontWeight: 600 }}>We do not hold your rights. We do not trap your book. Ownership matters.</p>
          </div>
        </div>
      </section>

      {/* ── CULTURAL POSITIONING ─────────────────── */}
      <section className="section" style={{ background: "var(--ink)", color: "white" }}>
        <div className="pagecontainer">
          <div className="card" style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "white",
          }}>
            <span className="kicker">Our Foundation</span>
            <h2 className="h2" style={{ color: "white" }}>Cultural Positioning</h2>

            <div className="quoteBlock" style={{ borderColor: "var(--gold)" }}>
              <p className="p" style={{ color: "rgba(255,255,255,.86)", margin: 0, fontSize: 18 }}>
                Africa was not discovered. It was mapped, traded with, and intellectually active while parts of Europe were still tribal.
              </p>
            </div>

            <p className="p" style={{ color: "rgba(255,255,255,.72)" }}>
              The diaspora is not fragmented. It is dispersed strength. The transatlantic slave trade was not only physical theft — it was the loss of skilled professionals, farmers, strategists, and human resilience through exploitation and displacement.
            </p>

            <p className="p" style={{ color: "rgba(255,255,255,.72)" }}>
              The richest natural continent on Earth remains economically constrained not because of absence, but because of extraction. Narrative control is power. You cannot build a sovereign future while seeking validation from systems that destabilized your past.
            </p>

            <hr className="rule" style={{ background: "rgba(255,255,255,.10)", border: "none", height: 1 }} />

            <p className="p" style={{ color: "white", fontWeight: 600, fontSize: 18, margin: 0 }}>
              We publish work that understands this. Not rage. Not spectacle. Discipline.
            </p>
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONAL COMMITMENT ─────────────── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="pagecontainer">
          <div className="card">
            <span className="kicker">Our Commitment</span>
            <h2 className="h2">Institutional Commitment</h2>

            <p className="p">Colonization did not begin with chains. It began with distortion. Skin bleaching, self-rejection, and internalized inferiority are not preferences. They are residues.</p>

            <div className="threeCol" style={{ marginTop: 0 }}>
              <div className="statBox">
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Aid without ownership</p>
                <p className="p" style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(11,11,12,.55)" }}>is dependency.</p>
              </div>
              <div className="statBox">
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Development without control</p>
                <p className="p" style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(11,11,12,.55)" }}>is rebranded colonization.</p>
              </div>
              <div className="statBox">
                <p className="p" style={{ margin: 0, fontWeight: 600 }}>Publishing is infrastructure.</p>
                <p className="p" style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(11,11,12,.55)" }}>We are building record, not reaction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION CTA ───────────────────────── */}
      <section style={{ background: "var(--ink)", padding: "100px 0" }}>
        <div className="pagecontainer" style={{ textAlign: "center" }}>
          <span className="kicker">Ready?</span>
          <h2 className={display.className} style={{
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 300,
            color: "white",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 auto 20px",
            maxWidth: 700,
          }}>
            We are for work that intends to endure.
          </h2>

          <p className="p" style={{ color: "rgba(255,255,255,.65)", maxWidth: 520, margin: "0 auto 32px" }}>
            If your manuscript is prepared, disciplined, and aligned with intellectual responsibility — we invite you to submit. Up to 45 days structured review. Professional communication. Clear decisions.
          </p>

          <a className="btn btnPrimary" href="/submissions" style={{ fontSize: 16, padding: "17px 36px" }}>
            Submit Your Manuscript
          </a>
        </div>
      </section>

    </main>
  )
}
