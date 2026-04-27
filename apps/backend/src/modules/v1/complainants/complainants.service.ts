import { Injectable } from "@nestjs/common"
import { db } from "@/common/database/database.client"
import { complainants } from "@repo/db/schema"
import { eq, desc } from "drizzle-orm"

@Injectable()
export class ComplainantsService {
	findAll() { return db.select().from(complainants).orderBy(desc(complainants.createdAt)).limit(200) }
	async findOne(id: string) { const [r] = await db.select().from(complainants).where(eq(complainants.id, id)); return r ?? null }
	async create(data: any) {
		const [r] = await db.insert(complainants).values({ id: crypto.randomUUID(), ...data }).returning()
		return r
	}
	async update(id: string, data: any) {
		const [r] = await db.update(complainants).set(data).where(eq(complainants.id, id)).returning()
		return r
	}
	async remove(id: string) {
		const [r] = await db.delete(complainants).where(eq(complainants.id, id)).returning()
		return { deleted: true, id: r?.id }
	}
}
