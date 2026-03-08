"use client"

import { createContext, useContext } from "react"

export type AdminRole = "super_admin" | "editor" | "support"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
}

export const AdminContext = createContext<AdminUser | null>(null)
export const useAdmin = () => useContext(AdminContext)!
