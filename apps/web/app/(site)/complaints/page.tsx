"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Trash2, Eye, Edit, AlertCircle } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Badge } from "@/core/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { useRole } from "@/hooks/use-role"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3010/api"

const STATUS_COLORS: Record<string, string> = {
  intake: "bg-gray-100 text-gray-700",
  docketed: "bg-blue-100 text-blue-700",
  assigned: "bg-yellow-100 text-yellow-700",
  under_investigation: "bg-orange-100 text-orange-700",
  mediation: "bg-purple-100 text-purple-700",
  resolution: "bg-teal-100 text-teal-700",
  closed: "bg-green-100 text-green-700",
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
}

interface Complaint {
  id: string
  caseNo: string
  title: string
  status: string
  priority: string
  category: string
  channel: string
  slaDeadline?: string
  aiClassification?: string
  description?: string
}

interface NewComplaintForm {
  title: string
  description: string
  category: string
  channel: string
  priority: string
}

export default function ComplaintsPage() {
  const { canWrite, canDelete, canClose, canAssign, role } = useRole()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [form, setForm] = useState<NewComplaintForm>({ title: "", description: "", category: "unauthorized_processing", channel: "online", priority: "medium" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/v1/complaints`, { credentials: "include" })
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : data.complaints ?? [])
    } catch { setError("Failed to load complaints") }
    finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!canWrite) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/v1/complaints`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create")
      setShowForm(false)
      setForm({ title: "", description: "", category: "unauthorized_processing", channel: "online", priority: "medium" })
      await load()
    } catch { setError("Failed to create complaint") }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!canDelete) return
    if (!confirm("Delete this complaint? This cannot be undone.")) return
    try {
      await fetch(`${API}/v1/complaints/${id}`, { method: "DELETE", credentials: "include" })
      setComplaints(p => p.filter(c => c.id !== id))
    } catch { setError("Failed to delete") }
  }

  async function handleStatusChange(id: string, status: string) {
    if (!canClose && !canWrite) return
    try {
      await fetch(`${API}/v1/complaints/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setComplaints(p => p.map(c => c.id === id ? { ...c, status } : c))
      setSelected(null)
    } catch { setError("Failed to update status") }
  }

  const filtered = complaints.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.caseNo.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  )

  const isOverSla = (sla?: string) => sla ? new Date(sla) < new Date() : false

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Complaints</h1>
          <p className="text-sm text-muted-foreground">{complaints.length} total cases</p>
        </div>
        {canWrite && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Complaint
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Role notice for read-only users */}
      {!canWrite && (
        <div className="rounded-md border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          You are viewing as <strong>{role?.replace(/_/g, " ")}</strong> — read-only access.
        </div>
      )}

      {/* New complaint form */}
      {showForm && canWrite && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Complaint</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
                rows={3} placeholder="Description"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
              <div className="grid grid-cols-3 gap-3">
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="unauthorized_processing">Unauthorized Processing</option>
                  <option value="data_breach">Data Breach</option>
                  <option value="denial_of_rights">Denial of Rights</option>
                  <option value="improper_disposal">Improper Disposal</option>
                  <option value="other">Other</option>
                </select>
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value }))}>
                  <option value="online">Online</option>
                  <option value="walk_in">Walk-in</option>
                  <option value="email">Email</option>
                  <option value="mail">Mail</option>
                </select>
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Submit"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by case no, title, or status..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-base">{selected.caseNo} — {selected.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className={STATUS_COLORS[selected.status] ?? ""}>{selected.status.replace(/_/g, " ")}</Badge>
                <Badge className={PRIORITY_COLORS[selected.priority] ?? ""}>{selected.priority}</Badge>
                {selected.aiClassification && <Badge variant="outline">{selected.aiClassification}</Badge>}
              </div>
              {/* Status actions — role gated */}
              {(canClose || canAssign) && (
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <p className="w-full text-xs text-muted-foreground font-medium">Update Status:</p>
                  {canAssign && selected.status === "docketed" && (
                    <Button size="sm" onClick={() => handleStatusChange(selected.id, "assigned")}>Assign</Button>
                  )}
                  {canWrite && selected.status === "assigned" && (
                    <Button size="sm" onClick={() => handleStatusChange(selected.id, "under_investigation")}>Start Investigation</Button>
                  )}
                  {canClose && ["under_investigation", "mediation"].includes(selected.status) && (
                    <Button size="sm" onClick={() => handleStatusChange(selected.id, "resolution")}>Move to Resolution</Button>
                  )}
                  {canClose && selected.status === "resolution" && (
                    <Button size="sm" variant="default" onClick={() => handleStatusChange(selected.id, "closed")}>Close Case</Button>
                  )}
                </div>
              )}
              {canDelete && (
                <Button size="sm" variant="destructive" className="mt-1" onClick={() => { handleDelete(selected.id); setSelected(null) }}>
                  <Trash2 className="mr-2 h-3 w-3" /> Delete Complaint
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Case No.</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-left font-medium">SLA</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{c.caseNo}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{c.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] ?? ""}`}>
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[c.priority] ?? ""}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {c.slaDeadline ? (
                      <span className={isOverSla(c.slaDeadline) ? "text-red-600 font-medium" : "text-muted-foreground"}>
                        {isOverSla(c.slaDeadline) ? "OVERDUE" : new Date(c.slaDeadline).toLocaleDateString()}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelected(c)} title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {canWrite && (
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelected(c)} title="Edit">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)} title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No complaints found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
