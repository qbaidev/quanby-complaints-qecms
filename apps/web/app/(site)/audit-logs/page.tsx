"use client"
import { useEffect, useState } from "react"
import { ScrollText, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Separator } from "@/core/components/ui/separator"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api"
const V = process.env.NEXT_PUBLIC_API_VERSION ?? "v1"
interface AuditLog { id: string; userId: string; action: string; resource: string; resourceId: string; ipAddress: string; createdAt: string }

const ACTION_VARIANT: Record<string, "destructive" | "secondary" | "outline" | "default"> = { DELETE: "destructive", CREATE: "default", UPDATE: "secondary", READ: "outline" }

export default function AuditLogsPage() {
	const [logs, setLogs] = useState<AuditLog[]>([])
	const [loading, setLoading] = useState(true)
	function load() { setLoading(true); fetch(`${API}/${V}/audit-logs`).then(r => r.json()).then(d => setLogs(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)) }
	useEffect(() => { load() }, [])
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1><p className="text-sm text-muted-foreground">System activity trail</p></div><Button variant="outline" size="sm" onClick={load}><RefreshCw className="mr-1.5 h-4 w-4" />Refresh</Button></div>
			<Card>
				<Separator />
				<CardContent className="p-0">
					<Table>
						<TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Resource</TableHead><TableHead>Resource ID</TableHead><TableHead>IP Address</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
						<TableBody>
							{loading ? [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) :
								logs.length === 0 ? <TableRow><TableCell colSpan={5} className="py-12 text-center"><div className="flex flex-col items-center gap-2 text-muted-foreground"><ScrollText className="h-8 w-8" /><p className="text-sm">No audit logs yet</p></div></TableCell></TableRow> :
									logs.map(l => (
										<TableRow key={l.id}>
											<TableCell><Badge variant={ACTION_VARIANT[l.action?.toUpperCase()] ?? "secondary"} className="text-xs">{l.action}</Badge></TableCell>
											<TableCell className="text-sm font-medium capitalize">{l.resource}</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground">{l.resourceId ? l.resourceId.slice(0, 8) + "…" : "—"}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{l.ipAddress || "—"}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
