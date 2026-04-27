"use client"
import { useEffect, useState, useCallback } from "react"
import { Plus, Search, X, Loader2, Building2 } from "lucide-react"
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
interface Respondent { id: string; name: string; type: string; email: string; contactNo: string; registrationNo: string; createdAt: string }
const TYPES = ["individual", "organization", "government"]
const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline"> = { individual: "secondary", organization: "default", government: "outline" }

function NewRespondentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
	const [form, setForm] = useState({ name: "", type: "organization", email: "", contactNo: "", address: "", registrationNo: "" })
	const [saving, setSaving] = useState(false); const [error, setError] = useState("")
	async function submit(e: React.FormEvent) {
		e.preventDefault(); if (!form.name.trim()) { setError("Name required"); return }
		setSaving(true); setError("")
		try { const res = await fetch(`${API}/${V}/respondents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!res.ok) throw new Error(await res.text()); onCreated() }
		catch (err) { setError(err instanceof Error ? err.message : "Failed") } finally { setSaving(false) }
	}
	return (
		<Dialog open onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Add Respondent</DialogTitle></DialogHeader>
			<form onSubmit={submit} className="space-y-4">
				<div className="space-y-1.5"><Label>Name / Organization *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5"><Label>Type</Label><Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent></Select></div>
					<div className="space-y-1.5"><Label>Registration No.</Label><Input value={form.registrationNo} onChange={e => setForm(f => ({ ...f, registrationNo: e.target.value }))} /></div>
					<div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
					<div className="space-y-1.5"><Label>Contact No.</Label><Input value={form.contactNo} onChange={e => setForm(f => ({ ...f, contactNo: e.target.value }))} /></div>
				</div>
				<div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}Add</Button></DialogFooter>
			</form>
		</DialogContent></Dialog>
	)
}

export default function RespondentsPage() {
	const [respondents, setRespondents] = useState<Respondent[]>([])
	const [loading, setLoading] = useState(true); const [search, setSearch] = useState(""); const [showNew, setShowNew] = useState(false)
	const load = useCallback(() => { setLoading(true); fetch(`${API}/${V}/respondents`).then(r => r.json()).then(d => setRespondents(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)) }, [])
	useEffect(() => { load() }, [load])
	const filtered = respondents.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Respondents</h1><p className="text-sm text-muted-foreground">{respondents.length} registered</p></div><Button size="sm" onClick={() => setShowNew(true)}><Plus className="mr-1.5 h-4 w-4" />Add Respondent</Button></div>
			<Card>
				<CardHeader className="pb-3"><div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8 h-9" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>{search && <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearch("")}><X className="h-4 w-4" /></Button>}</div></CardHeader>
				<Separator />
				<CardContent className="p-0">
					<Table>
						<TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Email</TableHead><TableHead>Contact</TableHead><TableHead>Reg. No.</TableHead><TableHead>Added</TableHead></TableRow></TableHeader>
						<TableBody>
							{loading ? [...Array(4)].map((_, i) => <TableRow key={i}>{[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) :
								filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="py-12 text-center"><div className="flex flex-col items-center gap-2 text-muted-foreground"><Building2 className="h-8 w-8" /><p className="text-sm">No respondents found</p></div></TableCell></TableRow> :
									filtered.map(r => (
										<TableRow key={r.id}>
											<TableCell className="font-medium text-sm">{r.name}</TableCell>
											<TableCell><Badge variant={TYPE_VARIANT[r.type] ?? "secondary"} className="capitalize text-xs">{r.type}</Badge></TableCell>
											<TableCell className="text-sm text-muted-foreground">{r.email || "—"}</TableCell>
											<TableCell className="text-sm text-muted-foreground">{r.contactNo || "—"}</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground">{r.registrationNo || "—"}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			{showNew && <NewRespondentModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load() }} />}
		</div>
	)
}
