"use client"
import { useSession } from "@/services/better-auth/auth-client"

export type UserRole =
  | "admin"
  | "commissioner"
  | "division_chief"
  | "case_investigator"
  | "complaints_officer"
  | "complainant"
  | "respondent"

export function useRole() {
  const { data: session } = useSession()
  const role = (session?.user as { role?: string })?.role as UserRole | undefined

  return {
    role,
    user: session?.user,
    isAdmin: role === "admin",
    isCommissioner: role === "commissioner" || role === "admin",
    isDivisionChief: role === "division_chief" || role === "admin",
    isInvestigator: role === "case_investigator" || role === "admin",
    isOfficer: role === "complaints_officer" || role === "admin",
    // Can create/edit
    canWrite: ["admin", "commissioner", "division_chief", "complaints_officer"].includes(role ?? ""),
    // Can delete — admin only
    canDelete: role === "admin",
    // Can assign cases
    canAssign: ["admin", "division_chief"].includes(role ?? ""),
    // Can close/resolve cases
    canClose: ["admin", "commissioner", "division_chief"].includes(role ?? ""),
    // Full control
    canAdmin: role === "admin",
  }
}
