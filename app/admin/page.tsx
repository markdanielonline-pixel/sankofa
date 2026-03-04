"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "denied" | "ok">("loading")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setEmail(user.email ?? "")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const role = (profile?.role ?? "").toLowerCase()
      if (role !== "super_admin") {
        setStatus("denied")
        return
      }

      setStatus("ok")
    }

    run()
  }, [router])

  if (status === "loading") return <div style={{ padding: 40 }}>Loading...</div>

  if (status === "denied") {
    return (
      <div style={{ padding: 40 }}>
        <h1>Access denied</h1>
        <p>You are not super_admin.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin</h1>
      <p>Super admin: {email}</p>
      <p>Admin placeholder is live.</p>
    </div>
  )
}