"use client"

import { useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

type PathType = "A" | "B"

export default function SubmissionsPage() {
  const [path, setPath] = useState<PathType>("A")

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [bookTitle, setBookTitle] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [bio, setBio] = useState("")
  const [pra, setPra] = useState(false)
  const [rightsConfirm, setRightsConfirm] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (path !== "A") return false
    if (!fullName.trim()) return false
    if (!email.trim()) return false
    if (!bookTitle.trim()) return false
    if (!synopsis.trim()) return false
    if (!bio.trim()) return false
    if (!file) return false
    if (!rightsConfirm) return false
    return true
  }, [path, fullName, email, bookTitle, synopsis, bio, file, rightsConfirm])

  const safeFilename = (name: string) => name.replace(/[^\w.\-]+/g, "_")

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setBookTitle("")
    setSynopsis("")
    setBio("")
    setPra(false)
    setRightsConfirm(false)
    setFile(null)
  }

  const handleSubmit = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!canSubmit) {
      setErrorMsg("Please complete all required fields and confirm rights.")
      return
    }

    setLoading(true)

    try {
      const f = file as File
      const stamp = new Date().toISOString().replace(/[:.]/g, "-")
      const objectPath = `submissions/${stamp}_${safeFilename(email.trim())}_${safeFilename(f.name)}`

      const upload = await supabase.storage
        .from("manuscripts")
        .upload(objectPath, f, {
          upsert: false,
          contentType:
            f.type ||
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })

      if (upload.error) throw upload.error

      const insert = await supabase.from("submissions").insert({
        path_type: "A",
        metadata: {
          full_name: fullName.trim(),
          email: email.trim(),
          book_title: bookTitle.trim(),
          synopsis: synopsis.trim(),
          author_bio: bio.trim(),
          pra_requested: pra,
          rights_confirmed: rightsConfirm,
          manuscript_bucket: "manuscripts",
          manuscript_path: objectPath,
          submitted_at: new Date().toISOString(),
          source: "website_submissions_page",
          version: "v2",
        },
      })

      if (insert.error) throw insert.error

      setSuccessMsg("Submission received. Our editorial team will review within 45 days.")
      resetForm()
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e?.message || "Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <style>{`
        :root{
          --ink:#0c0f14;
          --muted:#5f6b7a;
          --line:rgba(12,15,20,.10);
          --wash:#f6f3ee;
          --panel:#ffffff;
          --shadow:0 18px 40px rgba(12,15,20,.08);
          --gold:rgba(212,175,55,.92);
        }

        .page{
          background:var(--wash);
          min-height:100vh;
          color:var(--ink);
        }

        .wrap{
          max-width:1100px;
          margin:0 auto;
          padding:120px 20px 90px 20px;
        }

        .hero{
          background:rgba(255,255,255,.82);
          border:1px solid var(--line);
          border-radius:18px;
          box-shadow:var(--shadow);
          padding:34px;
          margin-bottom:18px;
        }

        .heroGrid{
          display:grid;
          grid-template-columns: 1.25fr .75fr;
          gap:26px;
          align-items:start;
        }

        @media (max-width: 980px){
          .heroGrid{ grid-template-columns:1fr; }
        }

        .kicker{
          font-size:12px;
          letter-spacing:.10em;
          text-transform:uppercase;
          font-weight:900;
          color:var(--muted);
        }

        .h1{
          font-size:44px;
          font-weight:1000;
          margin:10px 0 6px 0;
          line-height:1.05;
        }

        .quote{
          font-size:16px;
          font-weight:900;
          margin-top:8px;
          opacity:.9;
        }

        .subcopy{
          margin-top:16px;
          font-size:15px;
          line-height:1.6;
          color:rgba(12,15,20,.86);
          max-width:720px;
        }

        .motifBox{
          position:relative;
          min-height:260px;
        }

        .motif{
          position:absolute;
          right:-10px;
          top:-10px;
          width:520px;
          max-width:100%;
          height:auto;
          opacity:1;
          pointer-events:none;
          animation: drift 10s ease-in-out infinite;
        }

        @keyframes drift{
          0%{ transform:translate3d(0,0,0) rotate(-1deg); }
          50%{ transform:translate3d(-10px,14px,0) rotate(1deg); }
          100%{ transform:translate3d(0,0,0) rotate(-1deg); }
        }

        .toggle{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          margin-top:18px;
        }

        .tab{
          padding:12px 16px;
          border-radius:999px;
          border:1px solid var(--line);
          background:#fff;
          font-weight:1000;
          cursor:pointer;
          font-size:13px;
        }

        .tabActive{
          border-color:rgba(212,175,55,.55);
          background:rgba(212,175,55,.16);
        }

        .grid{
          display:grid;
          grid-template-columns: 1.15fr .85fr;
          gap:18px;
          align-items:start;
        }

        @media (max-width: 980px){
          .grid{ grid-template-columns:1fr; }
        }

        .panel{
          background:var(--panel);
          border:1px solid var(--line);
          border-radius:16px;
          padding:26px;
          box-shadow:var(--shadow);
        }

        .sectionTitle{
          font-size:18px;
          font-weight:1000;
          margin:0 0 10px 0;
        }

        .bodyText{
          font-size:14px;
          line-height:1.65;
          color:rgba(12,15,20,.86);
          margin:0 0 10px 0;
        }

        .hr{
          height:1px;
          background:var(--line);
          margin:18px 0;
        }

        ul{ margin:10px 0 12px 18px; padding:0; }
        li{ margin:6px 0; line-height:1.55; font-size:14px; color:rgba(12,15,20,.86); }

        label{
          display:block;
          font-size:12px;
          font-weight:900;
          letter-spacing:.08em;
          text-transform:uppercase;
          color:rgba(12,15,20,.7);
          margin-bottom:6px;
        }

        .row{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        @media (max-width: 720px){
          .row{ grid-template-columns:1fr; }
        }

        input, textarea{
          width:100%;
          padding:11px 12px;
          border-radius:10px;
          border:1px solid var(--line);
          font-size:14px;
          background:#fff;
          outline:none;
        }

        textarea{ min-height:120px; resize:vertical; }

        .inputGroup{ margin-bottom:12px; }

        .checkRow{
          display:flex;
          gap:10px;
          align-items:flex-start;
          font-size:14px;
          color:rgba(12,15,20,.86);
          margin:10px 0;
        }

        .btnRow{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          margin-top:14px;
          align-items:center;
        }

        .btn{
          padding:12px 16px;
          border-radius:12px;
          border:1px solid rgba(212,175,55,.55);
          background:rgba(212,175,55,.18);
          font-weight:1000;
          cursor:pointer;
          font-size:14px;
        }

        .btnGhost{
          border:1px solid var(--line);
          background:#fff;
        }

        .btn:disabled{
          opacity:.55;
          cursor:not-allowed;
        }

        .pill{
          display:inline-flex;
          align-items:center;
          padding:10px 12px;
          border-radius:12px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.75);
          font-size:13px;
          color:rgba(12,15,20,.78);
        }

        .noticeGood{
          border:1px solid rgba(34,197,94,.35);
          background:rgba(34,197,94,.10);
          padding:12px 14px;
          border-radius:12px;
          font-size:14px;
          line-height:1.5;
          margin-bottom:12px;
        }

        .noticeBad{
          border:1px solid rgba(239,68,68,.35);
          background:rgba(239,68,68,.10);
          padding:12px 14px;
          border-radius:12px;
          font-size:14px;
          line-height:1.5;
          margin-bottom:12px;
        }
      `}</style>

      <div className="wrap">
        <div className="hero">
          <div className="heroGrid">
            <div>
              <div className="kicker">Submissions</div>
              <h1 className="h1">SUBMISSIONS</h1>
              <div className="quote">“We were whole before we were scattered.”</div>

              <div className="subcopy">
                <strong>Two Submission Pathways</strong>
                <br />
                Sankofa Publishers serves authors at different stages of preparation.
                <br />
                Please select the pathway that best describes your manuscript.
              </div>

              <div className="toggle">
                <button
                  type="button"
                  className={`tab ${path === "A" ? "tabActive" : ""}`}
                  onClick={() => setPath("A")}
                >
                  Submit Publication Ready Manuscript
                </button>

                <button
                  type="button"
                  className={`tab ${path === "B" ? "tabActive" : ""}`}
                  onClick={() => setPath("B")}
                >
                  Request Professional Services Consultation
                </button>
              </div>
            </div>

            <div className="motifBox" aria-hidden="true">
              <img className="motif" src="/images/hieroglyphics.png" alt="" />
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            {path === "A" && (
              <>
                <div className="sectionTitle">Path A: Publication Ready Manuscript</div>
                <p className="bodyText">
                  For authors who believe their manuscript is fully edited, structurally sound, and production ready.
                </p>

                <ul>
                  <li>Submit directly for editorial review</li>
                  <li>Optionally request a Publishing Readiness Assessment</li>
                </ul>

                <p className="bodyText">
                  Publishing is free for manuscripts that meet our standards.
                </p>

                <div className="hr" />

                <div className="sectionTitle">Eligibility Requirements</div>

                <p className="bodyText"><strong>We consider:</strong></p>
                <ul>
                  <li>Fiction and non fiction across genres</li>
                  <li>Cultural, analytical, investigative, or literary work</li>
                  <li>Controversial but structured critique</li>
                  <li>Fully edited manuscripts</li>
                  <li>Authors holding full rights</li>
                </ul>

                <p className="bodyText"><strong>We do not consider:</strong></p>
                <ul>
                  <li>Incomplete drafts</li>
                  <li>Undisclosed AI generated content</li>
                  <li>Defamatory or slanderous material</li>
                  <li>Hate speech</li>
                  <li>Faith based doctrinal promotion</li>
                </ul>

                <div className="hr" />

                <div className="sectionTitle">Required Materials</div>
                <ul>
                  <li>Full manuscript in DOCX format</li>
                  <li>Short synopsis 300 to 500 words</li>
                  <li>Author biography 150 to 250 words</li>
                  <li>Completed submission form</li>
                </ul>

                <div className="hr" />

                <div className="sectionTitle">Optional: Publishing Readiness Assessment</div>
                <p className="bodyText">
                  Even experienced authors benefit from structured evaluation. Our Publishing Readiness Assessment includes:
                </p>
                <ul>
                  <li>Structural analysis</li>
                  <li>Formatting compliance review</li>
                  <li>Editorial consistency check</li>
                  <li>Production viability assessment</li>
                  <li>Risk and compliance flagging</li>
                </ul>
                <p className="bodyText">
                  This service protects your book before distribution. It is not mandatory for submission, but it significantly
                  reduces the risk of conditional acceptance or production delays. Selecting this option does not guarantee acceptance.
                </p>

                <div className="hr" />

                <div className="sectionTitle">Plagiarism and Integrity Review</div>
                <p className="bodyText">
                  All manuscripts may undergo plagiarism detection and originality screening. Submission confirms that:
                </p>
                <ul>
                  <li>The work is original</li>
                  <li>You hold full rights</li>
                  <li>All referenced material is properly cited</li>
                </ul>
                <p className="bodyText">
                  Violation may result in immediate rejection or termination of agreement.
                </p>

                <div className="hr" />

                <div className="sectionTitle">Submission Form</div>

                {successMsg && <div className="noticeGood">{successMsg}</div>}
                {errorMsg && <div className="noticeBad">{errorMsg}</div>}

                <div className="row">
                  <div className="inputGroup">
                    <label>Full Legal Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Legal Name" />
                  </div>

                  <div className="inputGroup">
                    <label>Email Address</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </div>
                </div>

                <div className="inputGroup">
                  <label>Book Title</label>
                  <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Book Title" />
                </div>

                <div className="inputGroup">
                  <label>Synopsis (300 to 500 words)</label>
                  <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="Synopsis (300 to 500 words)" />
                </div>

                <div className="inputGroup">
                  <label>Author Biography (150 to 250 words)</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Author Biography (150 to 250 words)" />
                </div>

                <div className="inputGroup">
                  <label>Manuscript File (DOCX)</label>
                  <input type="file" accept=".doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>

                <div className="checkRow">
                  <input
                    type="checkbox"
                    checked={pra}
                    onChange={(e) => setPra(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong>Optional:</strong> Add Publishing Readiness Assessment
                  </div>
                </div>

                <div className="checkRow">
                  <input
                    type="checkbox"
                    checked={rightsConfirm}
                    onChange={(e) => setRightsConfirm(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    I confirm the work is original, I hold full rights, and citations are properly included.
                  </div>
                </div>

                <div className="btnRow">
                  <button className="btn" type="button" onClick={handleSubmit} disabled={!canSubmit || loading}>
                    {loading ? "Submitting..." : "Submit Manuscript"}
                  </button>

                  <button className="btn btnGhost" type="button" onClick={resetForm} disabled={loading}>
                    Clear Form
                  </button>

                  <span className="pill">Review timeline: up to 45 days</span>
                </div>

                <div className="hr" />

                <div className="sectionTitle">Possible Outcomes</div>
                <ul>
                  <li>Full Acceptance</li>
                  <li>Rejection</li>
                  <li>Conditional Acceptance with specified revisions</li>
                </ul>
              </>
            )}

            {path === "B" && (
              <>
                <div className="sectionTitle">Path B: Manuscript Needs Professional Support</div>
                <p className="bodyText">For authors seeking:</p>
                <ul>
                  <li>Editing</li>
                  <li>Ghostwriting</li>
                  <li>Structural development</li>
                  <li>Cover design</li>
                  <li>Interior formatting</li>
                  <li>Marketing support</li>
                </ul>

                <p className="bodyText">
                  You may request professional services prior to submission for publication consideration.
                  Use this pathway if your manuscript is incomplete, unedited, or requires development.
                </p>

                <div className="btnRow">
                  <a className="btn btnGhost" href="/services" style={{ textDecoration: "none", color: "inherit" }}>
                    Go to Professional Services
                  </a>
                  <a className="btn" href="/contact" style={{ textDecoration: "none", color: "inherit" }}>
                    Request Consultation
                  </a>
                </div>
              </>
            )}
          </div>

          <aside className="panel">
            <div className="sectionTitle">WHO SHOULD NOT SUBMIT</div>
            <p className="bodyText">Please do not submit if:</p>
            <ul>
              <li>You are seeking guaranteed publication without review</li>
              <li>You are unwilling to engage in revision if required</li>
              <li>You intend to submit plagiarized or undisclosed AI generated content</li>
              <li>You expect publication to override professional standards</li>
            </ul>
            <p className="bodyText">We publish work that intends to endure.</p>

            <div className="hr" />

            <div className="sectionTitle">READY TO PROCEED?</div>
            <p className="bodyText">Select your pathway:</p>

            <div className="btnRow">
              <button className="btn btnGhost" type="button" onClick={() => setPath("A")}>
                Submit Publication Ready Manuscript
              </button>
              <a className="btn" href="/services" style={{ textDecoration: "none", color: "inherit" }}>
                Request Professional Services Consultation
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}