import { Injectable } from "@nestjs/common"
import { db } from "@/common/database/database.client"
import { respondents } from "@repo/db/schema"
import { eq, desc } from "drizzle-orm"

@Injectable()
export class RespondentsService {
	findAll() { return db.select().from(respondents).orderBy(desc(respondents.createdAt)).limit(200) }
	async findOne(id: string) { const [r] = await db.select().from(respondents).where(eq(respondents.id, id)); return r ?? null }
	async create(data: any) {
		const [r] = await db.insert(respondents).values({ id: crypto.randomUUID(), ...data }).returning()
		return r
	}
	async update(id: string, data: any) {
		const [r] = await db.update(respondents).set(data).where(eq(respondents.id, id)).returning()
		return r
	}
}
