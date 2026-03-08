/* ═══════════════════════════════════════════════════════════
   SHARED ADMIN CSS
   Import and inject via <style dangerouslySetInnerHTML>
═══════════════════════════════════════════════════════════ */

export const adminCss = `
  :root {
    --ink: #0B0B0C; --paper: #F6F3EE; --gold: #C9A227;
    --line: rgba(11,11,12,.09);
    --a-bg:      #080706;
    --a-sidebar: #0a0807;
    --a-card:    rgba(255,255,255,.038);
    --a-border:  rgba(255,255,255,.08);
    --a-text1:   rgba(255,255,255,.82);
    --a-text2:   rgba(255,255,255,.44);
    --a-text3:   rgba(255,255,255,.24);
    --a-gold:    #C9A227;
    --a-goldtint:rgba(201,162,39,.07);
    --a-goldbdr: rgba(201,162,39,.22);
  }
  *, *::before, *::after { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }

  @keyframes shimmer {
    0%  { background-position: -200% center; }
    100%{ background-position:  200% center; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── kicker ── */
  .ak {
    display: block;
    font-size: 10px; letter-spacing: .24em; text-transform: uppercase;
    background: linear-gradient(90deg,#C9A227 0%,#f5d878 42%,#C9A227 58%,#b8860b 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: shimmer 4s linear infinite;
    margin-bottom: 10px;
  }

  /* ── content area ── */
  .a-page {
    background: var(--a-bg);
    min-height: calc(100vh - 72px);
    margin-left: 240px;
    padding: 36px 40px 80px;
    animation: fadeUp .45s ease both;
  }

  /* ── page title ── */
  .a-title {
    font-size: clamp(22px, 2.4vw, 32px);
    font-weight: 300;
    color: white;
    letter-spacing: -0.022em;
    line-height: 1.1;
    margin: 0 0 4px;
  }
  .a-subtitle {
    font-size: 13px;
    color: var(--a-text2);
    margin: 0 0 32px;
  }

  /* ── card ── */
  .a-card {
    background: var(--a-card);
    border: 1px solid var(--a-border);
    border-radius: 16px;
    padding: 24px;
  }
  .a-card-gold {
    background: var(--a-goldtint);
    border-color: var(--a-goldbdr);
  }

  /* ── stat cards ── */
  .a-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .a-stat-num {
    font-size: 38px;
    font-weight: 300;
    color: var(--a-gold);
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 4px;
  }
  .a-stat-label {
    font-size: 12px;
    color: var(--a-text2);
    font-weight: 500;
    letter-spacing: .04em;
  }

  /* ── table ── */
  .a-table-wrap {
    overflow-x: auto;
  }
  .a-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .a-table th {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--a-text3);
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--a-border);
    white-space: nowrap;
  }
  .a-table td {
    padding: 13px 14px;
    border-bottom: 1px solid rgba(255,255,255,.04);
    color: var(--a-text1);
    vertical-align: middle;
  }
  .a-table tr:last-child td { border-bottom: none; }
  .a-table tr:hover td { background: rgba(255,255,255,.02); }

  /* ── status badge ── */
  .a-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; letter-spacing: .06em;
    padding: 3px 10px; border-radius: 99px;
    text-transform: uppercase;
  }
  .a-badge-dot { width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .a-badge-pending     { background:rgba(201,162,39,.12); color:#C9A227; border:1px solid rgba(201,162,39,.2); }
  .a-badge-accepted    { background:rgba(80,200,120,.10); color:rgba(80,200,120,.9); border:1px solid rgba(80,200,120,.18); }
  .a-badge-rejected    { background:rgba(255,80,80,.08);  color:rgba(255,100,100,.85); border:1px solid rgba(255,80,80,.18); }
  .a-badge-conditional { background:rgba(120,160,255,.10);color:rgba(140,180,255,.85); border:1px solid rgba(120,160,255,.18); }
  .a-badge-author      { background:rgba(255,255,255,.06); color:rgba(255,255,255,.45); border:1px solid rgba(255,255,255,.1); }
  .a-badge-super_admin { background:rgba(201,162,39,.18); color:#f5d878; border:1px solid rgba(201,162,39,.35); }
  .a-badge-editor      { background:rgba(120,160,255,.12); color:rgba(160,200,255,.85); border:1px solid rgba(120,160,255,.2); }
  .a-badge-support     { background:rgba(255,255,255,.07); color:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.12); }

  /* ── select (status dropdown) ── */
  .a-select {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 8px;
    color: var(--a-text1);
    font-size: 12px; font-weight: 600;
    padding: 5px 10px;
    cursor: pointer;
    font-family: inherit;
    outline: none;
    transition: border-color .18s;
  }
  .a-select:hover { border-color: rgba(201,162,39,.45); }
  .a-select:focus { border-color: var(--a-gold); }
  .a-select option { background: #1a1710; color: white; }

  /* ── search / filter bar ── */
  .a-search {
    background: rgba(255,255,255,.055);
    border: 1px solid var(--a-border);
    border-radius: 10px;
    color: white;
    font-size: 13px;
    font-family: inherit;
    padding: 10px 14px;
    outline: none;
    transition: border-color .2s;
    width: 280px;
  }
  .a-search::placeholder { color: var(--a-text3); }
  .a-search:focus { border-color: rgba(201,162,39,.45); }

  /* ── filter tabs ── */
  .a-tabs {
    display: flex; gap: 4px; flex-wrap: wrap;
  }
  .a-tab {
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background .18s, color .18s, border-color .18s;
    color: var(--a-text2);
    background: transparent;
    font-family: inherit;
  }
  .a-tab:hover { color: var(--a-text1); background: rgba(255,255,255,.04); }
  .a-tab.active {
    background: rgba(201,162,39,.1);
    border-color: rgba(201,162,39,.3);
    color: var(--a-gold);
  }

  /* ── buttons ── */
  .a-btn-gold {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: 999px;
    background: var(--a-gold); color: #140F05;
    font-size: 13px; font-weight: 700; letter-spacing: .02em;
    border: none; cursor: pointer; font-family: inherit;
    transition: background .2s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 18px rgba(201,162,39,.25);
  }
  .a-btn-gold:hover { background:#d4aa2e; transform:translateY(-2px); box-shadow:0 8px 24px rgba(201,162,39,.38); }

  .a-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 999px;
    background: transparent;
    border: 1px solid rgba(255,255,255,.14);
    color: var(--a-text2);
    font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: color .2s, border-color .2s, background .2s;
  }
  .a-btn-ghost:hover { color: white; border-color: rgba(255,255,255,.35); background: rgba(255,255,255,.05); }

  .a-btn-danger {
    display: inline-flex; align-items: center;
    padding: 7px 14px; border-radius: 8px;
    background: rgba(255,60,60,.08);
    border: 1px solid rgba(255,60,60,.2);
    color: rgba(255,100,100,.8);
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: background .2s, border-color .2s;
  }
  .a-btn-danger:hover { background:rgba(255,60,60,.16); border-color:rgba(255,60,60,.38); }

  /* ── input ── */
  .a-input {
    background: rgba(255,255,255,.055);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 10px;
    color: white;
    font-size: 14px; font-family: inherit;
    padding: 11px 14px; outline: none;
    transition: border-color .2s, box-shadow .2s;
    width: 100%;
  }
  .a-input::placeholder { color: var(--a-text3); }
  .a-input:focus { border-color: rgba(201,162,39,.5); box-shadow: 0 0 0 3px rgba(201,162,39,.07); }

  .a-label {
    display: block;
    font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--a-text3); margin-bottom: 7px;
  }
  .a-field { margin-bottom: 16px; }

  /* ── divider ── */
  .a-divider { height:1px; background: var(--a-border); margin: 0; border:none; }

  /* ── empty state ── */
  .a-empty {
    padding: 52px 24px;
    text-align: center;
    color: var(--a-text3);
    font-size: 13px;
    line-height: 1.7;
  }

  /* ── grain overlay ── */
  .a-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: .016;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
  }

  /* ── toast ── */
  .a-toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: rgba(20,18,12,.97);
    border: 1px solid rgba(201,162,39,.35);
    border-radius: 12px;
    padding: 13px 18px;
    font-size: 13px; color: rgba(255,255,255,.82);
    box-shadow: 0 16px 40px rgba(0,0,0,.55);
    display: flex; align-items: center; gap: 10px;
    animation: fadeUp .3s ease;
  }
  .a-toast-dot { width:8px;height:8px;border-radius:50%;background:#C9A227;flex-shrink:0; }

  /* ── responsive ── */
  @media (max-width: 1024px) {
    .a-page { margin-left: 0; padding: 24px 20px 60px; }
    .a-stats { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .a-stats { grid-template-columns: 1fr 1fr; }
  }
`
