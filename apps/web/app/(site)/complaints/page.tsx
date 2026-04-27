"use client"
import { useEffect, useState, useCallback } from "react"
import { Plus, Search, Filter, AlertCircle, Clock, X, Loader2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Separator } from "@/core/components/ui/separator"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/core/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api"
const V = process.env.NEXT_PUBLIC_API_VERSION ?? "v1"

interface Complaint { id: string; caseNo: string; title: string; status: string; priority: string; category: string; channel: string; createdAt: string; slaDeadline: string }
interface Complainant { id: string; fullName: string }

const PRIORITY_VARIANT: Record<string, "destructive" | "secondary" | "outline" | "default"> = { critical: "destructive", high: "destructive", medium: "secondary", low: "outline" }
const STATUS_VARIANT: Record<string, "destructive" | "secondary" | "outline" | "default"> = { intake: "secondary", docketed: "default", assigned: "default", under_investigation: "secondary", mediation: "secondary", resolution: "outline", closed: "outline", dismissed: "outline" }
const CATEGORIES = ["data_breach", "unauthorized_processing", "improper_disposal", "denial_of_rights", "other"]
const CHANNELS = ["online", "walk_in", "email", "mail"]
const PRIORITIES = ["low", "medium", "high", "critical"]
const STATUSES = ["intake", "docketed", "assigned", "under_investigation", "mediation", "resolution", "closed", "dismissed"]

function NewComplaintModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
	const [complainants, setComplainants] = useState<Complainant[]>([])
	const [form, setForm] = useState({ title: "", description: "", category: "data_breach", priority: "medium", channel: "online", complainantId: "" })
	const [saving, setSaving] = useState(false); const [error, setError] = useState("")
	useEffect(() => { fetch(`${API}/${V}/complainants`).then(r => r.json()).then(d => setComplainants(Array.isArray(d) ? d : [])).catch(() => {}) }, [])
	async function submit(e: React.FormEvent) {
		e.preventDefault(); if (!form.title.trim()) { setError("Title is required"); return }
		setSaving(true); setError("")
		try {
			const res = await fetch(`${API}/${V}/complaints`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
			if (!res.ok) throw new Error(await res.text()); onCreated()
		} catch (err) { setError(err instanceof Error ? err.message : "Failed") } finally { setSaving(false) }
	}
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader><DialogTitle>New Complaint</DialogTitle></DialogHeader>
				<form onSubmit={submit} className="space-y-4">
					<div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief description" /></div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5"><Label>Category</Label>
							<Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
								<SelectTrigger><SelectValue /></SelectTrigger>
								<SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
							</Select></div>
						<div className="space-y-1.5"><Label>Priority</Label>
							<Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
								<SelectTrigger><SelectValue /></SelectTrigger>
								<SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
							</Select></div>
						<div className="space-y-1.5"><Label>Channel</Label>
							<Select value={form.channel} onValueChange={v => setForm(f => ({ ...f, channel: v }))}>
								<SelectTrigger><SelectValue /></SelectTrigger>
								<SelectContent>{CHANNELS.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
							</Select></div>
						<div className="space-y-1.5"><Label>Complainant</Label>
							<Select value={form.complainantId} onValueChange={v => setForm(f => ({ ...f, complainantId: v }))}>
								<SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
								<SelectContent>{complainants.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}</SelectContent>
							</Select></div>
					</div>
					<div className="space-y-1.5"><Label>Description</Label>
						<textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Details…" /></div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
						<Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}File Complaint</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default function ComplaintsPage() {
	const [complaints, setComplaints] = useState<Complaint[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState(""); const [filterStatus, setFilterStatus] = useState("all"); const [filterPriority, setFilterPriority] = useState("all")
	const [showNew, setShowNew] = useState(false)
	const load = useCallback(() => { setLoading(true); fetch(`${API}/${V}/complaints`).then(r => r.json()).then(d => setComplaints(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)) }, [])
	useEffect(() => { load() }, [load])
	const filtered = complaints.filter(c => {
		const ms = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.caseNo?.toLowerCase().includes(search.toLowerCase())
		return ms && (filterStatus === "all" || c.status === filterStatus) && (filterPriority === "all" || c.priority === filterPriority)
	})
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div><h1 className="text-2xl font-semibold tracking-tight">Complaints</h1><p className="text-sm text-muted-foreground">{complaints.length} total</p></div>
				<Button size="sm" onClick={() => setShowNew(true)}><Plus className="mr-1.5 h-4 w-4" />File Complaint</Button>
			</div>
			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative flex-1 min-w-48"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8 h-9" placeholder="Search complaints…" value={search} onChange={e => setSearch(e.target.value)} /></div>
						<Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="h-9 w-40"><Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select>
						<Select value={filterPriority} onValueChange={setFilterPriority}><SelectTrigger className="h-9 w-36"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All priorities</SelectItem>{PRIORITIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent></Select>
						{(filterStatus !== "all" || filterPriority !== "all" || search) && <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setSearch(""); setFilterStatus("all"); setFilterPriority("all") }}><X className="h-4 w-4" /></Button>}
					</div>
				</CardHeader>
				<Separator />
				<CardContent className="p-0">
					<Table>
						<TableHeader><TableRow><TableHead>Case No.</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead>Category</TableHead><TableHead>SLA</TableHead><TableHead>Filed</TableHead></TableRow></TableHeader>
						<TableBody>
							{loading ? [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) :
								filtered.length === 0 ? <TableRow><TableCell colSpan={7} className="py-12 text-center"><div className="flex flex-col items-center gap-2 text-muted-foreground"><FileText className="h-8 w-8" /><p className="text-sm">No complaints found</p></div></TableCell></TableRow> :
									filtered.map(c => (
										<TableRow key={c.id}>
											<TableCell className="font-mono text-xs text-muted-foreground">{c.caseNo}</TableCell>
											<TableCell className="font-medium max-w-48 truncate text-sm">{c.title}</TableCell>
											<TableCell><Badge variant={STATUS_VARIANT[c.status] ?? "secondary"} className="capitalize text-xs">{c.status.replace(/_/g, " ")}</Badge></TableCell>
											<TableCell><Badge variant={PRIORITY_VARIANT[c.priority] ?? "secondary"} className="capitalize text-xs">{c.priority}</Badge></TableCell>
											<TableCell className="text-xs text-muted-foreground capitalize">{c.category?.replace(/_/g, " ")}</TableCell>
											<TableCell>{c.slaDeadline ? (new Date(c.slaDeadline) < new Date() ? <div className="flex items-center gap-1 text-destructive"><AlertCircle className="h-3.5 w-3.5" /><span className="text-xs font-medium">Breached</span></div> : <div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /><span className="text-xs">{new Date(c.slaDeadline).toLocaleDateString()}</span></div>) : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			{showNew && <NewComplaintModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load() }} />}
		</div>
	)
}
