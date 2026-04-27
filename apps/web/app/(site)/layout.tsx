import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, FileText, Users, Building2, ScrollText, LogOut, ShieldCheck } from "lucide-react"
import { getSession } from "@/services/better-auth/auth-server"
import { Button } from "@/core/components/ui/button"

const NAV = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/complaints", label: "Complaints", icon: FileText },
	{ href: "/complainants", label: "Complainants", icon: Users },
	{ href: "/respondents", label: "Respondents", icon: Building2 },
	{ href: "/audit-logs", label: "Audit Logs", icon: ScrollText },
]

function NpcLogo({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="NPC Logo">
			{/* Outer shield */}
			<path d="M24 3 L42 11 L42 27 C42 36 33 43 24 46 C15 43 6 36 6 27 L6 11 Z" stroke="currentColor" strokeWidth="2" fill="none" />
			{/* Inner shield highlight */}
			<path d="M24 8 L38 15 L38 27 C38 34 31 40 24 42 C17 40 10 34 10 27 L10 15 Z" fill="currentColor" opacity="0.12" />
			{/* Lock body */}
			<rect x="17" y="23" width="14" height="10" rx="2" fill="currentColor" />
			{/* Lock shackle */}
			<path d="M19 23 L19 19 C19 16.2 21 14 24 14 C27 14 29 16.2 29 19 L29 23" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
			{/* Keyhole */}
			<circle cx="24" cy="27.5" r="1.5" fill="currentColor" opacity="0" />
			<circle cx="24" cy="27.5" r="1.5" className="fill-background" />
		</svg>
	)
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession()
	if (!session) redirect("/login")

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground shadow-sm">
				<div className="flex h-14 items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<NpcLogo className="h-8 w-8 text-primary-foreground" />
						<div>
							<p className="text-sm font-bold leading-none tracking-wide">NPC — QECMS</p>
							<p className="text-xs opacity-70">Quanby Enterprise Complaints Management</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-sm opacity-80">{session.user?.name ?? session.user?.email}</span>
						<Link href="/logout">
							<Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10">
								<LogOut className="h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</header>

			<div className="flex">
				<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r bg-card md:block">
					<div className="border-b px-4 py-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Navigation</p>
					</div>
					<nav className="flex flex-col gap-0.5 p-3">
						{NAV.map(({ href, label, icon: Icon }) => (
							<Link key={href} href={href}
								className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
								<Icon className="h-4 w-4 shrink-0" />{label}
							</Link>
						))}
					</nav>
				</aside>
				<main className="min-w-0 flex-1 p-6">{children}</main>
			</div>
		</div>
	)
}
