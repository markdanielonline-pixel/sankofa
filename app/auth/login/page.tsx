"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/portal")
    })
  }, [router])

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/portal` },
    })
    setGoogleLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push("/portal")
    }
  }

  return (
    <div className={body.className}>
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page {
          min-height: calc(100vh - 72px);
          background: #0b0b0c;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .auth-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 22px;
          padding: 52px 48px;
          width: 100%;
          max-width: 440px;
        }
        @media (max-width: 520px) {
          .auth-card { padding: 36px 24px; }
        }
        .auth-kicker {
          display: block;
          font-size: 11px;
          letter-spacing: .22em;
          text-transform: uppercase;
          font-variant: small-caps;
          color: #C9A227;
          margin-bottom: 18px;
        }
        .auth-heading {
          font-family: ${display.style.fontFamily};
          font-weight: 400;
          font-size: clamp(28px, 4vw, 38px);
          letter-spacing: -0.02em;
          color: #f6f3ee;
          margin: 0 0 36px;
          line-height: 1.1;
        }
        .auth-label {
          display: block;
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: rgba(246,243,238,.5);
          margin-bottom: 8px;
        }
        .auth-input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(201,162,39,.3);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 15px;
          color: #f6f3ee;
          font-family: inherit;
          outline: none;
          transition: border-color .2s;
          margin-bottom: 22px;
        }
        .auth-input:focus {
          border-color: #C9A227;
        }
        .auth-input::placeholder {
          color: rgba(246,243,238,.25);
        }
        .auth-btn {
          display: block;
          width: 100%;
          padding: 15px;
          background: #C9A227;
          color: #140F05;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: opacity .2s;
          margin-top: 8px;
        }
        .auth-btn:hover { opacity: .88; }
        .auth-btn:disabled { opacity: .5; cursor: default; }
        .auth-error {
          background: rgba(220, 60, 60, .12);
          border: 1px solid rgba(220, 60, 60, .35);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #f87171;
          margin-bottom: 20px;
        }
        .auth-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 14px;
          color: rgba(246,243,238,.45);
        }
        .auth-footer a {
          color: #C9A227;
          text-decoration: none;
          transition: opacity .2s;
        }
        .auth-footer a:hover { opacity: .75; }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: #0b0b0c;
          color: #f6f3ee;
          border: 1px solid rgba(201,162,39,.5);
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background .2s, border-color .2s;
          margin-bottom: 24px;
        }
        .google-btn:hover {
          background: rgba(201,162,39,.07);
          border-color: #C9A227;
        }
        .google-btn:disabled { opacity: .5; cursor: default; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: rgba(246,243,238,.25);
          font-size: 12px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.08);
        }
      ` }} />

      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-kicker">Author Portal</span>
          <h1 className="auth-heading">Welcome Back</h1>

          <button className="google-btn" onClick={handleGoogleSignIn} disabled={googleLoading} type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="auth-divider">or</div>

          <form onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  )
}
