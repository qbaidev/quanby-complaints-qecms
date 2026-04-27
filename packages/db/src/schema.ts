import { pgTableCreator } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"

const createTable = pgTableCreator(name => name)

// ── Auth tables ────────────────────────────────────────────────────────────────
export const users = createTable("users", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	email: t.text("email").notNull().unique(),
	emailVerified: t.boolean("email_verified").notNull().default(false),
	image: t.text("image"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
})

export const sessions = createTable("sessions", {
	id: t.text("id").primaryKey(),
	expiresAt: t.timestamp("expires_at").notNull(),
	token: t.text("token").notNull().unique(),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
	ipAddress: t.text("ip_address"),
	userAgent: t.text("user_agent"),
	userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
})

export const accounts = createTable("accounts", {
	id: t.text("id").primaryKey(),
	accountId: t.text("account_id").notNull(),
	providerId: t.text("provider_id").notNull(),
	userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	accessToken: t.text("access_token"),
	refreshToken: t.text("refresh_token"),
	idToken: t.text("id_token"),
	accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
	scope: t.text("scope"),
	password: t.text("password"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
})

export const verifications = createTable("verifications", {
	id: t.text("id").primaryKey(),
	identifier: t.text("identifier").notNull(),
	value: t.text("value").notNull(),
	expiresAt: t.timestamp("expires_at").notNull(),
	createdAt: t.timestamp("created_at").defaultNow(),
	updatedAt: t.timestamp("updated_at").defaultNow(),
})

// ── Complainants ───────────────────────────────────────────────────────────────
export const complainants = createTable("complainants", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	fullName: t.text("full_name").notNull(),
	email: t.text("email"),
	contactNo: t.text("contact_no"),
	address: t.text("address"),
	idType: t.text("id_type"),
	idNo: t.text("id_no"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Respondents ────────────────────────────────────────────────────────────────
export const respondents = createTable("respondents", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	name: t.text("name").notNull(),
	type: t.text("type").notNull().default("organization"),
	email: t.text("email"),
	contactNo: t.text("contact_no"),
	address: t.text("address"),
	registrationNo: t.text("registration_no"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Complaints ─────────────────────────────────────────────────────────────────
export const complaints = createTable("complaints", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	caseNo: t.text("case_no").notNull().unique(),
	title: t.text("title").notNull(),
	description: t.text("description"),
	status: t.text("status").notNull().default("intake"),
	priority: t.text("priority").notNull().default("medium"),
	category: t.text("category").notNull().default("other"),
	channel: t.text("channel").notNull().default("online"),
	complainantId: t.text("complainant_id").references(() => complainants.id),
	respondentId: t.text("respondent_id").references(() => respondents.id),
	assignedToId: t.text("assigned_to_id").references(() => users.id),
	divisionId: t.text("division_id"),
	aiClassification: t.text("ai_classification"),
	aiSummary: t.text("ai_summary"),
	aiSentiment: t.text("ai_sentiment").default("neutral"),
	slaDeadline: t.timestamp("sla_deadline"),
	resolvedAt: t.timestamp("resolved_at"),
	closedAt: t.timestamp("closed_at"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
})

// ── Case Activities ────────────────────────────────────────────────────────────
export const caseActivities = createTable("case_activities", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	complaintId: t.text("complaint_id").notNull().references(() => complaints.id, { onDelete: "cascade" }),
	userId: t.text("user_id").references(() => users.id),
	activityType: t.text("activity_type").notNull(),
	description: t.text("description").notNull(),
	metadata: t.jsonb("metadata"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Documents ──────────────────────────────────────────────────────────────────
export const documents = createTable("documents", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	complaintId: t.text("complaint_id").references(() => complaints.id, { onDelete: "cascade" }),
	uploadedById: t.text("uploaded_by_id").references(() => users.id),
	fileName: t.text("file_name").notNull(),
	fileType: t.text("file_type"),
	fileSize: t.integer("file_size"),
	documentType: t.text("document_type").default("evidence"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Fee Computations ───────────────────────────────────────────────────────────
export const feeComputations = createTable("fee_computations", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	complaintId: t.text("complaint_id").notNull().references(() => complaints.id, { onDelete: "cascade" }),
	feeType: t.text("fee_type").notNull().default("filing"),
	amount: t.decimal("amount", { precision: 12, scale: 2 }).notNull().default("0"),
	status: t.text("status").notNull().default("pending"),
	computedById: t.text("computed_by_id").references(() => users.id),
	paidAt: t.timestamp("paid_at"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Audit Logs ─────────────────────────────────────────────────────────────────
export const auditLogs = createTable("audit_logs", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	userId: t.text("user_id").references(() => users.id),
	action: t.text("action").notNull(),
	resource: t.text("resource").notNull(),
	resourceId: t.text("resource_id"),
	details: t.jsonb("details"),
	ipAddress: t.text("ip_address"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})

// ── Notifications ──────────────────────────────────────────────────────────────
export const notifications = createTable("notifications", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	userId: t.text("user_id").references(() => users.id, { onDelete: "cascade" }),
	title: t.text("title").notNull(),
	message: t.text("message").notNull(),
	type: t.text("type").notNull().default("info"),
	isRead: t.boolean("is_read").notNull().default(false),
	relatedId: t.text("related_id"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
})



// ── Template stubs (required by examples/todos + tickets modules) ────────────
export const todos = createTable("todos", {
	id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
	title: t.text("title").notNull(),
	completed: t.boolean("completed").notNull().default(false),
	authorId: t.text("author_id").references(() => users.id, { onDelete: "cascade" }),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
})

export const tickets = createTable("tickets", {
	id: t.text("id").primaryKey().default("gen_random_uuid()"),
	subject: t.text("subject").notNull(),
	description: t.text("description"),
	status: t.text("status").notNull().default("open"),
	priority: t.text("priority").notNull().default("medium"),
	email: t.text("email"),
	authorId: t.text("author_id").references(() => users.id, { onDelete: "set null" }),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
})

// Named schema export required by client.ts
export const schema = {
	users, sessions, accounts, verifications,
	complainants, respondents, complaints,
	caseActivities, documents, feeComputations,
	auditLogs, notifications, todos, tickets,
}
