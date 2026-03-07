"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/portal")
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
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
        .auth-success {
          background: rgba(39, 162, 100, .12);
          border: 1px solid rgba(39, 162, 100, .35);
          border-radius: 10px;
          padding: 16px 20px;
          font-size: 15px;
          color: #6ee7b7;
          line-height: 1.6;
          text-align: center;
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
      ` }} />

      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-kicker">Author Portal</span>
          <h1 className="auth-heading">Create Your Account</h1>

          {success ? (
            <div className="auth-success">
              Check your email to confirm your account. Once verified, you can{" "}
              <a href="/auth/login" style={{ color: "#C9A227" }}>sign in here</a>.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="auth-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoComplete="name"
              />

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
                minLength={6}
                autoComplete="new-password"
              />

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          <p className="auth-footer">
            Already have an account?{" "}
            <a href="/auth/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
