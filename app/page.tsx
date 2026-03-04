"use client"

import FadeIn from "./components/animation/FadeIn"
import ParticlesBg from "./components/animation/Particles"

export default function HomePage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-12px) }
          100% { transform: translateY(0px) }
        }
        @keyframes driftSide {
          0% { transform: translateX(0px) }
          50% { transform: translateX(14px) }
          100% { transform: translateX(0px) }
        }
      `}</style>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          color: "white",
        }}
      >
        <img
          src="/images/hero2.png"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
        <ParticlesBg />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <FadeIn>
            <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#d4af37" }}>
              SANKOFA PUBLISHERS
            </div>

            <h1
              style={{
                marginTop: "14px",
                fontSize: "72px",
                fontWeight: 300,
                letterSpacing: "3px",
                lineHeight: "1.15",
              }}
            >
              AFRICAN HERITAGE
              <br />
              ACADEMIC EXCELLENCE
              <br />
              GLOBAL VOICE
            </h1>

            <div style={{ width: "120px", height: "2px", background: "#d4af37", margin: "26px auto 0" }} />
          </FadeIn>
        </div>
      </section>

      {/* 1) WHITE — Authority & Positioning (with BIG scroll/feather bleeding upward) */}
      <section
        style={{
          position: "relative",
          background: "#f6f3ee",
          color: "#111",
          overflow: "visible",
        }}
      >
        {/* Big overlay that bleeds upward into hero */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <img
            src="/images/antique_writing.png"
            style={{
              position: "absolute",
              right: "-220px",
              top: "-160px",
              width: "980px",
              opacity: 0.95,
              animation: "driftSide 10s ease-in-out infinite",
            }}
          />
        </div>

        <div style={{ maxWidth: "980px", margin: "auto", padding: "120px 20px", position: "relative", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>
              Authority &amp; Positioning
            </h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>
                Sankofa Publishers is a New Mexico based hybrid press built on more than 47 years of combined publishing
                experience across editorial, production, design, and print.
              </p>
              <p>We are not a vanity press. We are not volume driven. We are not trend responsive.</p>
              <p>
                <b>We are standards driven.</b>
              </p>
              <p>
                We publish across genres. Fiction. Non fiction. Scholarship. Cultural analysis. Memoir. Investigative
                work. Literary writing. Controversial but disciplined work.
              </p>
              <p>Our commitment is simple:</p>
              <p>Substance over spectacle. Preparation over convenience. Ownership over dependency.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2) DARK — Why Our Publishing Is Free */}
      <section style={{ position: "relative", color: "white", overflow: "hidden" }}>
        <img
          src="/images/antique_book.png"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)" }} />

        <div style={{ position: "relative", maxWidth: "980px", margin: "auto", padding: "120px 20px", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>Why Our Publishing Is Free</h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>Publishing should not be gated by financial barriers.</p>
              <p>If a manuscript meets our standards and is publication ready, we publish it at no cost.</p>
              <p>No submission fee. No mandatory service purchase. No rights seizure. No forced royalty split.</p>
              <p>Authors retain:</p>
              <p>
                • 100 percent copyright ownership
                <br />
                • 100 percent royalty earnings
                <br />
                • Full intellectual property control
              </p>
              <p>We receive only limited non-exclusive distribution permission through formal agreement.</p>
              <p>
                Authors may voluntarily contribute a portion of their royalties to sustain the press. This is optional
                and does not influence our level of commitment.
              </p>
              <p>Our service is free because access to infrastructure should not be restricted by capital.</p>
              <p>Publishing is not charity. It is circulation.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3) WHITE — Standards / Identity (BIG Sankofa watermark, NOT tiny) */}
      <section style={{ position: "relative", background: "#f6f3ee", color: "#111", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <img
            src="/images/sankofa.png"
            style={{
              position: "absolute",
              left: "-120px",
              top: "20px",
              width: "520px",
              opacity: 0.22,
              animation: "floatSlow 8s ease-in-out infinite",
            }}
          />
        </div>

        <div style={{ maxWidth: "980px", margin: "auto", padding: "120px 20px", position: "relative", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>Standards Driven Publishing</h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>We are not a vanity press. We are not a mass production platform.</p>
              <p>
                Every manuscript is evaluated for intellectual value, editorial strength, and long term contribution.
              </p>
              <p>
                Our process is disciplined and structured. Acceptance, rejection, or conditional acceptance decisions
                are clear and communicated professionally.
              </p>
              <p>
                We publish work that intends to endure, not work designed to chase attention.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4) DARK — Distribution & Infrastructure */}
      <section style={{ position: "relative", color: "white", overflow: "hidden" }}>
        <img
          src="/images/glowing_books.png"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)" }} />

        <div style={{ position: "relative", maxWidth: "980px", margin: "auto", padding: "120px 20px", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>
              Distribution &amp; Infrastructure
            </h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>Every accepted title receives:</p>
              <p>
                • Global paperback distribution
                <br />
                • Hardcover production
                <br />
                • eBook production and global retail placement
                <br />
                • Audiobook pathway
                <br />
                • ISBN registration
                <br />
                • Metadata optimization
                <br />
                • Sales transparency
                <br />
                • Dedicated author page
                <br />
                • Basic platform marketing support
              </p>
              <p>We do not hold your rights. We do not trap your book. We do not restrict your growth.</p>
              <p>
                <b>Ownership matters.</b>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5) WHITE — Cultural / Mission (BIG overlay, clean space) */}
      <section style={{ position: "relative", background: "#f6f3ee", color: "#111", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <img
            src="/images/logo_symbol.png"
            style={{
              position: "absolute",
              right: "-120px",
              top: "40px",
              width: "520px",
              opacity: 0.12,
              animation: "driftSide 12s ease-in-out infinite",
            }}
          />
        </div>

        <div style={{ maxWidth: "980px", margin: "auto", padding: "120px 20px", position: "relative", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>
              Cultural Positioning
            </h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>Africa was not discovered. It was mapped, traded with, and intellectually active.</p>
              <p>The diaspora is not fragmented. It is dispersed strength.</p>
              <p>Narrative control is power.</p>
              <p>
                We publish work that understands this. Not rage. Not spectacle. Discipline.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6) DARK — Institutional Commitment */}
      <section style={{ position: "relative", color: "white", overflow: "hidden" }}>
        <img
          src="/images/texture.png"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />

        <div style={{ position: "relative", maxWidth: "980px", margin: "auto", padding: "120px 20px", zIndex: 2 }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300, textAlign: "center" }}>
              Institutional Commitment
            </h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px" }}>
              <p>Colonization did not begin with chains. It began with distortion.</p>
              <p>Aid without ownership is dependency. Development without control is rebranded colonization.</p>
              <p>Publishing is infrastructure. Ownership of narrative strengthens sovereignty.</p>
              <p>We are building record, not reaction.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7) WHITE — Submission Invitation (BIG chains bleeding out) */}
      <section style={{ position: "relative", background: "#f6f3ee", color: "#111", overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <img
            src="/images/chains_breaking.png"
            style={{
              position: "absolute",
              left: "-180px",
              bottom: "-180px",
              width: "900px",
              opacity: 0.92,
              animation: "floatSlow 8s ease-in-out infinite",
            }}
          />
        </div>

        <div style={{ maxWidth: "980px", margin: "auto", padding: "120px 20px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <FadeIn>
            <h2 style={{ fontSize: "40px", fontWeight: 300 }}>Submission Invitation</h2>

            <div style={{ marginTop: "26px", lineHeight: "1.9", fontSize: "18px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
              <p>If your manuscript is prepared, disciplined, and aligned with intellectual responsibility, we invite you to submit.</p>
              <p>Up to 45 days structured review process. Clear decisions. Professional communication.</p>
              <p><b>We are for work that intends to endure.</b></p>
            </div>

            <div style={{ marginTop: "28px" }}>
              <a
                href="/submit"
                style={{
                  padding: "12px 20px",
                  border: "1px solid #d4af37",
                  color: "#d4af37",
                  textDecoration: "none",
                  display: "inline-block",
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                Submit Your Manuscript
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}