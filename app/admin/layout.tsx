"use client"

/*
 ═══════════════════════════════════════════════════════════
  ADMIN LAYOUT — auth guard + role check + sidebar
 ═══════════════════════════════════════════════════════════

  SUPABASE SETUP — run this SQL in your Supabase SQL Editor:
  ─────────────────────────────────────────────────────────

  -- 1. profiles table
  CREATE TABLE IF NOT EXISTS public.profiles (
    id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email      TEXT,
    full_name  TEXT,
    role       TEXT NOT NULL DEFAULT 'author'
                    CHECK (role IN ('super_admin','editor','support','author')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 2. submissions table
  CREATE TABLE IF NOT EXISTS public.submissions (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name  TEXT,
    title        TEXT NOT NULL DEFAULT 'Untitled Submission',
    synopsis     TEXT,
    path         TEXT CHECK (path IN ('A','B')) DEFAULT 'A',
    status       TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','accepted','rejected','conditional')),
    ai_disclosed BOOLEAN DEFAULT FALSE,
    notes        TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL
  );

  -- 3. Auto-create profile on signup
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'author')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

  -- 4. Row Level Security
  ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

  -- 5. RLS: profiles
  CREATE POLICY "own profile read"
    ON public.profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "admin read all profiles"
    ON public.profiles FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
    );
  CREATE POLICY "super_admin update profiles"
    ON public.profiles FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND p.role = 'super_admin')
    );
  CREATE POLICY "own profile update"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

  -- 6. RLS: submissions
  CREATE POLICY "authors read own"
    ON public.submissions FOR SELECT USING (author_id = auth.uid());
  CREATE POLICY "authors insert own"
    ON public.submissions FOR INSERT WITH CHECK (author_id = auth.uid());
  CREATE POLICY "admin read all submissions"
    ON public.submissions FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
    );
  CREATE POLICY "editors update submissions"
    ON public.submissions FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
    );

  -- 7. Promote first super admin (replace with your email)
  -- UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your@email.com';
*/

import React, { useEffect, useState } from "react"
import { Fraunces, Inter } from "next/font/google"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AdminContext, type AdminRole, type AdminUser } from "./_context"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body    = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

const sidebarCss = `
  .a-sidebar {
    position: fixed;
    top: 72px; left: 0; bottom: 0;
    width: 240px;
    background: #090705;
    border-right: 1px solid rgba(201,162,39,.1);
    display: flex;
    flex-direction: column;
    z-index: 200;
    overflow-y: auto;
  }

  .a-sidebar-brand {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    flex-shrink: 0;
  }
  .a-sidebar-brand-name {
    font-size: 13px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: white; line-height: 1; margin-bottom: 3px;
  }
  .a-sidebar-brand-sub {
    font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
    color: rgba(201,162,39,.6); font-weight: 500;
  }

  .a-sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex; flex-direction: column; gap: 2px;
  }

  .a-nav-group-label {
    font-size: 9px; font-weight: 700; letter-spacing: .28em;
    text-transform: uppercase; color: rgba(201,162,39,.4);
    padding: 14px 8px 6px; display: block;
  }

  .a-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,.50);
    text-decoration: none;
    transition: color .18s, background .18s;
    position: relative;
  }
  .a-nav-link:hover {
    color: rgba(255,255,255,.78);
    background: rgba(255,255,255,.04);
  }
  .a-nav-link.active {
    color: #C9A227;
    background: rgba(201,162,39,.08);
  }
  .a-nav-link.active::before {
    content: '';
    position: absolute; left: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 18px;
    background: #C9A227;
    border-radius: 0 3px 3px 0;
  }
  .a-nav-icon {
    width: 16px; text-align: center; flex-shrink: 0;
    font-size: 13px; opacity: .7;
  }
  .a-nav-link.active .a-nav-icon { opacity: 1; }

  .a-sidebar-bottom {
    padding: 16px 14px;
    border-top: 1px solid rgba(255,255,255,.06);
    flex-shrink: 0;
  }
  .a-user-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
  }
  .a-user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(201,162,39,.15);
    border: 1px solid rgba(201,162,39,.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #C9A227;
    flex-shrink: 0;
  }
  .a-user-name {
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,.78);
    line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .a-user-role {
    font-size: 10px; color: rgba(201,162,39,.65); font-weight: 500;
    letter-spacing: .08em;
  }
  .a-signout-btn {
    width: 100%; padding: 9px 12px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; color: rgba(255,255,255,.42);
    font-size: 12px; font-weight: 500; font-family: inherit;
    cursor: pointer; text-align: left;
    transition: color .18s, background .18s, border-color .18s;
    display: flex; align-items: center; gap: 8px;
  }
  .a-signout-btn:hover { color: white; background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.16); }

  /* loading screen */
  .a-loading {
    position: fixed; inset: 0;
    background: #080706;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  }
  .a-loading-text {
    font-size: 13px; color: rgba(255,255,255,.3);
    letter-spacing: .14em; text-transform: uppercase;
  }

  @media (max-width: 1024px) {
    .a-sidebar { display: none; }
  }
`

const ALLOWED_ROLES: AdminRole[] = ["super_admin", "editor", "support"]

const NAV = [
  { label: "Dashboard",   href: "/admin",             icon: "⊞", roles: ALLOWED_ROLES },
  { label: "Authors",     href: "/admin/authors",      icon: "◉", roles: ALLOWED_ROLES },
  { label: "Submissions", href: "/admin/submissions",  icon: "✎", roles: ALLOWED_ROLES },
  { label: "Staff",       href: "/admin/staff",        icon: "✦", roles: ["super_admin"] as AdminRole[] },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user,    setUser]    = useState<AdminUser | null>(null)
  const [status,  setStatus]  = useState<"loading" | "authorized" | "denied">("loading")

  useEffect(() => {
    async function check() {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user
      if (!sessionUser) { router.replace("/"); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", sessionUser.id)
        .single()

      const role = profile?.role as AdminRole | undefined
      if (!role || !ALLOWED_ROLES.includes(role)) {
        router.replace("/")
        return
      }

      setUser({
        id:    sessionUser.id,
        email: sessionUser.email ?? "",
        name:  profile?.full_name ?? sessionUser.email?.split("@")[0] ?? "Admin",
        role,
      })
      setStatus("authorized")
    }
    check()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (status === "loading") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: sidebarCss }} />
        <div className={`a-loading ${body.className}`}>
          <span className="a-loading-text">Verifying access…</span>
        </div>
      </>
    )
  }

  const initials = user!.name.slice(0, 2).toUpperCase()
  const roleLabel = {
    super_admin: "Super Admin",
    editor:      "Editor",
    support:     "Support",
  }[user!.role]

  return (
    <AdminContext.Provider value={user}>
      <style dangerouslySetInnerHTML={{ __html: sidebarCss }} />

      {/* ── Sidebar ── */}
      <aside className={`a-sidebar ${body.className}`}>
        {/* Brand */}
        <div className="a-sidebar-brand">
          <p className={`a-sidebar-brand-name ${display.className}`}>Sankofa</p>
          <p className="a-sidebar-brand-sub">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="a-sidebar-nav" aria-label="Admin navigation">
          <span className="a-nav-group-label">Navigation</span>
          {NAV.map(item => {
            if (!item.roles.includes(user!.role)) return null
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`a-nav-link ${isActive ? "active" : ""}`}
              >
                <span className="a-nav-icon" aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom user row */}
        <div className="a-sidebar-bottom">
          <div className="a-user-row">
            <div className="a-user-avatar">{initials}</div>
            <div style={{ overflow: "hidden" }}>
              <p className="a-user-name">{user!.name}</p>
              <p className="a-user-role">{roleLabel}</p>
            </div>
          </div>
          <button className="a-signout-btn" onClick={handleSignOut}>
            <span style={{ opacity: .6 }}>→</span> Sign out
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      {children}
    </AdminContext.Provider>
  )
}
