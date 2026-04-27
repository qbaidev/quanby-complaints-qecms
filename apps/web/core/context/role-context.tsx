"use client"
import { createContext } from "react"

interface RoleContextValue {
  role: string
  userName: string
}

export const RoleContext = createContext<RoleContextValue>({ role: "complaints_officer", userName: "" })

export function RoleProvider({ role, userName, children }: RoleContextValue & { children: React.ReactNode }) {
  return <RoleContext.Provider value={{ role, userName }}>{children}</RoleContext.Provider>
}
