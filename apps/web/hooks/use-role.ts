"use client"
import { useContext } from "react"
import { RoleContext } from "@/core/context/role-context"

export type UserRole =
  | "admin"
  | "commissioner"
  | "division_chief"
  | "case_investigator"
  | "complaints_officer"
  | "complainant"
  | "respondent"

export function useRole() {
  const { role, userName } = useContext(RoleContext)

  return {
    role: role as UserRole | undefined,
    userName,
    isAdmin: role === "admin",
    isCommissioner: role === "commissioner" || role === "admin",
    isDivisionChief: role === "division_chief" || role === "admin",
    isInvestigator: role === "case_investigator" || role === "admin",
    isOfficer: role === "complaints_officer" || role === "admin",
    canWrite: ["admin", "commissioner", "division_chief", "complaints_officer"].includes(role ?? ""),
    canDelete: role === "admin",
    canAssign: ["admin", "division_chief"].includes(role ?? ""),
    canClose: ["admin", "commissioner", "division_chief"].includes(role ?? ""),
    canAdmin: role === "admin",
  }
}
