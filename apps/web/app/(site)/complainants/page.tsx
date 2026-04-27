"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Trash2, User } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { useRole } from "@/hooks/use-role"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3010/api"

interface Complainant { id: string; fullName: string; email: string; contactNo: string; address: string; idType: string; idNo: string }

export default function ComplainantsPage() {
  const { canWrite, canDelete, role } = useRole()
  const [items, setItems] = useState<Complainant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: "", email: "", contactNo: "", address: "", idType: "PhilSys", idNo: "" })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/v1/complainants`, { credentials: "include" })
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.complainants ?? [])
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API}/v1/complainants`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setShowForm(false)
      setForm({ fullName: "", email: "", contactNo: "", address: "", idType: "PhilSys", idNo: "" })
      await load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this complainant?")) return
    await fetch(`${API}/v1/complainants/${id}`, { method: "DELETE", credentials: "include" })
    setItems(p => p.filter(i => i.id !== id))
  }

  const filtered = items.filter(i =>
    i.fullName.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Complainants</h1>
          <p className="text-sm text-muted-foreground">{items.length} registered</p>
        </div>
        {canWrite && <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> Add Complainant</Button>}
      </div>

      {!canWrite && (
        <div className="rounded-md border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Viewing as <strong>{role?.replace(/_/g, " ")}</strong> — read-only access.
        </div>
      )}

      {showForm && canWrite && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Complainant</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
              <Input placeholder="Full Name" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
              <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Contact No." value={form.contactNo} onChange={e => setForm(p => ({ ...p, contactNo: e.target.value }))} />
              <Input placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.idType} onChange={e => setForm(p => ({ ...p, idType: e.target.value }))}>
                <option>PhilSys</option><option>Passport</option><option>Driver&apos;s License</option><option>UMID</option><option>Voter&apos;s ID</option>
              </select>
              <Input placeholder="ID No." value={form.idNo} onChange={e => setForm(p => ({ ...p, idNo: e.target.value }))} />
              <div className="col-span-2 flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search complainants..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : filtered.map(c => (
          <Card key={c.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{c.fullName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </div>
                {canDelete && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>{c.contactNo}</p>
                <p className="truncate">{c.address}</p>
                <p className="font-mono">{c.idType}: {c.idNo}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && filtered.length === 0 && <p className="text-sm text-muted-foreground">No complainants found.</p>}
      </div>
    </div>
  )
}
