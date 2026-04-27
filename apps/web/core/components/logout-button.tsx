"use client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { authClient } from "@/services/better-auth/auth-client"
import { Button } from "@/core/components/ui/button"

export function LogoutButton({ variant }: { variant?: "sidebar" }) {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
      onClick={handleLogout}
      title="Sign out"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  )
}
