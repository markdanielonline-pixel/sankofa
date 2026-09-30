"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabase"

const GENRES = [
  "Literary fiction", "Historical fiction", "Memoir", "Biography", "Narrative nonfiction",
  "History", "Poetry", "Essays", "Children's and young readers", "Cultural and social commentary", "Other",
]

export default function SubmitForm() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [ai, setAi] = useState("none")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session)
      setReady(true)
    })
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const f = new FormData(e.currentTarget)
    const file = f.get("file") as File | null
    if (!file || !file.size) { setError("Please attach your manuscript file."); return }
    if (file.size > 50 * 1024 * 1024) { setError("The file is over 50 MB. Please send a smaller file."); return }
    setBusy(true)
    try {
      const { data: u } = await supabase.auth.getUser()
      if (!u.user) throw new Error("Please sign in first.")
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const path = `${u.user.id}/${Date.now()}-${safe}`
      const up = await supabase.storage.from("manuscripts").upload(path, file, { upsert: false })
      if (up.error) throw new Error("Upload failed: " + up.error.message)
      const s = (k: string) => String(f.get(k) ?? "").trim()
      const { error: rpcErr } = await supabase.rpc("submit_manuscript", {
        p: {
          title: s("title"), author_name: s("author_name"), genre: s("genre"),
          synopsis: s("synopsis"), target_audience: s("target_audience"), author_bio: s("author_bio"),
          platform_notes: s("platform_notes"), series_info: s("series_info"),
          desired_publication_date: s("desired_publication_date"),
          word_count: s("word_count"), prior_publication: s("prior_publication"),
          third_party_material: s("third_party_material"),
          ai_disclosure: s("ai_disclosure"), ai_use_details: s("ai_use_details"),
          rights_declared: f.get("rights_declared") === "on",
          terms_accepted: f.get("terms_accepted") === "on",
          file_path: path,
        },
      })
      if (rpcErr) throw new Error(rpcErr.message)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  if (!ready) return <p className="sk-p">Loading&hellip;</p>

  if (done) {
    return (
      <div className="sk-callout">
        <h3 className="sk-h3">Thank you. We have your manuscript.</h3>
        <p className="sk-p">A confirmation is on its way to your email. We aim to respond within seven calendar days. Receiving a submission does not guarantee acceptance.</p>
        <Link className="sk-btn primary" href="/portal">Go to your author portal</Link>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="sk-callout">
        <h3 className="sk-h3">Create a free account to submit.</h3>
        <p className="sk-p">An account lets you upload your manuscript and follow its progress. It takes a minute and costs nothing.</p>
        <div className="sk-btnrow">
          <Link className="sk-btn primary" href="/auth/signup">Create Account</Link>
          <Link className="sk-btn ghost onlight" href="/auth/login">I Already Have One</Link>
        </div>
      </div>
    )
  }

  return (
    <form className="sk-form" onSubmit={onSubmit}>
      <fieldset>
        <legend>The book</legend>
        <div className="sk-field"><label htmlFor="title">Title</label><input id="title" name="title" type="text" required /></div>
        <div className="sk-field"><label htmlFor="author_name">Author name as it should appear</label><input id="author_name" name="author_name" type="text" required /></div>
        <div className="sk-field"><label htmlFor="genre">Genre</label>
          <select id="genre" name="genre" required defaultValue=""><option value="" disabled>Choose one</option>{GENRES.map(g => <option key={g}>{g}</option>)}</select></div>
        <div className="sk-field"><label htmlFor="word_count">Approximate word count</label><input id="word_count" name="word_count" type="number" min="1" /></div>
        <div className="sk-field"><label htmlFor="synopsis">Synopsis</label><textarea id="synopsis" name="synopsis" rows={6} required minLength={100} /><span className="hint">At least 100 characters. Tell us what the book is about and how it ends.</span></div>
        <div className="sk-field"><label htmlFor="target_audience">Who is it for?</label><input id="target_audience" name="target_audience" type="text" required /></div>
        <div className="sk-field"><label htmlFor="series_info">Series information (optional)</label><input id="series_info" name="series_info" type="text" /></div>
        <div className="sk-field"><label htmlFor="desired_publication_date">Preferred publication date (optional)</label><input id="desired_publication_date" name="desired_publication_date" type="date" /><span className="hint">We set the final date so your launch has enough runway.</span></div>
      </fieldset>

      <fieldset>
        <legend>About you</legend>
        <div className="sk-field"><label htmlFor="author_bio">Short biography</label><textarea id="author_bio" name="author_bio" rows={4} required minLength={40} /></div>
        <div className="sk-field"><label htmlFor="platform_notes">Platform and audience (optional)</label><textarea id="platform_notes" name="platform_notes" rows={3} /><span className="hint">Speaking, community, newsletter or social reach, if you have it. Not required.</span></div>
        <div className="sk-field"><label htmlFor="prior_publication">Has this book been published before? (optional)</label><input id="prior_publication" name="prior_publication" type="text" /></div>
      </fieldset>

      <fieldset>
        <legend>Rights and AI use</legend>
        <div className="sk-field"><label htmlFor="ai_disclosure">Did you use AI in creating this manuscript?</label>
          <select id="ai_disclosure" name="ai_disclosure" value={ai} onChange={e => setAi(e.target.value)}>
            <option value="none">No, none</option>
            <option value="assisted">Yes, as an assistant (for example research, editing help)</option>
            <option value="generated">Yes, substantial portions were AI generated</option>
          </select></div>
        {ai !== "none" ? (
          <div className="sk-field"><label htmlFor="ai_use_details">Describe how AI was used</label><textarea id="ai_use_details" name="ai_use_details" rows={3} required minLength={20} /></div>
        ) : null}
        <div className="sk-field"><label htmlFor="third_party_material">Third-party material (optional)</label><textarea id="third_party_material" name="third_party_material" rows={2} /><span className="hint">Quotations, images, lyrics or other material you did not create.</span></div>
        <label className="check"><input type="checkbox" name="rights_declared" required /> I am the author, I hold the rights needed to submit this work, and it does not infringe anyone else&rsquo;s rights.</label>
        <label className="check"><input type="checkbox" name="terms_accepted" required /> I have read and accept the submission terms. I understand that submitting does not guarantee acceptance.</label>
      </fieldset>

      <fieldset>
        <legend>Your manuscript</legend>
        <div className="sk-field"><label htmlFor="file">File</label><input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.epub,.txt,.rtf" required /><span className="hint">PDF, Word, EPUB, TXT or RTF. Up to 50 MB.</span></div>
      </fieldset>

      {error ? <p className="err" role="alert">{error}</p> : null}
      <button className="sk-btn primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Submit Manuscript"}</button>
    </form>
  )
}
