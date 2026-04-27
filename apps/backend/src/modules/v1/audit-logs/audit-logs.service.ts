import { Injectable } from "@nestjs/common"
import { db } from "@/common/database/database.client"
import { auditLogs } from "@repo/db/schema"
import { desc } from "drizzle-orm"

@Injectable()
export class AuditLogsService {
	findAll() { return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(200) }
	async create(data: { userId?: string; action: string; resource: string; resourceId?: string; details?: any }) {
		const [r] = await db.insert(auditLogs).values({ id: crypto.randomUUID(), ...data }).returning()
		return r
	}
}
