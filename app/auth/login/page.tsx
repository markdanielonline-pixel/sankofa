"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Fraunces, Inter } from "next/font/google"
import { supabase } from "@/lib/supabase"

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600"] })
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

export default function LoginPage() {
  const router = useRouter()
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
        }
        .google-btn:hover {
          background: rgba(201,162,39,.07);
          border-color: #C9A227;
        }
        .google-btn:disabled { opacity: .5; cursor: default; }
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

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  )
}
