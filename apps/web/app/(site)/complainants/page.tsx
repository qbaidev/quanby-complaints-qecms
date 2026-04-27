"use client"
import { useEffect, useState, useCallback } from "react"
import { Plus, Search, X, Loader2, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Separator } from "@/core/components/ui/separator"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/core/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api"
const V = process.env.NEXT_PUBLIC_API_VERSION ?? "v1"
interface Complainant { id: string; fullName: string; email: string; contactNo: string; address: string; idType: string; createdAt: string }

function NewComplainantModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
	const [form, setForm] = useState({ fullName: "", email: "", contactNo: "", address: "", idType: "", idNo: "" })
	const [saving, setSaving] = useState(false); const [error, setError] = useState("")
	async function submit(e: React.FormEvent) {
		e.preventDefault(); if (!form.fullName.trim()) { setError("Full name required"); return }
		setSaving(true); setError("")
		try {
			const res = await fetch(`${API}/${V}/complainants`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
			if (!res.ok) throw new Error(await res.text()); onCreated()
		} catch (err) { setError(err instanceof Error ? err.message : "Failed") } finally { setSaving(false) }
	}
	return (
		<Dialog open onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Register Complainant</DialogTitle></DialogHeader>
			<form onSubmit={submit} className="space-y-4">
				<div className="space-y-1.5"><Label>Full Name *</Label><Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Juan Dela Cruz" /></div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
					<div className="space-y-1.5"><Label>Contact No.</Label><Input value={form.contactNo} onChange={e => setForm(f => ({ ...f, contactNo: e.target.value }))} /></div>
					<div className="space-y-1.5"><Label>ID Type</Label><Input value={form.idType} onChange={e => setForm(f => ({ ...f, idType: e.target.value }))} placeholder="PhilSys / Passport" /></div>
					<div className="space-y-1.5"><Label>ID No.</Label><Input value={form.idNo} onChange={e => setForm(f => ({ ...f, idNo: e.target.value }))} /></div>
				</div>
				<div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}Register</Button></DialogFooter>
			</form>
		</DialogContent></Dialog>
	)
}

export default function ComplainantsPage() {
	const [complainants, setComplainants] = useState<Complainant[]>([])
	const [loading, setLoading] = useState(true); const [search, setSearch] = useState(""); const [showNew, setShowNew] = useState(false)
	const load = useCallback(() => { setLoading(true); fetch(`${API}/${V}/complainants`).then(r => r.json()).then(d => setComplainants(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)) }, [])
	useEffect(() => { load() }, [load])
	const filtered = complainants.filter(c => !search || c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Complainants</h1><p className="text-sm text-muted-foreground">{complainants.length} registered</p></div><Button size="sm" onClick={() => setShowNew(true)}><Plus className="mr-1.5 h-4 w-4" />Register</Button></div>
			<Card>
				<CardHeader className="pb-3"><div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8 h-9" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>{search && <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearch("")}><X className="h-4 w-4" /></Button>}</div></CardHeader>
				<Separator />
				<CardContent className="p-0">
					<Table>
						<TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Contact</TableHead><TableHead>ID Type</TableHead><TableHead>Registered</TableHead></TableRow></TableHeader>
						<TableBody>
							{loading ? [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) :
								filtered.length === 0 ? <TableRow><TableCell colSpan={5} className="py-12 text-center"><div className="flex flex-col items-center gap-2 text-muted-foreground"><Users className="h-8 w-8" /><p className="text-sm">No complainants found</p></div></TableCell></TableRow> :
									filtered.map(c => (
										<TableRow key={c.id}>
											<TableCell><div className="flex items-center gap-2.5"><Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{c.fullName.split(" ").map(n => n[0]).slice(0, 2).join("")}</AvatarFallback></Avatar><span className="font-medium text-sm">{c.fullName}</span></div></TableCell>
											<TableCell className="text-sm text-muted-foreground">{c.email || "—"}</TableCell>
											<TableCell className="text-sm text-muted-foreground">{c.contactNo || "—"}</TableCell>
											<TableCell className="text-sm text-muted-foreground">{c.idType || "—"}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			{showNew && <NewComplainantModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load() }} />}
		</div>
	)
}
