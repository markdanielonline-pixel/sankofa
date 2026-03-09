"use client"

import React, { useState, useEffect, useRef } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { AuthorData, BookData, EventData, GalleryData, PressData } from "./page"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

type Tab = "home" | "books" | "events" | "gallery" | "press" | "contact"

const TABS: { id: Tab; label: string }[] = [
  { id: "home",    label: "Home"    },
  { id: "books",   label: "Books"   },
  { id: "events",  label: "Events"  },
  { id: "gallery", label: "Gallery" },
  { id: "press",   label: "Press"   },
  { id: "contact", label: "Contact" },
]

const TPL_SWATCHES = { classic: "#FAF7F2", bold: "#0B0B0C", minimal: "#FFFFFF" }

const TPL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; overflow-x: hidden; }
  a { color: inherit; text-decoration: none; }

  [data-tpl="classic"] {
    --bg:#FAF7F2; --bg2:#F0EBE0; --bg3:#E4DBCA;
    --text:#1A1208; --text2:rgba(26,18,8,.52);
    --gold:#8B6B0A; --gold2:rgba(139,107,10,.13);
    --border:rgba(26,18,8,.11); --card:rgba(26,18,8,.04);
    --nav-bg:rgba(250,247,242,.94); --hero-g:linear-gradient(150deg,#FAF7F2 0%,#EDE3C8 100%);
    --btn-text:#FAF7F2;
  }
  [data-tpl="bold"] {
    --bg:#0B0B0C; --bg2:#141416; --bg3:#1C1C20;
    --text:#FFFFFF; --text2:rgba(255,255,255,.42);
    --gold:#C9A227; --gold2:rgba(201,162,39,.11);
    --border:rgba(255,255,255,.08); --card:rgba(255,255,255,.04);
    --nav-bg:rgba(11,11,12,.93); --hero-g:linear-gradient(150deg,#0B0B0C 0%,#1A1509 100%);
    --btn-text:#0B0B0C;
  }
  [data-tpl="minimal"] {
    --bg:#FFFFFF; --bg2:#F5F5F3; --bg3:#EBEBEA;
    --text:#111111; --text2:rgba(17,17,17,.48);
    --gold:#7A5C0A; --gold2:rgba(122,92,10,.09);
    --border:rgba(17,17,17,.09); --card:rgba(17,17,17,.03);
    --nav-bg:rgba(255,255,255,.95); --hero-g:linear-gradient(150deg,#FFFFFF 0%,#F0EDE5 100%);
    --btn-text:#FFFFFF;
  }

  .ms-page { min-height:100vh; background:var(--bg); color:var(--text); transition:background .35s,color .35s; }

  .ms-editbar { background:var(--gold2); border-bottom:1px solid var(--gold); padding:10px 32px; display:flex; align-items:center; gap:12px; font-size:12px; color:var(--gold); font-weight:600; flex-wrap:wrap; }
  .ms-editbar-dot { width:7px; height:7px; border-radius:50%; background:var(--gold); flex-shrink:0; }
  .ms-edit-btn { font-size:11px; font-weight:700; letter-spacing:.06em; padding:6px 13px; border-radius:7px; border:1px solid var(--gold); color:var(--gold); background:transparent; cursor:pointer; transition:background .18s,color .18s; }
  .ms-edit-btn:hover,.ms-edit-btn.active { background:var(--gold); color:var(--btn-text); }

  .ms-topbar { position:sticky; top:0; z-index:100; background:var(--nav-bg); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); padding:0 32px; display:flex; align-items:center; justify-content:space-between; gap:16px; height:58px; }
  .ms-back { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--gold); opacity:.72; display:flex; align-items:center; gap:5px; transition:opacity .2s; flex-shrink:0; }
  .ms-back:hover { opacity:1; }
  .ms-tabs { display:flex; flex:1; max-width:580px; margin:0 auto; border:1px solid var(--border); border-radius:10px; overflow:hidden; }
  .ms-tab { flex:1; padding:10px 0; font-size:12px; font-weight:600; letter-spacing:.04em; text-align:center; background:transparent; border:none; color:var(--text2); cursor:pointer; transition:background .18s,color .18s; white-space:nowrap; }
  .ms-tab.active { background:var(--gold2); color:var(--gold); }
  .ms-tab:hover:not(.active) { background:var(--card); color:var(--text); }
  .ms-topbar-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .ms-tpl-toggle { font-size:11px; font-weight:700; letter-spacing:.06em; padding:7px 12px; border:1px solid var(--border); color:var(--text2); border-radius:8px; background:transparent; cursor:pointer; transition:border-color .2s,color .2s; }
  .ms-tpl-toggle:hover { border-color:var(--gold); color:var(--gold); }

  .ms-tpl-panel { position:fixed; top:70px; right:20px; z-index:200; background:var(--nav-bg); border:1px solid var(--border); border-radius:14px; padding:18px 20px; backdrop-filter:blur(14px); width:230px; box-shadow:0 16px 48px rgba(0,0,0,.28); }
  .ms-tpl-panel-title { font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--text2); margin:0 0 14px; }
  .ms-tpl-opt { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px; border:1px solid transparent; transition:border-color .18s,background .18s; margin-bottom:6px; }
  .ms-tpl-opt.active { border-color:var(--gold); background:var(--gold2); }
  .ms-tpl-opt:hover:not(.active) { background:var(--card); }
  .ms-tpl-swatch { width:22px; height:22px; border-radius:6px; flex-shrink:0; }
  .ms-tpl-opt-label { font-size:13px; font-weight:500; color:var(--text); }
  .ms-tpl-locked { font-size:11px; color:var(--text2); margin:10px 0 0; text-align:center; line-height:1.5; }

  .ms-pc { max-width:1100px; margin:0 auto; padding:0 32px; }

  .ms-hero { background:var(--hero-g); padding:80px 0 70px; border-bottom:1px solid var(--border); }
  .ms-hero-inner { display:flex; align-items:center; gap:64px; max-width:1100px; margin:0 auto; padding:0 32px; }
  .ms-hero-text { flex:1; }
  .ms-hero-kicker { font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin:0 0 16px; font-weight:600; display:block; }
  .ms-hero-name { font-size:clamp(44px,5.5vw,82px); font-weight:300; letter-spacing:-.03em; line-height:1.0; margin:0 0 18px; color:var(--text); }
  .ms-hero-tagline { font-size:clamp(15px,1.5vw,18px); color:var(--text2); line-height:1.65; margin:0 0 30px; max-width:460px; }
  .ms-hero-socials { display:flex; gap:12px; flex-wrap:wrap; }
  .ms-social-link { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:600; letter-spacing:.04em; color:var(--text2); padding:8px 15px; border:1px solid var(--border); border-radius:8px; transition:border-color .2s,color .2s,background .2s; }
  .ms-social-link:hover { border-color:var(--gold); color:var(--gold); background:var(--gold2); }
  .ms-social-link svg { width:14px; height:14px; flex-shrink:0; }
  .ms-avatar-wrap { width:240px; height:240px; flex-shrink:0; border-radius:50%; border:3px solid var(--gold); overflow:hidden; position:relative; }
  .ms-avatar-wrap.owner { cursor:pointer; }
  .ms-avatar-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
  .ms-avatar-initials { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:80px; font-weight:300; color:var(--gold); opacity:.35; background:var(--bg2); }
  .ms-avatar-upload-hint { position:absolute; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; font-size:12px; font-weight:700; color:white; letter-spacing:.06em; text-transform:uppercase; border-radius:50%; }
  .ms-avatar-wrap.owner:hover .ms-avatar-upload-hint { opacity:1; }

  .ms-bio-section { padding:64px 0; border-bottom:1px solid var(--border); }
  .ms-bio-grid { display:grid; grid-template-columns:260px 1fr; gap:60px; align-items:start; }
  .ms-bio-label { font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); margin:0 0 10px; }
  .ms-bio-featured { display:flex; gap:14px; align-items:flex-start; margin-top:24px; padding-top:24px; border-top:1px solid var(--border); }
  .ms-bio-feat-cover { width:64px; height:90px; border-radius:6px; overflow:hidden; flex-shrink:0; background:var(--bg2); }
  .ms-bio-feat-cover img { width:100%; height:100%; object-fit:cover; }
  .ms-bio-feat-title { font-size:13px; font-weight:600; color:var(--text); margin:0 0 4px; line-height:1.3; }
  .ms-bio-feat-genre { font-size:11px; color:var(--gold); font-weight:600; margin:0 0 8px; letter-spacing:.06em; }
  .ms-bio-feat-link { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--gold); border:1px solid var(--gold); padding:5px 11px; border-radius:6px; display:inline-block; transition:background .18s,color .18s; }
  .ms-bio-feat-link:hover { background:var(--gold); color:var(--btn-text); }
  .ms-bio-text { font-size:clamp(16px,1.6vw,19px); color:var(--text); line-height:1.8; font-weight:300; letter-spacing:-.008em; margin:0; white-space:pre-wrap; }

  .ms-section { padding:64px 0; }
  .ms-section+.ms-section { border-top:1px solid var(--border); }
  .ms-section-head { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:36px; gap:12px; flex-wrap:wrap; }
  .ms-section-title { font-size:clamp(28px,3vw,40px); font-weight:300; letter-spacing:-.025em; color:var(--text); margin:0; }
  .ms-section-count { font-size:12px; color:var(--text2); }
  .ms-add-btn { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:8px 15px; border:1px solid var(--gold); color:var(--gold); border-radius:8px; background:transparent; cursor:pointer; transition:background .18s,color .18s; }
  .ms-add-btn:hover { background:var(--gold); color:var(--btn-text); }

  .ms-books { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .ms-book-card { background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .25s,transform .25s; }
  .ms-book-card:hover { border-color:var(--gold); transform:translateY(-4px); }
  .ms-book-cover { width:100%; aspect-ratio:2/3; background:var(--bg2); overflow:hidden; }
  .ms-book-cover img { width:100%; height:100%; object-fit:cover; }
  .ms-book-no-cover { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:48px; color:var(--gold); opacity:.2; }
  .ms-book-body { padding:18px 20px 22px; flex:1; display:flex; flex-direction:column; gap:7px; }
  .ms-book-genre { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); }
  .ms-book-title { font-size:17px; font-weight:500; color:var(--text); letter-spacing:-.015em; margin:0; line-height:1.25; }
  .ms-book-desc { font-size:12px; color:var(--text2); line-height:1.6; flex:1; margin:0; }
  .ms-book-buy { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--btn-text); background:var(--gold); padding:9px 16px; border-radius:8px; margin-top:10px; transition:opacity .18s; align-self:flex-start; }
  .ms-book-buy:hover { opacity:.86; }
  .ms-book-coming { font-size:11px; color:var(--text2); margin-top:10px; font-style:italic; }

  .ms-event-card { display:grid; grid-template-columns:76px 1fr auto; gap:20px; align-items:center; padding:20px 24px; background:var(--card); border:1px solid var(--border); border-radius:14px; margin-bottom:14px; transition:border-color .2s; }
  .ms-event-card:hover { border-color:var(--gold); }
  .ms-event-card.past { opacity:.5; }
  .ms-event-datebox { text-align:center; background:var(--gold2); border:1px solid var(--gold); border-radius:10px; padding:10px 4px; }
  .ms-event-day { font-size:28px; font-weight:700; color:var(--gold); line-height:1; }
  .ms-event-mon { font-size:9px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); opacity:.7; margin-top:2px; }
  .ms-event-title { font-size:16px; font-weight:500; color:var(--text); margin:0 0 4px; }
  .ms-event-meta { font-size:12px; color:var(--text2); margin:0; line-height:1.5; }
  .ms-event-badge { font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:2px 7px; border-radius:5px; background:var(--gold2); color:var(--gold); margin-left:6px; }
  .ms-ticket-btn { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--gold); border:1px solid var(--gold); padding:8px 14px; border-radius:8px; white-space:nowrap; transition:background .18s,color .18s; }
  .ms-ticket-btn:hover { background:var(--gold); color:var(--btn-text); }
  .ms-event-del { font-size:11px; color:rgba(200,50,50,.6); background:none; border:none; cursor:pointer; padding:4px 8px; }
  .ms-event-del:hover { color:red; }

  .ms-gallery { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .ms-gal-item { position:relative; border-radius:12px; overflow:hidden; background:var(--bg2); aspect-ratio:1; }
  .ms-gal-item img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
  .ms-gal-item:hover img { transform:scale(1.06); }
  .ms-gal-caption { position:absolute; bottom:0; left:0; right:0; padding:28px 14px 12px; background:linear-gradient(transparent,rgba(0,0,0,.68)); font-size:12px; color:white; opacity:0; transition:opacity .25s; }
  .ms-gal-item:hover .ms-gal-caption { opacity:1; }
  .ms-gal-del { position:absolute; top:8px; right:8px; background:rgba(0,0,0,.6); color:white; border:none; border-radius:6px; width:26px; height:26px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
  .ms-gal-item:hover .ms-gal-del { opacity:1; }
  .ms-gal-upload { aspect-ratio:1; border:2px dashed var(--border); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:border-color .2s; background:var(--card); }
  .ms-gal-upload:hover { border-color:var(--gold); }

  .ms-press-card { display:flex; gap:20px; align-items:flex-start; padding:22px 24px; background:var(--card); border:1px solid var(--border); border-radius:14px; margin-bottom:14px; transition:border-color .2s; }
  .ms-press-card:hover { border-color:var(--gold); }
  .ms-press-body { flex:1; min-width:0; }
  .ms-press-outlet { font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); margin:0 0 6px; }
  .ms-press-headline { font-size:16px; font-weight:500; color:var(--text); line-height:1.35; margin:0 0 8px; }
  .ms-press-excerpt { font-size:13px; color:var(--text2); line-height:1.6; margin:0 0 8px; font-style:italic; }
  .ms-press-date { font-size:11px; color:var(--text2); margin:0; }
  .ms-press-link { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--gold); border:1px solid var(--gold); padding:8px 14px; border-radius:8px; white-space:nowrap; flex-shrink:0; transition:background .18s,color .18s; align-self:flex-start; }
  .ms-press-link:hover { background:var(--gold); color:var(--btn-text); }
  .ms-press-del { font-size:11px; color:rgba(200,50,50,.6); background:none; border:none; cursor:pointer; align-self:flex-start; padding:4px; }
  .ms-press-del:hover { color:red; }

  .ms-contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:start; }
  .ms-contact-info-label { font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin:0 0 10px; }
  .ms-contact-form { display:flex; flex-direction:column; gap:14px; }
  .ms-cf-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .ms-cf-input { width:100%; padding:12px 16px; background:var(--card); border:1px solid var(--border); border-radius:10px; color:var(--text); font-size:14px; outline:none; font-family:inherit; transition:border-color .2s; }
  .ms-cf-input:focus { border-color:var(--gold); }
  .ms-cf-textarea { min-height:130px; resize:vertical; }
  .ms-cf-submit { align-self:flex-start; padding:13px 28px; font-size:13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:var(--gold); color:var(--btn-text); border:none; border-radius:10px; cursor:pointer; transition:opacity .18s; font-family:inherit; }
  .ms-cf-submit:hover { opacity:.88; }
  .ms-cf-submit:disabled { opacity:.4; cursor:not-allowed; }
  .ms-presskit-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; border:1px solid var(--gold); color:var(--gold); border-radius:10px; transition:background .2s,color .2s; margin-top:14px; }
  .ms-presskit-btn:hover { background:var(--gold); color:var(--btn-text); }

  .ms-edit-panel { position:fixed; top:0; right:0; bottom:0; width:420px; z-index:300; background:var(--nav-bg); border-left:1px solid var(--border); backdrop-filter:blur(16px); overflow-y:auto; padding:28px 28px 48px; box-shadow:-12px 0 48px rgba(0,0,0,.22); display:flex; flex-direction:column; gap:20px; }
  .ms-ep-title { font-size:15px; font-weight:700; color:var(--text); margin:0; }
  .ms-ep-close { background:none; border:none; font-size:20px; cursor:pointer; color:var(--text2); margin-left:auto; padding:4px; transition:color .2s; }
  .ms-ep-close:hover { color:var(--text); }
  .ms-ep-field { display:flex; flex-direction:column; gap:6px; }
  .ms-ep-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--text2); }
  .ms-ep-input { width:100%; padding:10px 14px; background:var(--card); border:1px solid var(--border); border-radius:9px; color:var(--text); font-size:13px; outline:none; font-family:inherit; transition:border-color .2s; }
  .ms-ep-input:focus { border-color:var(--gold); }
  .ms-ep-textarea { min-height:110px; resize:vertical; }
  .ms-ep-divider { height:1px; background:var(--border); margin:4px 0; }
  .ms-ep-save { padding:11px 22px; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:var(--gold); color:var(--btn-text); border:none; border-radius:9px; cursor:pointer; transition:opacity .18s; font-family:inherit; }
  .ms-ep-save:disabled { opacity:.4; cursor:not-allowed; }

  .ms-add-form { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px 22px; margin-bottom:20px; }
  .ms-add-form-title { font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text2); margin:0 0 16px; }
  .ms-af-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .ms-af-field { display:flex; flex-direction:column; gap:6px; }
  .ms-af-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--text2); }
  .ms-af-input { width:100%; padding:9px 13px; background:var(--bg); border:1px solid var(--border); border-radius:8px; color:var(--text); font-size:12px; outline:none; font-family:inherit; transition:border-color .2s; }
  .ms-af-input:focus { border-color:var(--gold); }
  .ms-af-textarea { min-height:70px; resize:vertical; }
  .ms-af-actions { display:flex; gap:10px; }
  .ms-af-save { padding:9px 18px; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:var(--gold); color:var(--btn-text); border:none; border-radius:8px; cursor:pointer; transition:opacity .18s; font-family:inherit; }
  .ms-af-save:disabled { opacity:.4; cursor:not-allowed; }
  .ms-af-cancel { padding:9px 16px; font-size:11px; font-weight:700; background:none; border:1px solid var(--border); border-radius:8px; color:var(--text2); cursor:pointer; font-family:inherit; }

  .ms-empty { text-align:center; padding:60px 0; color:var(--text2); }
  .ms-empty-sub { font-size:13px; opacity:.7; margin-top:6px; }

  .ms-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:400; background:var(--text); color:var(--bg); padding:11px 22px; border-radius:10px; font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.25); animation:ms-ti .2s ease; }
  @keyframes ms-ti { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media(max-width:960px) {
    .ms-hero-inner { flex-direction:column-reverse; gap:32px; text-align:center; }
    .ms-hero-socials { justify-content:center; }
    .ms-avatar-wrap { width:160px; height:160px; }
    .ms-bio-grid { grid-template-columns:1fr; gap:32px; }
    .ms-books { grid-template-columns:repeat(2,1fr); }
    .ms-gallery { grid-template-columns:repeat(2,1fr); }
    .ms-event-card { grid-template-columns:70px 1fr; }
    .ms-contact-grid { grid-template-columns:1fr; gap:36px; }
    .ms-topbar { padding:0 16px; }
    .ms-pc { padding:0 20px; }
    .ms-tabs { max-width:100%; }
    .ms-edit-panel { width:100%; }
  }
  @media(max-width:560px) {
    .ms-books { grid-template-columns:1fr; }
    .ms-gallery { grid-template-columns:repeat(2,1fr); }
    .ms-topbar { flex-wrap:wrap; height:auto; padding:10px 16px; gap:6px; }
    .ms-tab { font-size:10px; }
    .ms-af-grid { grid-template-columns:1fr; }
    .ms-cf-row { grid-template-columns:1fr; }
    .ms-editbar { padding:10px 16px; }
  }
`

const IconX  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
const IconIG = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
const IconLI = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const IconWeb = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>

const SOCIAL_ICONS:   Record<string, React.ReactNode> = { twitter: <IconX />, instagram: <IconIG />, linkedin: <IconLI />, website: <IconWeb /> }
const SOCIAL_LABELS:  Record<string, string>           = { twitter: "Twitter / X", instagram: "Instagram", linkedin: "LinkedIn", website: "Website" }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface Props {
  author:  AuthorData
  books:   BookData[]
  events:  EventData[]
  gallery: GalleryData[]
  press:   PressData[]
}

export default function AuthorMinisite({ author, books, events, gallery: galleryInit, press: pressInit }: Props) {
  const [activeTab,      setActiveTab]      = useState<Tab>("home")
  const [template,       setTemplate]       = useState<AuthorData["template"]>(author.template)
  const [showTplPanel,   setShowTplPanel]   = useState(false)
  const [isOwner,        setIsOwner]        = useState(false)
  const [userId,         setUserId]         = useState<string | null>(null)
  const [toast,          setToast]          = useState<string | null>(null)
  const [galleryItems,   setGalleryItems]   = useState<GalleryData[]>(galleryInit)
  const [pressItems,     setPressItems]     = useState<PressData[]>(pressInit)
  const [eventItems,     setEventItems]     = useState<EventData[]>(events)
  const [showEditPanel,  setShowEditPanel]  = useState(false)
  const [editBio,        setEditBio]        = useState(author.bio ?? "")
  const [editTagline,    setEditTagline]    = useState(author.tagline ?? "")
  const [editSocials,    setEditSocials]    = useState<Record<string,string>>(author.social_links ?? {})
  const [saving,         setSaving]         = useState(false)
  const [profileMsg,     setProfileMsg]     = useState("")
  const [photoUrl,       setPhotoUrl]       = useState(author.photo_url)
  const [uploading,      setUploading]      = useState(false)
  const [galUploading,   setGalUploading]   = useState(false)
  const [showEventForm,  setShowEventForm]  = useState(false)
  const [showPressForm,  setShowPressForm]  = useState(false)
  const [addingEvt,      setAddingEvt]      = useState(false)
  const [addingPr,       setAddingPr]       = useState(false)
  const [cfName,         setCfName]         = useState("")
  const [cfEmail,        setCfEmail]        = useState("")
  const [cfSubject,      setCfSubject]      = useState("")
  const [cfMsg,          setCfMsg]          = useState("")
  const [cfSending,      setCfSending]      = useState(false)
  const [cfSent,         setCfSent]         = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)
  const galRef   = useRef<HTMLInputElement>(null)

  const EMPTY_EVT = { title: "", description: "", location: "", event_date: "", event_time: "", ticket_url: "", is_virtual: false }
  const EMPTY_PR  = { outlet: "", headline: "", url: "", published_at: "", excerpt: "" }
  const [evtDraft, setEvtDraft] = useState(EMPTY_EVT)
  const [prDraft,  setPrDraft]  = useState(EMPTY_PR)

  /* Template lock */
  const tplLocked = (() => {
    if (!author.template_chosen_at) return false
    const unlockAt = new Date(new Date(author.template_chosen_at).getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
    return new Date() < unlockAt
  })()
  const tplUnlockDate = (() => {
    if (!author.template_chosen_at) return null
    const unlockAt = new Date(new Date(author.template_chosen_at).getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
    return unlockAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  })()

  const featuredBook = author.featured_book_id ? books.find(b => b.id === author.featured_book_id) ?? null : null
  const today = new Date().toISOString().slice(0, 10)

  /* Auth check */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null
      setUserId(uid)
      if (uid && author.user_id && uid === author.user_id) setIsOwner(true)
    })
  }, [author.user_id])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3200) }

  /* Photo upload */
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploading(true)
    const ext  = file.name.split(".").pop()
    const path = `${userId}/photo.${ext}`
    const { error: upErr } = await supabase.storage.from("author-photos").upload(path, file, { upsert: true })
    if (upErr) { showToast(upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from("author-photos").getPublicUrl(path)
    const { error } = await supabase.from("authors").update({ photo_url: publicUrl }).eq("id", author.id)
    if (!error) { setPhotoUrl(publicUrl); showToast("Photo updated") } else showToast(error.message)
    setUploading(false)
  }

  /* Save profile */
  async function saveProfile() {
    setSaving(true); setProfileMsg("")
    const { error } = await supabase.from("authors").update({ bio: editBio || null, tagline: editTagline || null, social_links: editSocials, updated_at: new Date().toISOString() }).eq("id", author.id)
    if (!error) { showToast("Profile saved"); setShowEditPanel(false) } else setProfileMsg(error.message)
    setSaving(false)
  }

  /* Template change */
  async function changeTemplate(tpl: AuthorData["template"]) {
    if (tplLocked) return
    setTemplate(tpl)
    await supabase.from("authors").update({ template: tpl, template_chosen_at: new Date().toISOString() }).eq("id", author.id)
    setShowTplPanel(false); showToast("Template updated — locked for 6 months")
  }

  /* Add event */
  async function addEvent() {
    if (!evtDraft.title.trim() || !evtDraft.event_date) return
    setAddingEvt(true)
    const { data, error } = await supabase.from("author_events")
      .insert({ author_id: author.id, title: evtDraft.title, description: evtDraft.description || null, location: evtDraft.location || null, event_date: evtDraft.event_date, event_time: evtDraft.event_time || null, ticket_url: evtDraft.ticket_url || null, is_virtual: evtDraft.is_virtual })
      .select("id, title, description, location, event_date, event_time, ticket_url, is_virtual").single()
    if (!error && data) { setEventItems(p => [...p, data as EventData].sort((a, b) => a.event_date.localeCompare(b.event_date))); showToast("Event added"); setShowEventForm(false); setEvtDraft(EMPTY_EVT) }
    else showToast(error?.message ?? "Error")
    setAddingEvt(false)
  }

  async function deleteEvent(id: string) {
    if (!confirm("Remove this event?")) return
    await supabase.from("author_events").delete().eq("id", id)
    setEventItems(p => p.filter(e => e.id !== id)); showToast("Event removed")
  }

  /* Gallery upload */
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setGalUploading(true)
    const path = `${userId}/${Date.now()}_${file.name}`
    const { error: upErr } = await supabase.storage.from("author-gallery").upload(path, file)
    if (upErr) { showToast(upErr.message); setGalUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from("author-gallery").getPublicUrl(path)
    const { data, error } = await supabase.from("author_gallery").insert({ author_id: author.id, image_url: publicUrl, sort_order: galleryItems.length }).select("id, image_url, caption, sort_order").single()
    if (!error && data) { setGalleryItems(p => [...p, data as GalleryData]); showToast("Photo added") } else showToast(error?.message ?? "Error")
    setGalUploading(false)
  }

  async function deleteGallery(id: string) {
    if (!confirm("Remove this photo?")) return
    await supabase.from("author_gallery").delete().eq("id", id)
    setGalleryItems(p => p.filter(g => g.id !== id)); showToast("Photo removed")
  }

  /* Add press */
  async function addPress() {
    if (!prDraft.outlet.trim() || !prDraft.headline.trim()) return
    setAddingPr(true)
    const { data, error } = await supabase.from("author_press")
      .insert({ author_id: author.id, outlet: prDraft.outlet, headline: prDraft.headline, url: prDraft.url || null, published_at: prDraft.published_at || null, excerpt: prDraft.excerpt || null })
      .select("id, outlet, headline, url, published_at, excerpt").single()
    if (!error && data) { setPressItems(p => [data as PressData, ...p]); showToast("Press item added"); setShowPressForm(false); setPrDraft(EMPTY_PR) }
    else showToast(error?.message ?? "Error")
    setAddingPr(false)
  }

  async function deletePress(id: string) {
    if (!confirm("Remove?")) return
    await supabase.from("author_press").delete().eq("id", id)
    setPressItems(p => p.filter(x => x.id !== id)); showToast("Removed")
  }

  /* Send inquiry */
  async function sendInquiry(e: React.FormEvent) {
    e.preventDefault()
    setCfSending(true)
    const { error } = await supabase.from("author_inquiries").insert({ author_id: author.id, sender_name: cfName, sender_email: cfEmail, subject: cfSubject || null, message: cfMsg })
    if (!error) { setCfSent(true) } else { showToast(error.message) }
    setCfSending(false)
  }

  /* ─── Tab content helpers ─── */
  const upcomingEvents = eventItems.filter(e => e.event_date >= today)
  const pastEvents     = eventItems.filter(e => e.event_date < today)

  function EventCard({ evt, showDel }: { evt: EventData; showDel: boolean }) {
    const d = new Date(evt.event_date + "T12:00:00")
    return (
      <div className="ms-event-card">
        <div className="ms-event-datebox">
          <div className="ms-event-day">{d.getDate()}</div>
          <div className="ms-event-mon">{d.toLocaleString("en-US", { month: "short" })}</div>
        </div>
        <div>
          <p className="ms-event-title">{evt.title}{evt.is_virtual && <span className="ms-event-badge">Virtual</span>}</p>
          <p className="ms-event-meta">
            {evt.location ?? ""}{evt.event_time ? ` · ${evt.event_time}` : ""}
            {evt.description ? <><br /><span style={{ opacity: .7 }}>{evt.description}</span></> : null}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {evt.ticket_url && <a href={evt.ticket_url} target="_blank" rel="noopener noreferrer" className="ms-ticket-btn">Tickets →</a>}
          {showDel && <button className="ms-event-del" onClick={() => deleteEvent(evt.id)}>✕ Remove</button>}
        </div>
      </div>
    )
  }

  /* ─── Render ─── */
  return (
    <div className={`ms-page ${body.className}`} data-tpl={template}>
      <style dangerouslySetInnerHTML={{ __html: TPL_CSS }} />

      {toast && <div className="ms-toast">{toast}</div>}

      {/* Owner bar */}
      {isOwner && (
        <div className="ms-editbar">
          <div className="ms-editbar-dot" />
          <span>Your minisite</span>
          <button className="ms-edit-btn" onClick={() => setShowEditPanel(true)}>Edit Profile</button>
          <button className={`ms-edit-btn ${showTplPanel ? "active" : ""}`} onClick={() => setShowTplPanel(p => !p)}>
            {tplLocked ? "Design (locked)" : "Design"}
          </button>
          <a href="/portal" className="ms-edit-btn" style={{ textDecoration: "none" }}>Portal →</a>
        </div>
      )}

      {/* Topbar */}
      <nav className="ms-topbar">
        <Link href="/authors" className="ms-back">← Authors</Link>
        <div className="ms-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ms-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ms-topbar-right" />
      </nav>

      {/* Template picker */}
      {showTplPanel && isOwner && (
        <div className="ms-tpl-panel">
          <p className="ms-tpl-panel-title">Template</p>
          {(["classic", "bold", "minimal"] as const).map(tpl => (
            <div key={tpl} className={`ms-tpl-opt ${template === tpl ? "active" : ""}`}
              style={{ opacity: tplLocked && template !== tpl ? 0.4 : 1, cursor: tplLocked && template !== tpl ? "not-allowed" : "pointer" }}
              onClick={() => changeTemplate(tpl)}>
              <div className="ms-tpl-swatch" style={{ background: TPL_SWATCHES[tpl] }} />
              <span className="ms-tpl-opt-label">{tpl.charAt(0).toUpperCase() + tpl.slice(1)}</span>
            </div>
          ))}
          {tplLocked && tplUnlockDate && (
            <p className="ms-tpl-locked">Locked until<br />{tplUnlockDate}</p>
          )}
        </div>
      )}

      {/* ══ HOME ══ */}
      {activeTab === "home" && (
        <>
          <section className="ms-hero">
            <div className="ms-hero-inner">
              <div className="ms-hero-text">
                <span className="ms-hero-kicker">Sankofa Publishers</span>
                <h1 className={`${display.className} ms-hero-name`}>{author.name}</h1>
                {(editTagline || author.tagline) && (
                  <p className="ms-hero-tagline">{isOwner ? editTagline : (author.tagline ?? "")}</p>
                )}
                <div className="ms-hero-socials">
                  {Object.entries(isOwner ? editSocials : (author.social_links ?? {})).filter(([, v]) => v).map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="ms-social-link">
                      {SOCIAL_ICONS[k] ?? null}{SOCIAL_LABELS[k] ?? k}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <input type="file" ref={photoRef} accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
                <div className={`ms-avatar-wrap ${isOwner ? "owner" : ""}`} onClick={() => isOwner && photoRef.current?.click()}>
                  {photoUrl
                    ? <img src={photoUrl} alt={author.name} />
                    : <div className={`${display.className} ms-avatar-initials`}>{author.name.slice(0, 2).toUpperCase()}</div>
                  }
                  {isOwner && <div className="ms-avatar-upload-hint">{uploading ? "Uploading…" : "Change Photo"}</div>}
                </div>
              </div>
            </div>
          </section>

          {(author.bio || featuredBook) && (
            <section className="ms-bio-section">
              <div className="ms-pc">
                <div className="ms-bio-grid">
                  <div>
                    <p className="ms-bio-label">About</p>
                    {featuredBook && (
                      <div className="ms-bio-featured">
                        <div className="ms-bio-feat-cover">
                          {featuredBook.cover_url
                            ? <img src={featuredBook.cover_url} alt={featuredBook.title} />
                            : <div style={{ width: "100%", height: "100%", background: "var(--bg3)" }} />
                          }
                        </div>
                        <div>
                          <p className="ms-bio-feat-genre">{featuredBook.genre ?? "Featured"}</p>
                          <p className="ms-bio-feat-title">{featuredBook.title}</p>
                          {featuredBook.buy_link && (
                            <a href={featuredBook.buy_link} target="_blank" rel="noopener noreferrer" className="ms-bio-feat-link">Buy →</a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {author.bio && <p className="ms-bio-text">{author.bio}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {books.length > 0 && (
            <section className="ms-section">
              <div className="ms-pc">
                <div className="ms-section-head">
                  <h2 className={`${display.className} ms-section-title`}>Books</h2>
                  <button onClick={() => setActiveTab("books")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>View all →</button>
                </div>
                <div className="ms-books">
                  {books.slice(0, 3).map(book => (
                    <div key={book.id} className="ms-book-card">
                      <div className="ms-book-cover">{book.cover_url ? <img src={book.cover_url} alt={book.title} /> : <div className="ms-book-no-cover">📖</div>}</div>
                      <div className="ms-book-body">
                        {book.genre && <span className="ms-book-genre">{book.genre}</span>}
                        <h3 className={`${display.className} ms-book-title`}>{book.title}</h3>
                        {book.description && <p className="ms-book-desc">{book.description}</p>}
                        {book.buy_link ? <a href={book.buy_link} target="_blank" rel="noopener noreferrer" className="ms-book-buy">Buy Now →</a> : <span className="ms-book-coming">Coming soon</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section className="ms-section">
              <div className="ms-pc">
                <div className="ms-section-head">
                  <h2 className={`${display.className} ms-section-title`}>Upcoming Events</h2>
                  <button onClick={() => setActiveTab("events")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>All events →</button>
                </div>
                {upcomingEvents.slice(0, 2).map(evt => <EventCard key={evt.id} evt={evt} showDel={false} />)}
              </div>
            </section>
          )}
        </>
      )}

      {/* ══ BOOKS ══ */}
      {activeTab === "books" && (
        <section className="ms-section">
          <div className="ms-pc">
            <div className="ms-section-head">
              <h2 className={`${display.className} ms-section-title`}>Books</h2>
              <span className="ms-section-count">{books.length} title{books.length !== 1 ? "s" : ""}</span>
            </div>
            {books.length === 0 ? (
              <div className="ms-empty">
                <p>No books published yet.</p>
                {isOwner && <p className="ms-empty-sub">Your publisher adds books to your profile.</p>}
              </div>
            ) : (
              <div className="ms-books">
                {books.map(book => (
                  <div key={book.id} className="ms-book-card">
                    <div className="ms-book-cover">{book.cover_url ? <img src={book.cover_url} alt={book.title} /> : <div className="ms-book-no-cover">📖</div>}</div>
                    <div className="ms-book-body">
                      {book.genre && <span className="ms-book-genre">{book.genre}</span>}
                      <h3 className={`${display.className} ms-book-title`}>{book.title}</h3>
                      {book.description && <p className="ms-book-desc">{book.description}</p>}
                      {book.published_at && <p style={{ fontSize: 11, color: "var(--text2)", margin: 0 }}>{fmtDate(book.published_at)}</p>}
                      {book.buy_link ? <a href={book.buy_link} target="_blank" rel="noopener noreferrer" className="ms-book-buy">Buy Now →</a> : <span className="ms-book-coming">Coming soon</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ EVENTS ══ */}
      {activeTab === "events" && (
        <section className="ms-section">
          <div className="ms-pc">
            <div className="ms-section-head">
              <h2 className={`${display.className} ms-section-title`}>Events</h2>
              {isOwner && !showEventForm && <button className="ms-add-btn" onClick={() => setShowEventForm(true)}>+ Add Event</button>}
            </div>

            {showEventForm && isOwner && (
              <div className="ms-add-form">
                <p className="ms-add-form-title">New Event</p>
                <div className="ms-af-grid">
                  {[
                    { label: "Title *", key: "title", ph: "Reading, launch, signing…" },
                    { label: "Date *", key: "event_date", type: "date", ph: "" },
                    { label: "Time", key: "event_time", ph: "7:00 PM EST" },
                    { label: "Location", key: "location", ph: "City, venue or Online" },
                    { label: "Ticket URL", key: "ticket_url", ph: "https://…" },
                  ].map(f => (
                    <div key={f.key} className="ms-af-field">
                      <label className="ms-af-label">{f.label}</label>
                      <input className="ms-af-input" type={f.type ?? "text"} placeholder={f.ph}
                        value={(evtDraft as unknown as Record<string, string>)[f.key] ?? ""}
                        onChange={e => setEvtDraft(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="ms-af-field" style={{ gridColumn: "1/-1" }}>
                    <label className="ms-af-label">Description</label>
                    <textarea className="ms-af-input ms-af-textarea" placeholder="Optional details" value={evtDraft.description} onChange={e => setEvtDraft(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="ms-af-field">
                    <label className="ms-af-label" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={evtDraft.is_virtual} onChange={e => setEvtDraft(p => ({ ...p, is_virtual: e.target.checked }))} />
                      Virtual Event
                    </label>
                  </div>
                </div>
                <div className="ms-af-actions">
                  <button className="ms-af-save" disabled={addingEvt || !evtDraft.title || !evtDraft.event_date} onClick={addEvent}>{addingEvt ? "Adding…" : "Add Event"}</button>
                  <button className="ms-af-cancel" onClick={() => { setShowEventForm(false); setEvtDraft(EMPTY_EVT) }}>Cancel</button>
                </div>
              </div>
            )}

            {eventItems.length === 0 ? (
              <div className="ms-empty"><p>No events scheduled.</p></div>
            ) : (
              <>
                {upcomingEvents.length > 0 && (
                  <div style={{ marginBottom: 40 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 16px" }}>Upcoming</p>
                    {upcomingEvents.map(evt => <EventCard key={evt.id} evt={evt} showDel={isOwner} />)}
                  </div>
                )}
                {pastEvents.length > 0 && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text2)", margin: "0 0 16px" }}>Past</p>
                    {pastEvents.map(evt => (
                      <div key={evt.id} className="ms-event-card past">
                        <div className="ms-event-datebox">
                          <div className="ms-event-day">{new Date(evt.event_date + "T12:00:00").getDate()}</div>
                          <div className="ms-event-mon">{new Date(evt.event_date + "T12:00:00").toLocaleString("en-US", { month: "short" })}</div>
                        </div>
                        <div>
                          <p className="ms-event-title">{evt.title}</p>
                          <p className="ms-event-meta">{evt.location ?? ""}{evt.event_time ? ` · ${evt.event_time}` : ""}</p>
                        </div>
                        {isOwner && <button className="ms-event-del" onClick={() => deleteEvent(evt.id)}>✕</button>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ══ GALLERY ══ */}
      {activeTab === "gallery" && (
        <section className="ms-section">
          <div className="ms-pc">
            <div className="ms-section-head">
              <h2 className={`${display.className} ms-section-title`}>Gallery</h2>
              <span className="ms-section-count">{galleryItems.length} photo{galleryItems.length !== 1 ? "s" : ""}</span>
            </div>
            <input type="file" ref={galRef} accept="image/*" style={{ display: "none" }} onChange={handleGalleryUpload} />
            {galleryItems.length === 0 && !isOwner ? (
              <div className="ms-empty"><p>No photos yet.</p></div>
            ) : (
              <div className="ms-gallery">
                {galleryItems.map(img => (
                  <div key={img.id} className="ms-gal-item">
                    <img src={img.image_url} alt={img.caption ?? ""} />
                    {img.caption && <div className="ms-gal-caption">{img.caption}</div>}
                    {isOwner && <button className="ms-gal-del" onClick={() => deleteGallery(img.id)}>✕</button>}
                  </div>
                ))}
                {isOwner && (
                  <div className="ms-gal-upload" onClick={() => !galUploading && galRef.current?.click()}>
                    <span style={{ fontSize: 28, color: "var(--gold)", opacity: .5 }}>+</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", letterSpacing: ".06em" }}>{galUploading ? "Uploading…" : "Add Photo"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ PRESS ══ */}
      {activeTab === "press" && (
        <section className="ms-section">
          <div className="ms-pc">
            <div className="ms-section-head">
              <h2 className={`${display.className} ms-section-title`}>Press</h2>
              {isOwner && !showPressForm && <button className="ms-add-btn" onClick={() => setShowPressForm(true)}>+ Add Coverage</button>}
            </div>

            {showPressForm && isOwner && (
              <div className="ms-add-form">
                <p className="ms-add-form-title">Add Press Coverage</p>
                <div className="ms-af-grid">
                  {[
                    { label: "Outlet *", key: "outlet", ph: "The Guardian, NPR…" },
                    { label: "Headline *", key: "headline", ph: "Article title" },
                    { label: "URL", key: "url", ph: "https://…" },
                    { label: "Published Date", key: "published_at", type: "date", ph: "" },
                  ].map(f => (
                    <div key={f.key} className="ms-af-field">
                      <label className="ms-af-label">{f.label}</label>
                      <input className="ms-af-input" type={f.type ?? "text"} placeholder={f.ph ?? ""}
                        value={(prDraft as Record<string, string>)[f.key] ?? ""}
                        onChange={e => setPrDraft(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="ms-af-field" style={{ gridColumn: "1/-1" }}>
                    <label className="ms-af-label">Excerpt / Pull Quote</label>
                    <textarea className="ms-af-input ms-af-textarea" placeholder="Key quote from the article" value={prDraft.excerpt} onChange={e => setPrDraft(p => ({ ...p, excerpt: e.target.value }))} />
                  </div>
                </div>
                <div className="ms-af-actions">
                  <button className="ms-af-save" disabled={addingPr || !prDraft.outlet || !prDraft.headline} onClick={addPress}>{addingPr ? "Adding…" : "Add"}</button>
                  <button className="ms-af-cancel" onClick={() => { setShowPressForm(false); setPrDraft(EMPTY_PR) }}>Cancel</button>
                </div>
              </div>
            )}

            {author.press_kit_url && (
              <div style={{ marginBottom: 32 }}>
                <a href={author.press_kit_url} target="_blank" rel="noopener noreferrer" className="ms-presskit-btn">↓ Download Press Kit</a>
              </div>
            )}

            {pressItems.length === 0 ? (
              <div className="ms-empty">
                <p>No press coverage yet.</p>
                {isOwner && <p className="ms-empty-sub">Add media mentions and reviews above.</p>}
              </div>
            ) : (
              pressItems.map(item => (
                <div key={item.id} className="ms-press-card">
                  <div className="ms-press-body">
                    <p className="ms-press-outlet">{item.outlet}</p>
                    <p className="ms-press-headline">{item.headline}</p>
                    {item.excerpt && <p className="ms-press-excerpt">&ldquo;{item.excerpt}&rdquo;</p>}
                    {item.published_at && <p className="ms-press-date">{fmtDate(item.published_at)}</p>}
                  </div>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="ms-press-link">Read →</a>}
                  {isOwner && <button className="ms-press-del" onClick={() => deletePress(item.id)}>✕</button>}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ══ CONTACT ══ */}
      {activeTab === "contact" && (
        <section className="ms-section">
          <div className="ms-pc">
            <div className="ms-section-head">
              <h2 className={`${display.className} ms-section-title`}>Contact</h2>
            </div>
            <div className="ms-contact-grid">
              <div>
                <p className="ms-contact-info-label">Get in touch</p>
                <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.75, margin: "0 0 24px" }}>
                  For speaking engagements, media inquiries, event bookings, or general correspondence — use the form to reach {author.name.split(" ")[0]}&apos;s team.
                </p>
                <div className="ms-hero-socials" style={{ marginBottom: 20 }}>
                  {Object.entries(author.social_links ?? {}).filter(([, v]) => v).map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="ms-social-link">
                      {SOCIAL_ICONS[k] ?? null}{SOCIAL_LABELS[k] ?? k}
                    </a>
                  ))}
                </div>
                {author.press_kit_url && (
                  <a href={author.press_kit_url} target="_blank" rel="noopener noreferrer" className="ms-presskit-btn">↓ Press Kit</a>
                )}
              </div>
              <div>
                {cfSent ? (
                  <div style={{ padding: "40px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 22, fontWeight: 300, color: "var(--gold)", marginBottom: 10 }}>Message sent</p>
                    <p style={{ fontSize: 14, color: "var(--text2)" }}>Thank you. We&apos;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form className="ms-contact-form" onSubmit={sendInquiry}>
                    <div className="ms-cf-row">
                      <input className="ms-cf-input" placeholder="Your name" value={cfName} onChange={e => setCfName(e.target.value)} required />
                      <input className="ms-cf-input" type="email" placeholder="Email address" value={cfEmail} onChange={e => setCfEmail(e.target.value)} required />
                    </div>
                    <input className="ms-cf-input" placeholder="Subject (optional)" value={cfSubject} onChange={e => setCfSubject(e.target.value)} />
                    <textarea className="ms-cf-input ms-cf-textarea" placeholder="Your message…" value={cfMsg} onChange={e => setCfMsg(e.target.value)} required />
                    <button className="ms-cf-submit" type="submit" disabled={cfSending}>{cfSending ? "Sending…" : "Send Message"}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ EDIT PROFILE PANEL ══ */}
      {showEditPanel && isOwner && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 299 }} onClick={() => setShowEditPanel(false)} />
          <div className="ms-edit-panel">
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="ms-ep-title">Edit Profile</p>
              <button className="ms-ep-close" onClick={() => setShowEditPanel(false)}>✕</button>
            </div>
            <div style={{ height: 1, background: "var(--border)" }} />
            <div className="ms-ep-field">
              <label className="ms-ep-label">Tagline</label>
              <input className="ms-ep-input" placeholder="A single-line description" maxLength={120} value={editTagline} onChange={e => setEditTagline(e.target.value)} />
              <span style={{ fontSize: 10, color: "var(--text2)", textAlign: "right" }}>{editTagline.length}/120</span>
            </div>
            <div className="ms-ep-field">
              <label className="ms-ep-label">Bio</label>
              <textarea className="ms-ep-input ms-ep-textarea" placeholder="Your author biography…" maxLength={2000} value={editBio} onChange={e => setEditBio(e.target.value)} />
              <span style={{ fontSize: 10, color: "var(--text2)", textAlign: "right" }}>{editBio.length}/2000</span>
            </div>
            <div style={{ height: 1, background: "var(--border)" }} />
            <p className="ms-ep-label">Social Links</p>
            {(["twitter", "instagram", "linkedin", "website"] as const).map(k => (
              <div key={k} className="ms-ep-field">
                <label className="ms-ep-label">{SOCIAL_LABELS[k]}</label>
                <input className="ms-ep-input" placeholder={k === "website" ? "https://yoursite.com" : `https://${k}.com/…`}
                  value={editSocials[k] ?? ""} onChange={e => setEditSocials(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            {profileMsg && <p style={{ fontSize: 12, color: "red", margin: 0 }}>{profileMsg}</p>}
            <button className="ms-ep-save" disabled={saving} onClick={saveProfile}>{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </>
      )}
    </div>
  )
}
