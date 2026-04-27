import { db } from "../common/database/database.client"
import { complainants, respondents, complaints, caseActivities, auditLogs } from "@repo/db/schema"

async function seed() {
	console.log("🌱 Seeding QECMS mock data…")

	// Complainants
	const complainantData = [
		{ id: crypto.randomUUID(), fullName: "Maria Santos", email: "maria.santos@gmail.com", contactNo: "09171234567", address: "123 Rizal St, Quezon City", idType: "PhilSys", idNo: "1234-5678-9012" },
		{ id: crypto.randomUUID(), fullName: "Juan Dela Cruz", email: "jdelacruz@yahoo.com", contactNo: "09281234567", address: "456 Mabini Ave, Manila", idType: "Passport", idNo: "P1234567A" },
		{ id: crypto.randomUUID(), fullName: "Ana Reyes", email: "ana.reyes@outlook.com", contactNo: "09391234567", address: "789 Bonifacio Rd, Makati", idType: "Driver's License", idNo: "N01-23-456789" },
		{ id: crypto.randomUUID(), fullName: "Pedro Bautista", email: "pedro.b@gmail.com", contactNo: "09501234567", address: "321 Luna St, Cebu City", idType: "UMID", idNo: "0012-3456789-0" },
		{ id: crypto.randomUUID(), fullName: "Rosa Aquino", email: "rosa.aquino@gmail.com", contactNo: "09611234567", address: "654 Burgos St, Davao City", idType: "Voter's ID", idNo: "1234567890" },
		{ id: crypto.randomUUID(), fullName: "Carlo Mendoza", email: "carlo.m@company.ph", contactNo: "09721234567", address: "987 Quezon Ave, Pasig", idType: "PhilSys", idNo: "9876-5432-1098" },
	]
	await db.insert(complainants).values(complainantData).onConflictDoNothing()

	// Respondents
	const respondentData = [
		{ id: crypto.randomUUID(), name: "BDO Unibank, Inc.", type: "organization", email: "dpo@bdo.com.ph", contactNo: "02-8631-8000", registrationNo: "SEC-CS200506822" },
		{ id: crypto.randomUUID(), name: "Lazada Philippines", type: "organization", email: "privacy@lazada.com.ph", contactNo: "02-7795-8900", registrationNo: "SEC-CS201517865" },
		{ id: crypto.randomUUID(), name: "Globe Telecom, Inc.", type: "organization", email: "dpo@globe.com.ph", contactNo: "02-7301-0000", registrationNo: "SEC-CS199401303" },
		{ id: crypto.randomUUID(), name: "Department of Health", type: "government", email: "records@doh.gov.ph", contactNo: "02-8651-7800", registrationNo: "NGA-DOH" },
		{ id: crypto.randomUUID(), name: "Shopee Philippines", type: "organization", email: "privacy@shopee.ph", contactNo: "02-8888-8888", registrationNo: "SEC-CS201619647" },
	]
	await db.insert(respondents).values(respondentData).onConflictDoNothing()

	// Complaints
	const statuses = ["intake", "docketed", "assigned", "under_investigation", "mediation", "resolution", "closed"]
	const priorities = ["low", "medium", "high", "critical"]
	const categories = ["data_breach", "unauthorized_processing", "improper_disposal", "denial_of_rights", "other"]
	const channels = ["online", "walk_in", "email", "mail"]
	const complaintData = [
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00001", title: "Unauthorized sharing of personal data to third parties", status: "under_investigation", priority: "high", category: "unauthorized_processing", channel: "online", complainantId: complainantData[0]!.id, respondentId: respondentData[0]!.id, slaDeadline: new Date(Date.now() - 5 * 86400000), aiClassification: "Unauthorized Processing", aiSummary: "Complainant alleges that their personal data was shared without consent.", aiSentiment: "negative" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00002", title: "Data breach exposing customer financial records", status: "docketed", priority: "critical", category: "data_breach", channel: "email", complainantId: complainantData[1]!.id, respondentId: respondentData[1]!.id, slaDeadline: new Date(Date.now() + 10 * 86400000), aiClassification: "Data Breach", aiSummary: "Large-scale breach affecting thousands of customer records.", aiSentiment: "urgent" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00003", title: "Denial of data subject access request", status: "assigned", priority: "medium", category: "denial_of_rights", channel: "walk_in", complainantId: complainantData[2]!.id, respondentId: respondentData[2]!.id, slaDeadline: new Date(Date.now() + 15 * 86400000), aiClassification: "Rights Violation", aiSummary: "Subject's request for data copy denied multiple times.", aiSentiment: "negative" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00004", title: "Improper disposal of medical records", status: "mediation", priority: "high", category: "improper_disposal", channel: "mail", complainantId: complainantData[3]!.id, respondentId: respondentData[3]!.id, slaDeadline: new Date(Date.now() + 7 * 86400000), aiClassification: "Improper Disposal", aiSummary: "Hospital discarded physical patient records in open dumpster.", aiSentiment: "urgent" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00005", title: "Collection of unnecessary personal information", status: "intake", priority: "low", category: "unauthorized_processing", channel: "online", complainantId: complainantData[4]!.id, respondentId: respondentData[4]!.id, slaDeadline: new Date(Date.now() + 25 * 86400000), aiClassification: "Excessive Collection", aiSummary: "App collecting biometric data not required for service.", aiSentiment: "neutral" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00006", title: "Personal data used for unsolicited marketing", status: "resolution", priority: "medium", category: "unauthorized_processing", channel: "online", complainantId: complainantData[5]!.id, respondentId: respondentData[0]!.id, slaDeadline: new Date(Date.now() + 3 * 86400000), aiClassification: "Unauthorized Use", aiSummary: "Customer data used for marketing without explicit consent.", aiSentiment: "negative" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00007", title: "Security lapse exposing login credentials", status: "closed", priority: "critical", category: "data_breach", channel: "email", complainantId: complainantData[0]!.id, respondentId: respondentData[1]!.id, slaDeadline: new Date(Date.now() - 20 * 86400000), aiClassification: "Data Breach", aiSummary: "Credentials stored in plaintext exposed in public repository.", aiSentiment: "urgent" },
		{ id: crypto.randomUUID(), caseNo: "NPC-2024-00008", title: "Refusal to delete personal data upon request", status: "under_investigation", priority: "medium", category: "denial_of_rights", channel: "online", complainantId: complainantData[2]!.id, respondentId: respondentData[2]!.id, slaDeadline: new Date(Date.now() + 12 * 86400000), aiClassification: "Rights Violation", aiSummary: "Right to erasure not honored despite repeated requests.", aiSentiment: "negative" },
	].map(c => ({ ...c, description: c.aiSummary, updatedAt: new Date() }))
	await db.insert(complaints).values(complaintData).onConflictDoNothing()

	// Case activities
	const activityData = complaintData.slice(0, 4).map(c => ({
		id: crypto.randomUUID(), complaintId: c.id, activityType: "note",
		description: `Initial review completed. AI classification: ${c.aiClassification}. Case assigned for investigation.`,
	}))
	await db.insert(caseActivities).values(activityData).onConflictDoNothing()

	// Audit logs
	const auditData = [
		{ id: crypto.randomUUID(), action: "CREATE", resource: "complaint", resourceId: complaintData[0]!.id, details: { caseNo: "NPC-2024-00001" } },
		{ id: crypto.randomUUID(), action: "UPDATE", resource: "complaint", resourceId: complaintData[1]!.id, details: { status: "docketed" } },
		{ id: crypto.randomUUID(), action: "READ", resource: "complainant", resourceId: complainantData[0]!.id, details: {} },
		{ id: crypto.randomUUID(), action: "CREATE", resource: "complainant", resourceId: complainantData[2]!.id, details: { name: "Ana Reyes" } },
		{ id: crypto.randomUUID(), action: "UPDATE", resource: "complaint", resourceId: complaintData[3]!.id, details: { status: "mediation" } },
	]
	await db.insert(auditLogs).values(auditData).onConflictDoNothing()

	console.log("✅ QECMS seed complete")
	console.log(`   ${complainantData.length} complainants, ${respondentData.length} respondents, ${complaintData.length} complaints`)
	process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
