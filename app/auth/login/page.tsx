"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setMessage("Account created. Check your email to confirm.")
      setLoading(false)
      return
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push("/portal")
    }
  }

  return (
    <main style={{ padding: "160px 20px", maxWidth: "420px", margin: "auto" }}>
      <h1>{mode === "signin" ? "Author Login" : "Create Author Account"}</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          {message}
        </div>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "rgba(212,175,55,.3)",
          border: "1px solid rgba(212,175,55,.6)",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loading
          ? "Processing..."
          : mode === "signin"
          ? "Sign In"
          : "Sign Up"}
      </button>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {mode === "signin" ? (
          <span>
            Don't have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
            >
              Sign up
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
            >
              Sign in
            </button>
          </span>
        )}
      </div>
    </main>
  )
}
