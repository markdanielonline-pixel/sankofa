"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function PortalPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/auth/login")
        return
      }

      setEmail(data.user.email ?? null)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <main style={{padding:"160px 20px", textAlign:"center"}}>
        Loading...
      </main>
    )
  }

  return (
    <main style={{padding:"140px 20px", maxWidth:"900px", margin:"auto"}}>
      <h1>Author Portal</h1>

      <p>Welcome {email}</p>

      <div style={{
        marginTop:"30px",
        padding:"30px",
        background:"#f6f3ee",
        borderRadius:"16px"
      }}>
        <h3>Your Dashboard</h3>
        <p>This area will later display:</p>
        <ul>
          <li>Royalty reports</li>
          <li>Manuscript status</li>
          <li>Contracts</li>
          <li>Messages</li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop:"30px",
          padding:"12px 20px",
          border:"1px solid rgba(212,175,55,.6)",
          background:"rgba(212,175,55,.2)",
          cursor:"pointer"
        }}
      >
        Logout
      </button>
    </main>
  )
}
