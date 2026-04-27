import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, FileText, Users, Building2, ScrollText, ShieldCheck } from "lucide-react"
import { getSession } from "@/services/better-auth/auth-server"
import { LogoutButton } from "@/core/components/logout-button"
import { Badge } from "@/core/components/ui/badge"

const NAV = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/complaints", label: "Complaints", icon: FileText },
	{ href: "/complainants", label: "Complainants", icon: Users },
	{ href: "/respondents", label: "Respondents", icon: Building2 },
	{ href: "/audit-logs", label: "Audit Logs", icon: ScrollText },
]

const ROLE_LABELS: Record<string, string> = {
	admin: "Administrator",
	commissioner: "Commissioner",
	division_chief: "Division Chief",
	case_investigator: "Investigator",
	complaints_officer: "Officer",
	complainant: "Complainant",
	respondent: "Respondent",
}

const ROLE_COLORS: Record<string, string> = {
	admin: "bg-red-600 text-white",
	commissioner: "bg-purple-600 text-white",
	division_chief: "bg-blue-600 text-white",
	case_investigator: "bg-green-600 text-white",
	complaints_officer: "bg-yellow-600 text-white",
	complainant: "bg-gray-500 text-white",
	respondent: "bg-gray-500 text-white",
}

function NpcLogo({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="NPC Logo">
			<path d="M24 3 L42 11 L42 27 C42 36 33 43 24 46 C15 43 6 36 6 27 L6 11 Z" stroke="currentColor" strokeWidth="2" fill="none" />
			<path d="M24 8 L38 15 L38 27 C38 34 31 40 24 42 C17 40 10 34 10 27 L10 15 Z" fill="currentColor" opacity="0.12" />
			<rect x="17" y="23" width="14" height="10" rx="2" fill="currentColor" />
			<path d="M19 23 L19 19 C19 16.2 21 14 24 14 C27 14 29 16.2 29 19 L29 23" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
			<circle cx="24" cy="27.5" r="1.5" className="fill-background" />
		</svg>
	)
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession()
	if (!session) redirect("/login")

	const role = (session.user as { role?: string })?.role ?? "complaints_officer"
	const roleLabel = ROLE_LABELS[role] ?? role
	const roleColor = ROLE_COLORS[role] ?? "bg-gray-500 text-white"

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
						<div className="flex flex-col items-end">
							<span className="text-sm font-medium leading-none">{session.user?.name ?? session.user?.email}</span>
							<span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColor}`}>{roleLabel}</span>
						</div>
						<LogoutButton />
					</div>
				</div>
			</header>

			<div className="flex">
				<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r bg-card md:block">
					<nav className="flex flex-col gap-1 p-3">
						{NAV.map(({ href, label, icon: Icon }) => (
							<Link
								key={href}
								href={href}
								className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Icon className="h-4 w-4 shrink-0" />
								{label}
							</Link>
						))}

						<div className="mt-4 border-t pt-4">
							<div className="px-3 pb-2">
								<p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Signed in as</p>
								<p className="mt-1 truncate text-xs font-medium">{session.user?.name}</p>
								<span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColor}`}>{roleLabel}</span>
							</div>
							<LogoutButton variant="sidebar" />
						</div>
					</nav>
				</aside>

				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	)
}
