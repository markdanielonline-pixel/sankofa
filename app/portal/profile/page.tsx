"use client"

import React, { useEffect, useState, useRef } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

/* ═══════════════════════════════════════════════════════════
   ANIMATION HOOKS
═══════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties
}) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(18px)",
      transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const css = `
  :root { --ink:#0B0B0C; --paper:#F6F3EE; --gold:#C9A227; --line:rgba(11,11,12,.09); }
  *, *::before, *::after { box-sizing:border-box; }
  a { text-decoration:none; color:inherit; }

  @keyframes shimmer {
    0%  { background-position:-200% center; }
    100%{ background-position: 200% center; }
  }
  .pt-kicker {
    letter-spacing:.24em; text-transform:uppercase; font-size:10px;
    display:block; margin-bottom:10px;
    background:linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }

  @keyframes progressFill {
    from { width: 0; }
  }

  /* grain */
  .pt-grain {
    position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:.018;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  /* scroll bar */
  .pt-scrollbar {
    position:fixed; top:0; left:0; z-index:9999;
    height:2px; background:#C9A227;
    box-shadow:0 0 10px rgba(201,162,39,.65);
    transition:width .08s linear;
    pointer-events:none;
  }

  /* ── page shell ── */
  .pt-page {
    min-height: 100vh;
    background: var(--ink);
    padding-top: 72px;
  }

  /* ── inner container ── */
  .pt-pc {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* ══════════ WELCOME HERO ══════════ */
  .pt-hero {
    padding: 52px 0 44px;
    position: relative;
    overflow: hidden;
  }
  .pt-hero::before {
    content:'';
    position:absolute; inset:0;
    background: radial-gradient(ellipse 640px 320px at 8% 80%, rgba(201,162,39,.09), transparent 55%);
    pointer-events:none;
  }
  .pt-hero::after {
    content:'';
    position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, #C9A227 0%, rgba(201,162,39,.2) 40%, transparent 70%);
  }

  .pt-hero-inner {
    position: relative; z-index: 2;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .pt-greeting {
    font-size: clamp(30px, 3.6vw, 52px);
    font-weight: 300;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 0 0 10px;
  }
  .pt-greeting em {
    font-style: normal;
    color: #C9A227;
  }

  .pt-hero-sub {
    font-size: 14px;
    color: rgba(255,255,255,.42);
    margin: 0;
    line-height: 1.6;
  }

  .pt-logout-btn {
    padding: 9px 20px;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    background: transparent;
    color: rgba(255,255,255,.55);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: border-color .2s, color .2s, background .2s;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: center;
  }
  .pt-logout-btn:hover {
    border-color: rgba(255,255,255,.35);
    color: white;
    background: rgba(255,255,255,.06);
  }

  /* ══════════ PROGRESS BAND ══════════ */
  .pt-progress-band {
    padding: 32px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }

  .pt-progress-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 12px;
  }
  .pt-progress-label {
    font-size: 12px;
    color: rgba(255,255,255,.45);
    font-weight: 500;
    letter-spacing: .06em;
  }
  .pt-progress-pct {
    font-size: 13px;
    font-weight: 700;
    color: #C9A227;
    letter-spacing: .04em;
  }

  .pt-progress-track {
    height: 4px;
    background: rgba(255,255,255,.07);
    border-radius: 99px;
    overflow: hidden;
  }
  .pt-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #C9A227, #f5d878);
    border-radius: 99px;
    box-shadow: 0 0 14px rgba(201,162,39,.5);
    animation: progressFill .9s ease both .3s;
    transition: width .4s ease;
  }

  /* ══════════ SECTION TITLE ══════════ */
  .pt-sec {
    padding: 48px 0 0;
  }
  .pt-sec-last {
    padding: 48px 0 80px;
  }
  .pt-sec-title {
    font-size: clamp(20px, 2.2vw, 28px);
    font-weight: 300;
    color: white;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 24px;
  }

  /* ══════════ CARD ══════════ */
  .pt-card {
    background: rgba(255,255,255,.038);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 26px;
    transition: border-color .2s, background .2s;
  }
  .pt-card:hover {
    border-color: rgba(255,255,255,.13);
    background: rgba(255,255,255,.052);
  }
  .pt-card-gold {
    background: rgba(201,162,39,.06);
    border: 1px solid rgba(201,162,39,.2);
  }
  .pt-card-gold:hover {
    background: rgba(201,162,39,.09);
    border-color: rgba(201,162,39,.35);
  }

  .pt-card-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,.82);
    margin: 0 0 6px;
    letter-spacing: .01em;
  }
  .pt-card-body {
    font-size: 13px;
    color: rgba(255,255,255,.38);
    line-height: 1.6;
    margin: 0;
  }

  /* ══════════ DASHBOARD GRID ══════════ */
  .pt-dash-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .pt-dash-grid-2 {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px;
  }

  /* ══════════ CHECKLIST ══════════ */
  .pt-check-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(255,255,255,.06);
    cursor: pointer;
    transition: padding-left .18s;
  }
  .pt-check-item:hover { padding-left: 4px; }
  .pt-check-item:last-child { border-bottom: none; }

  .pt-check-box {
    width: 20px; height: 20px;
    border-radius: 6px;
    border: 1.5px solid rgba(201,162,39,.4);
    background: rgba(201,162,39,.04);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .2s, border-color .2s;
  }
  .pt-check-box.checked {
    background: #C9A227;
    border-color: #C9A227;
  }
  .pt-check-box.checked svg { opacity: 1; }
  .pt-check-box svg { opacity: 0; transition: opacity .2s; }

  .pt-check-label {
    font-size: 14px;
    color: rgba(255,255,255,.72);
    font-weight: 500;
    flex: 1;
  }
  .pt-check-label.done {
    color: rgba(255,255,255,.32);
    text-decoration: line-through;
    text-decoration-color: rgba(201,162,39,.4);
  }
  .pt-check-badge {
    font-size: 10px;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 99px;
    background: rgba(201,162,39,.12);
    color: #C9A227;
    font-weight: 600;
    flex-shrink: 0;
  }

  /* ══════════ UPLOAD AREA ══════════ */
  .pt-upload {
    border: 1.5px dashed rgba(201,162,39,.28);
    border-radius: 16px;
    padding: 40px 28px;
    text-align: center;
    background: rgba(201,162,39,.025);
    cursor: pointer;
    transition: border-color .2s, background .2s;
    position: relative;
  }
  .pt-upload:hover, .pt-upload.over {
    border-color: rgba(201,162,39,.55);
    background: rgba(201,162,39,.055);
  }
  .pt-upload input {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%;
  }

  .pt-upload-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(201,162,39,.12);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }

  .pt-upload-title {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,.78);
    margin: 0 0 6px;
  }
  .pt-upload-sub {
    font-size: 13px;
    color: rgba(255,255,255,.35);
    margin: 0 0 16px;
    line-height: 1.5;
  }
  .pt-upload-formats {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .pt-upload-fmt {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 99px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.45);
    letter-spacing: .06em;
    font-weight: 500;
  }

  .pt-uploaded-file {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(201,162,39,.08);
    border: 1px solid rgba(201,162,39,.25);
    border-radius: 12px;
    margin-top: 14px;
  }
  .pt-uploaded-name {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,.72);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pt-uploaded-size {
    font-size: 12px;
    color: rgba(201,162,39,.7);
    flex-shrink: 0;
  }
  .pt-remove-file {
    background: none;
    border: none;
    color: rgba(255,255,255,.3);
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    transition: color .18s;
  }
  .pt-remove-file:hover { color: rgba(255,80,80,.7); }

  .pt-upload-submit {
    margin-top: 16px;
    padding: 12px 28px;
    background: #C9A227;
    color: #140F05;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background .2s, transform .18s, box-shadow .18s;
    box-shadow: 0 6px 22px rgba(201,162,39,.28);
  }
  .pt-upload-submit:hover {
    background: #d4aa2e;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(201,162,39,.4);
  }

  /* ══════════ SERVICES MARKETPLACE ══════════ */
  .pt-services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .pt-svc-card {
    background: rgba(255,255,255,.034);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px;
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-decoration: none;
    transition: border-color .2s, background .2s, transform .18s;
  }
  .pt-svc-card:hover {
    border-color: rgba(201,162,39,.3);
    background: rgba(201,162,39,.04);
    transform: translateY(-3px);
  }

  .pt-svc-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(201,162,39,.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .pt-svc-name {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,.78);
    line-height: 1.3;
  }
  .pt-svc-price {
    font-size: 11px;
    color: #C9A227;
    font-weight: 600;
    letter-spacing: .04em;
  }

  /* ══════════ STATUS CARDS ══════════ */
  .pt-stat {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .pt-stat-num {
    font-size: 40px;
    font-weight: 300;
    color: #C9A227;
    line-height: 1;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }
  .pt-stat-label {
    font-size: 13px;
    color: rgba(255,255,255,.42);
    line-height: 1.45;
  }

  /* ══════════ BTN ══════════ */
  .pt-btn-gold {
    display: inline-flex;
    align-items: center;
    padding: 10px 22px;
    background: #C9A227;
    color: #140F05;
    border: none;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: background .2s, transform .18s, box-shadow .18s;
    box-shadow: 0 6px 22px rgba(201,162,39,.25);
    letter-spacing: .02em;
  }
  .pt-btn-gold:hover {
    background: #d4aa2e;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(201,162,39,.4);
  }

  .pt-btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 10px 22px;
    background: transparent;
    color: rgba(255,255,255,.6);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: color .2s, border-color .2s, background .2s;
  }
  .pt-btn-ghost:hover {
    color: white;
    border-color: rgba(255,255,255,.35);
    background: rgba(255,255,255,.06);
  }

  /* ══════════ STATUS BADGE ══════════ */
  .pt-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 99px;
  }
  .pt-badge-pending {
    background: rgba(201,162,39,.12);
    color: #C9A227;
    border: 1px solid rgba(201,162,39,.2);
  }
  .pt-badge-active {
    background: rgba(80,200,120,.1);
    color: rgba(80,200,120,.9);
    border: 1px solid rgba(80,200,120,.2);
  }
  .pt-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor; flex-shrink: 0;
  }

  /* ══════════ DIVIDER ══════════ */
  .pt-div {
    height: 1px;
    background: rgba(255,255,255,.06);
    margin: 0;
  }

  /* ══════════ AUTHOR PROFILE FORM ══════════ */
  .pt-profile-wrap {
    display: grid;
    grid-template-columns: 148px 1fr;
    gap: 32px;
    align-items: start;
  }
  .pt-avatar-area {
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
  }
  .pt-avatar {
    width: 112px; height: 112px; border-radius: 50%;
    background: rgba(201,162,39,.10);
    border: 2px solid rgba(201,162,39,.28);
    overflow: hidden; position: relative;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pt-avatar img { width:100%; height:100%; object-fit:cover; }
  .pt-avatar-init {
    font-size: 34px; font-weight: 600; color: #C9A227; line-height: 1;
  }
  .pt-avatar-spinner {
    position: absolute; inset: 0;
    background: rgba(0,0,0,.6);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: rgba(255,255,255,.6);
  }
  .pt-avatar-upload-label {
    font-size: 11px; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(201,162,39,.7);
    cursor: pointer; transition: color .2s; padding: 0; background: none; border: none;
    font-family: inherit;
  }
  .pt-avatar-upload-label:hover { color: #C9A227; }

  .pt-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .pt-field-label {
    font-size: 10px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(255,255,255,.35);
  }
  .pt-input, .pt-textarea {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 10px 14px;
    font-size: 14px; color: rgba(255,255,255,.82);
    font-family: inherit; width: 100%; outline: none;
    transition: border-color .2s, background .2s;
  }
  .pt-textarea { resize: vertical; min-height: 88px; }
  .pt-input:focus, .pt-textarea:focus {
    border-color: rgba(201,162,39,.45);
    background: rgba(255,255,255,.07);
  }
  .pt-social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pt-field-hint { font-size: 11px; color: rgba(255,255,255,.22); }

  /* profile toast */
  .pt-msg {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 12px 18px; border-radius: 12px;
    background: rgba(201,162,39,.12); border: 1px solid rgba(201,162,39,.28);
    font-size: 13px; color: rgba(255,255,255,.82);
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 28px rgba(0,0,0,.3);
  }

  /* ══════════ RESPONSIVE ══════════ */
  @media (max-width: 900px) {
    .pt-pc { padding: 0 20px; }
    .pt-dash-grid   { grid-template-columns: 1fr 1fr !important; }
    .pt-dash-grid-2 { grid-template-columns: 1fr !important; }
    .pt-services-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pt-profile-wrap { grid-template-columns: 1fr !important; }
    .pt-social-row   { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 580px) {
    .pt-dash-grid { grid-template-columns: 1fr !important; }
    .pt-services-grid { grid-template-columns: 1fr 1fr !important; }
  }
`

/* ═══════════════════════════════════════════════════════════
   CHECKLIST STATE KEY
═══════════════════════════════════════════════════════════ */
const CL_KEY = "sp_onboarding_v1"

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function PortalPage() {
  const router = useRouter()
  const [email,   setEmail]   = useState<string | null>(null)
  const [name,    setName]    = useState<string>("Author")
  const [loading, setLoading] = useState(true)
  const [scrollPct, setScrollPct] = useState(0)

  /* onboarding checklist */
  const [checklist, setChecklist] = useState({ uploaded: false, profile: false, services: false })
  const progress = Math.round(
    (Object.values(checklist).filter(Boolean).length / 3) * 100
  )

  /* manuscript upload */
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  /* author profile */
  const [authorId,       setAuthorId]       = useState<string | null>(null)
  const [authorSlug,     setAuthorSlug]     = useState<string | null>(null)
  const [bio,            setBio]            = useState("")
  const [tagline,        setTagline]        = useState("")
  const [photoUrl,       setPhotoUrl]       = useState("")
  const [socialLinks,    setSocialLinks]    = useState({ twitter: "", instagram: "", linkedin: "", website: "" })
  const [profileSaving,  setProfileSaving]  = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [profileMsg,     setProfileMsg]     = useState<string | null>(null)

  /* auth guard */
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth/login"); return }
      setEmail(data.user.email ?? null)
      const n = data.user.user_metadata?.full_name
      if (n) setName(n.split(" ")[0])

      /* load author profile */
      const { data: ap } = await supabase
        .from("authors")
        .select("id, slug, bio, tagline, photo_url, social_links")
        .eq("user_id", data.user.id)
        .maybeSingle()
      if (ap) {
        setAuthorId(ap.id)
        setAuthorSlug(ap.slug ?? null)
        setBio(ap.bio ?? "")
        setTagline(ap.tagline ?? "")
        setPhotoUrl(ap.photo_url ?? "")
        setSocialLinks({
          twitter:   ap.social_links?.twitter   ?? "",
          instagram: ap.social_links?.instagram ?? "",
          linkedin:  ap.social_links?.linkedin  ?? "",
          website:   ap.social_links?.website   ?? "",
        })
      }

      setLoading(false)
    })
  }, [router])

  /* persist checklist */
  useEffect(() => {
    const saved = localStorage.getItem(CL_KEY)
    if (saved) { try { setChecklist(JSON.parse(saved)) } catch {} }
  }, [])

  const toggleCheck = (key: keyof typeof checklist) => {
    const next = { ...checklist, [key]: !checklist[key] }
    setChecklist(next)
    localStorage.setItem(CL_KEY, JSON.stringify(next))
  }

  /* scroll bar */
  useEffect(() => {
    const fn = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setScrollPct(scrollTop / (scrollHeight - clientHeight) * 100)
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* ── Profile handlers ── */
  const showProfileMsg = (msg: string) => {
    setProfileMsg(msg)
    setTimeout(() => setProfileMsg(null), 3000)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setPhotoUploading(true)
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    if (!userId) { setPhotoUploading(false); return }
    const ext  = f.name.split(".").pop() ?? "jpg"
    const path = `${userId}/photo.${ext}`
    const { data: up, error } = await supabase.storage
      .from("author-photos")
      .upload(path, f, { upsert: true })
    if (!error && up) {
      const { data: urlData } = supabase.storage.from("author-photos").getPublicUrl(up.path)
      setPhotoUrl(urlData.publicUrl)
    } else {
      showProfileMsg(error?.message ?? "Upload failed")
    }
    setPhotoUploading(false)
  }

  const saveAuthorProfile = async () => {
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    if (!userId) return
    setProfileSaving(true)
    const payload = {
      bio:          bio.slice(0, 500),
      tagline:      tagline.slice(0, 100),
      photo_url:    photoUrl || null,
      social_links: socialLinks,
      updated_at:   new Date().toISOString(),
    }
    if (authorId) {
      const { error } = await supabase.from("authors").update(payload).eq("id", authorId)
      if (error) { showProfileMsg(error.message); setProfileSaving(false); return }
    } else {
      const { data: authUser } = await supabase.auth.getUser()
      const displayName = authUser.user?.user_metadata?.full_name ?? authUser.user?.email?.split("@")[0] ?? "Author"
      const { data: newA, error } = await supabase
        .from("authors")
        .insert({ user_id: userId, name: displayName, ...payload })
        .select("id, slug")
        .single()
      if (error) { showProfileMsg(error.message); setProfileSaving(false); return }
      if (newA) { setAuthorId(newA.id); setAuthorSlug(newA.slug ?? null) }
    }
    toggleCheck("profile")
    showProfileMsg("Profile saved!")
    setProfileSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleUploadSubmit = () => {
    toggleCheck("uploaded")
    alert("Manuscript submitted for review. We will be in touch within 45 business days.")
    setFile(null)
  }

  /* services */
  const services = [
    { icon: "✦", name: "Publishing Readiness Assessment", price: "$395 – $750",   href: "/services" },
    { icon: "✎", name: "Developmental Editing",           price: "$0.04/word",    href: "/services" },
    { icon: "✒", name: "Line Editing",                    price: "$0.02/word",    href: "/services" },
    { icon: "◉", name: "Proofreading",                    price: "$0.01/word",    href: "/services" },
    { icon: "❏", name: "Cover Design",                    price: "$600 – $1,800", href: "/services" },
    { icon: "⊞", name: "Interior Formatting",             price: "$500 – $1,200", href: "/services" },
    { icon: "♪", name: "Audiobook Production",            price: "$3k – $10k",    href: "/services" },
    { icon: "◈", name: "Marketing Campaign",              price: "$1.5k – $7.5k", href: "/services" },
  ]

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className={body.className} style={{ color: "rgba(255,255,255,.45)", fontSize: 14, letterSpacing: ".1em" }}>
          Loading your portal…
        </div>
      </main>
    )
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <main className={`${body.className} pt-page`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="pt-grain" aria-hidden />
      <div className="pt-scrollbar" style={{ width: `${scrollPct}%` }} aria-hidden />

      {/* ══════════════════════════════════════════
          WELCOME HERO
      ══════════════════════════════════════════ */}
      <section className="pt-hero">
        <div className="pt-pc">
          <div className="pt-hero-inner">
            <div>
              <span className="pt-kicker">Author Portal · Sankofa Publishers</span>
              <h1 className={`${display.className} pt-greeting`}>
                Welcome back, <em>{name}.</em>
              </h1>
              <p className="pt-hero-sub">{today} · Your manuscript work continues here.</p>
            </div>
            <button className="pt-logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ONBOARDING PROGRESS
      ══════════════════════════════════════════ */}
      <section className="pt-progress-band">
        <div className="pt-pc">
          <div className="pt-progress-row">
            <span className="pt-progress-label">Onboarding Progress</span>
            <span className="pt-progress-pct">{progress}% Complete</span>
          </div>
          <div className="pt-progress-track">
            <div className="pt-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DASHBOARD GRID
      ══════════════════════════════════════════ */}
      <section className="pt-sec">
        <div className="pt-pc">
          <Reveal>
            <div className="pt-dash-grid">

              {/* Status card */}
              <div className="pt-card">
                <span className="pt-kicker">Manuscript Status</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span className={`pt-badge ${file ? "pt-badge-active" : "pt-badge-pending"}`}>
                    <span className="pt-badge-dot" />
                    {file ? "Ready to Submit" : "Awaiting Upload"}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Review Window",    val: "45 days max" },
                    { label: "Submission Path",  val: file ? "Path A" : "Not started" },
                    { label: "Account",          val: email ?? "—" },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,.38)" }}>{label}</span>
                      <span style={{ color: "rgba(255,255,255,.65)", fontWeight: 500, fontSize: 12, maxWidth: 160, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding checklist */}
              <div className="pt-card pt-card-gold">
                <span className="pt-kicker">Getting Started</span>
                <div>
                  {[
                    {
                      key: "uploaded" as const,
                      label: "Upload your manuscript",
                      badge: "Required",
                    },
                    {
                      key: "profile" as const,
                      label: "Complete your author profile",
                      badge: "Recommended",
                    },
                    {
                      key: "services" as const,
                      label: "Explore available services",
                      badge: "Optional",
                    },
                  ].map(item => (
                    <div
                      key={item.key}
                      className="pt-check-item"
                      onClick={() => toggleCheck(item.key)}
                      role="checkbox"
                      aria-checked={checklist[item.key]}
                      tabIndex={0}
                      onKeyDown={e => e.key === " " && toggleCheck(item.key)}
                    >
                      <div className={`pt-check-box ${checklist[item.key] ? "checked" : ""}`}>
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`pt-check-label ${checklist[item.key] ? "done" : ""}`}>
                        {item.label}
                      </span>
                      <span className="pt-check-badge">{item.badge}</span>
                    </div>
                  ))}
                </div>
                {progress === 100 && (
                  <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(201,162,39,.12)", border: "1px solid rgba(201,162,39,.25)", borderRadius: 10, fontSize: 13, color: "#C9A227", fontWeight: 500, lineHeight: 1.5 }}>
                    Onboarding complete — your portal is fully set up.
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="pt-card">
                <span className="pt-kicker">Quick Actions</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {[
                    { label: "View Submission Guidelines →", href: "/submissions" },
                    { label: "Browse All Services →",        href: "/services"    },
                    { label: "Our Publishing Model →",       href: "/model"       },
                    { label: "Contact Our Team →",           href: "/contact"     },
                    { label: "Read Our Policies →",          href: "/policies"    },
                  ].map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        borderRadius: 10,
                        fontSize: 13,
                        color: "rgba(255,255,255,.60)",
                        fontWeight: 500,
                        background: "rgba(255,255,255,.03)",
                        border: "1px solid rgba(255,255,255,.06)",
                        transition: "color .18s, background .18s, border-color .18s",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.color = "white"
                        el.style.background = "rgba(255,255,255,.065)"
                        el.style.borderColor = "rgba(201,162,39,.22)"
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.color = "rgba(255,255,255,.60)"
                        el.style.background = "rgba(255,255,255,.03)"
                        el.style.borderColor = "rgba(255,255,255,.06)"
                      }}
                    >
                      <span style={{ color: "#C9A227", fontSize: 11, flexShrink: 0 }}>→</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      <div className="pt-div" style={{ margin: "40px 0 0" }} />

      {/* ══════════════════════════════════════════
          MANUSCRIPT UPLOAD
      ══════════════════════════════════════════ */}
      <section className="pt-sec" id="upload">
        <div className="pt-pc">
          <Reveal>
            <span className="pt-kicker">Manuscript Upload</span>
            <h2 className={`${display.className} pt-sec-title`} style={{ marginBottom: 20 }}>
              Submit Your Manuscript
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pt-dash-grid-2" style={{ alignItems: "start" }}>

              {/* Upload area */}
              <div>
                <div
                  className={`pt-upload ${dragOver ? "over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  <input
                    type="file"
                    accept=".docx,.doc,.pdf"
                    onChange={handleFileInput}
                    aria-label="Upload manuscript"
                  />
                  <div className="pt-upload-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 13V4M10 4l-3 3M10 4l3 3" stroke="#C9A227" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="#C9A227" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="pt-upload-title">
                    {dragOver ? "Drop your manuscript here" : "Drag & drop your manuscript"}
                  </p>
                  <p className="pt-upload-sub">
                    or click anywhere in this area to browse your files
                  </p>
                  <div className="pt-upload-formats">
                    {[".DOCX", ".DOC", ".PDF"].map(fmt => (
                      <span key={fmt} className="pt-upload-fmt">{fmt}</span>
                    ))}
                  </div>
                </div>

                {file && (
                  <div className="pt-uploaded-file">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="2" y="1" width="14" height="16" rx="2" stroke="#C9A227" strokeWidth="1.4"/>
                      <path d="M5 6h8M5 9h8M5 12h5" stroke="#C9A227" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <span className="pt-uploaded-name">{file.name}</span>
                    <span className="pt-uploaded-size">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <button className="pt-remove-file" onClick={() => setFile(null)} aria-label="Remove file">
                      ×
                    </button>
                  </div>
                )}

                {file && (
                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <button className="pt-upload-submit" onClick={handleUploadSubmit}>
                      Submit for Review →
                    </button>
                    <button className="pt-btn-ghost" onClick={() => setFile(null)}>
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Upload guidance */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="pt-card">
                  <p className="pt-card-title" style={{ marginBottom: 12 }}>Required Materials</p>
                  {[
                    { item: "Full manuscript",         note: "DOCX preferred" },
                    { item: "Short synopsis",          note: "300–500 words"  },
                    { item: "Author biography",        note: "150–250 words"  },
                    { item: "Submission form",         note: "Below"          },
                  ].map(({ item, note }) => (
                    <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,.62)", fontWeight: 500 }}>{item}</span>
                      <span style={{ fontSize: 11, color: "rgba(201,162,39,.65)", fontWeight: 600, letterSpacing: ".04em" }}>{note}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-card" style={{ background: "rgba(201,162,39,.04)", border: "1px solid rgba(201,162,39,.18)" }}>
                  <span className="pt-kicker" style={{ marginBottom: 8 }}>Review Timeline</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <span className={display.className} style={{ fontSize: 46, fontWeight: 300, color: "#C9A227", lineHeight: 1 }}>45</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.42)", lineHeight: 1.5 }}>days maximum<br />review window</span>
                  </div>
                  <p className="pt-card-body" style={{ fontSize: 12 }}>
                    Full Acceptance, Conditional Acceptance, or Rejection — with clear written explanation.
                  </p>
                </div>

                <Link href="/submissions" className="pt-btn-ghost" style={{ justifyContent: "center" }}>
                  View Full Submission Guidelines →
                </Link>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      <div className="pt-div" style={{ margin: "48px 0 0" }} />

      {/* ══════════════════════════════════════════
          AUTHOR PROFILE
      ══════════════════════════════════════════ */}
      <section className="pt-sec" id="profile">
        <div className="pt-pc">
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
              <div>
                <span className="pt-kicker">Author Profile</span>
                <h2 className={`${display.className} pt-sec-title`} style={{ marginBottom: 0 }}>
                  Your Public Minisite
                </h2>
              </div>
              {authorId && authorSlug && (
                <a
                  href={`/authors/${authorSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-btn-ghost"
                  style={{ fontSize: 12 }}
                >
                  View Live Minisite →
                </a>
              )}
            </div>
            {!authorId && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", margin: "0 0 20px", lineHeight: 1.6 }}>
                Fill out your profile below and save — an admin will assign your slug and publish your minisite once reviewed.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pt-card" style={{ padding: "28px 30px" }}>
              <div className="pt-profile-wrap">

                {/* ── Avatar ── */}
                <div className="pt-avatar-area">
                  <div className="pt-avatar">
                    {photoUrl ? (
                      <img src={photoUrl} alt={name} />
                    ) : (
                      <span className={`${display.className} pt-avatar-init`}>
                        {name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    {photoUploading && (
                      <div className="pt-avatar-spinner">Uploading…</div>
                    )}
                  </div>
                  <label>
                    <span className="pt-avatar-upload-label">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.2)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                    JPG, PNG, WebP<br />400×400 recommended
                  </p>
                </div>

                {/* ── Fields ── */}
                <div>
                  <div className="pt-field">
                    <span className="pt-field-label">
                      Tagline&nbsp;
                      <span style={{ color: "rgba(255,255,255,.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({tagline.length}/100)</span>
                    </span>
                    <input
                      className="pt-input"
                      placeholder="A short, powerful line about your work"
                      value={tagline}
                      maxLength={100}
                      onChange={e => setTagline(e.target.value)}
                    />
                  </div>

                  <div className="pt-field">
                    <span className="pt-field-label">
                      Bio&nbsp;
                      <span style={{ color: "rgba(255,255,255,.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({bio.length}/500)</span>
                    </span>
                    <textarea
                      className="pt-textarea"
                      placeholder="Tell readers about yourself and your work…"
                      value={bio}
                      maxLength={500}
                      rows={4}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>

                  <div className="pt-field">
                    <span className="pt-field-label">Social Links</span>
                    <div className="pt-social-row">
                      {(["twitter", "instagram", "linkedin", "website"] as const).map(key => (
                        <input
                          key={key}
                          className="pt-input"
                          placeholder={
                            key === "twitter"   ? "Twitter / X URL"  :
                            key === "instagram" ? "Instagram URL"     :
                            key === "linkedin"  ? "LinkedIn URL"      :
                            "Personal website URL"
                          }
                          value={socialLinks[key]}
                          onChange={e => setSocialLinks(p => ({ ...p, [key]: e.target.value }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      className="pt-btn-gold"
                      onClick={saveAuthorProfile}
                      disabled={profileSaving}
                    >
                      {profileSaving ? "Saving…" : "Save Profile"}
                    </button>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.28)", margin: 0, lineHeight: 1.5 }}>
                      {authorId
                        ? authorSlug
                          ? `Your minisite is live at /authors/${authorSlug}`
                          : "Profile saved. Admin will publish your minisite."
                        : "Saving creates a draft minisite for admin review."}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* profile toast */}
      {profileMsg && (
        <div className="pt-msg">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A227", flexShrink: 0 }} />
          {profileMsg}
        </div>
      )}

      <div className="pt-div" style={{ margin: "48px 0 0" }} />

      {/* ══════════════════════════════════════════
          SERVICES MARKETPLACE
      ══════════════════════════════════════════ */}
      <section className="pt-sec pt-sec-last">
        <div className="pt-pc">
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="pt-kicker">Services Marketplace</span>
                <h2 className={`${display.className} pt-sec-title`} style={{ marginBottom: 0 }}>
                  Professional Support, When You Need It
                </h2>
              </div>
              <Link href="/services" className="pt-btn-ghost" onClick={() => toggleCheck("services")}>
                View All Services &amp; Pricing →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="pt-services-grid">
              {services.map((svc, i) => (
                <Link
                  key={svc.name}
                  href={svc.href}
                  className="pt-svc-card"
                  onClick={() => toggleCheck("services")}
                >
                  <div className="pt-svc-icon" aria-hidden>{svc.icon}</div>
                  <p className="pt-svc-name">{svc.name}</p>
                  <p className="pt-svc-price">{svc.price}</p>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ marginTop: 24, padding: "24px 28px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <p className="pt-card-title" style={{ marginBottom: 4 }}>Need something custom?</p>
                <p className="pt-card-body" style={{ fontSize: 13 }}>Corporate, institutional, and bespoke packages are available on request.</p>
              </div>
              <Link href="/contact" className="pt-btn-gold">
                Get in Touch →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}
