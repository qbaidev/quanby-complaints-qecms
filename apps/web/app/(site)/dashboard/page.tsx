"use client"
import { useEffect, useState } from "react"
import { FileText, Users, AlertCircle, CheckCircle2, Clock, TrendingUp, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api"
const V = process.env.NEXT_PUBLIC_API_VERSION ?? "v1"

interface Stats {
	total: number; open: number; slaBreached: number
	byStatus: Record<string, number>; byPriority: Record<string, number>; byCategory: Record<string, number>
}

const PRIORITY_VARIANT: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
	critical: "destructive", high: "destructive", medium: "secondary", low: "outline",
}
const STATUS_VARIANT: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
	intake: "secondary", docketed: "default", assigned: "default",
	under_investigation: "secondary", mediation: "secondary",
	resolution: "outline", closed: "outline", dismissed: "outline",
}

export default function DashboardPage() {
	const [stats, setStats] = useState<Stats | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch(`${API}/${V}/complaints/stats`).then(r => r.json())
			.then(setStats).catch(() => {}).finally(() => setLoading(false))
	}, [])

	const kpis = [
		{ label: "Total Complaints", value: stats?.total ?? 0, icon: FileText, desc: "All time" },
		{ label: "Active Cases", value: stats?.open ?? 0, icon: Clock, desc: "Pending resolution" },
		{ label: "SLA Breached", value: stats?.slaBreached ?? 0, icon: AlertCircle, desc: "Requires urgent action" },
		{ label: "Resolved", value: (stats?.byStatus?.["closed"] ?? 0) + (stats?.byStatus?.["dismissed"] ?? 0), icon: CheckCircle2, desc: "Closed + dismissed" },
	]

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
					<p className="text-sm text-muted-foreground">NPC Complaints Management overview</p>
				</div>
				<Link href="/complaints">
					<Button size="sm"><Plus className="mr-1.5 h-4 w-4" />New Complaint</Button>
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{kpis.map(({ label, value, icon: Icon, desc }) =>
					loading ? <Skeleton key={label} className="h-28 rounded-xl" /> : (
						<Card key={label}>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
								<Icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">{value}</p>
								<p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
							</CardContent>
						</Card>
					)
				)}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Cases by Status</CardTitle>
						<CardDescription>Current distribution</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div> : (
							<div className="space-y-2">
								{Object.entries(stats?.byStatus ?? {}).map(([status, cnt]) => (
									<div key={status} className="flex items-center justify-between">
										<Badge variant={STATUS_VARIANT[status] ?? "secondary"} className="capitalize text-xs">
											{status.replace(/_/g, " ")}
										</Badge>
										<span className="text-sm font-semibold tabular-nums">{cnt as number}</span>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Cases by Priority</CardTitle>
						<CardDescription>Risk breakdown</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div> : (
							<div className="space-y-3">
								{Object.entries(stats?.byPriority ?? {}).map(([priority, cnt]) => {
									const pct = Math.round(((cnt as number) / Math.max(stats?.total ?? 1, 1)) * 100)
									return (
										<div key={priority} className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span className="capitalize font-medium">{priority}</span>
												<span className="text-muted-foreground tabular-nums">{cnt as number}</span>
											</div>
											<div className="h-1.5 w-full rounded-full bg-muted">
												<div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
											</div>
										</div>
									)
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader><CardTitle className="text-sm font-medium">Quick Actions</CardTitle></CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
						{[
							{ label: "New Complaint", href: "/complaints", icon: Plus },
							{ label: "All Complaints", href: "/complaints", icon: FileText },
							{ label: "Complainants", href: "/complainants", icon: Users },
							{ label: "Audit Logs", href: "/audit-logs", icon: ArrowRight },
						].map(({ label, href, icon: Icon }) => (
							<Link key={label} href={href}>
								<Button variant="outline" className="w-full justify-start gap-2">
									<Icon className="h-4 w-4" />{label}
								</Button>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
