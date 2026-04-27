"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/services/better-auth/auth-client"

export default function LogoutPage() {
  const router = useRouter()
  useEffect(() => {
    authClient.signOut().then(() => {
      router.push("/login")
      router.refresh()
    })
  }, [router])
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing out...</p>
    </div>
  )
}
