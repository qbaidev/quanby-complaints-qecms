import { Injectable } from "@nestjs/common"
import { db } from "@/common/database/database.client"
import { complaints, complainants, respondents, caseActivities, users } from "@repo/db/schema"
import { eq, desc, count, sql } from "drizzle-orm"

@Injectable()
export class ComplaintsService {
	async findAll() {
		return db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(200)
	}

	async findOne(id: string) {
		const [row] = await db.select().from(complaints).where(eq(complaints.id, id)).limit(1)
		return row ?? null
	}

	async create(data: {
		title: string; description?: string; category?: string; priority?: string
		channel?: string; complainantId?: string; respondentId?: string
	}) {
		const caseNo = `NPC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`
		const slaDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
		const [row] = await db.insert(complaints).values({
			id: crypto.randomUUID(),
			caseNo,
			title: data.title,
			description: data.description ?? null,
			category: data.category ?? "other",
			priority: data.priority ?? "medium",
			channel: data.channel ?? "online",
			complainantId: data.complainantId ?? null,
			respondentId: data.respondentId ?? null,
			status: "intake",
			slaDeadline,
			updatedAt: new Date(),
		}).returning()
		return row
	}

	async update(id: string, data: Partial<{ status: string; priority: string; assignedToId: string; aiSummary: string; aiClassification: string }>) {
		const [row] = await db.update(complaints).set({ ...data as any, updatedAt: new Date() }).where(eq(complaints.id, id)).returning()
		return row
	}

	async getStats() {
		const [total] = await db.select({ count: count() }).from(complaints)
		const [open] = await db.select({ count: count() }).from(complaints)
			.where(sql`status NOT IN ('closed', 'dismissed')`)
		const [slaBreached] = await db.select({ count: count() }).from(complaints)
			.where(sql`sla_deadline < NOW() AND status NOT IN ('closed', 'dismissed')`)

		const byStatus = await db.select({ status: complaints.status, count: count() })
			.from(complaints).groupBy(complaints.status)
		const byPriority = await db.select({ priority: complaints.priority, count: count() })
			.from(complaints).groupBy(complaints.priority)
		const byCategory = await db.select({ category: complaints.category, count: count() })
			.from(complaints).groupBy(complaints.category)

		return {
			total: total?.count ?? 0,
			open: open?.count ?? 0,
			slaBreached: slaBreached?.count ?? 0,
			byStatus: Object.fromEntries(byStatus.map(r => [r.status, r.count])),
			byPriority: Object.fromEntries(byPriority.map(r => [r.priority, r.count])),
			byCategory: Object.fromEntries(byCategory.map(r => [r.category, r.count])),
		}
	}

	async getActivities(complaintId: string) {
		return db.select().from(caseActivities)
			.where(eq(caseActivities.complaintId, complaintId))
			.orderBy(desc(caseActivities.createdAt))
	}

	async addActivity(complaintId: string, data: { userId?: string; activityType: string; description: string }) {
		const [row] = await db.insert(caseActivities).values({
			id: crypto.randomUUID(),
			complaintId,
			userId: data.userId ?? null,
			activityType: data.activityType,
			description: data.description,
		}).returning()
		return row
	}
}
