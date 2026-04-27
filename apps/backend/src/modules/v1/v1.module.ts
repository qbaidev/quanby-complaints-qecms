import { Module } from "@nestjs/common"
import { ExamplesModule } from "./examples/examples.module"
import { HealthModule } from "./health/health.module"
import { TicketsModule } from "./tickets/tickets.module"
import { ComplaintsModule } from "./complaints/complaints.module"
import { ComplainantsModule } from "./complainants/complainants.module"
import { RespondentsModule } from "./respondents/respondents.module"
import { AuditLogsModule } from "./audit-logs/audit-logs.module"

@Module({
	imports: [
		ExamplesModule, HealthModule, TicketsModule,
		ComplaintsModule, ComplainantsModule, RespondentsModule, AuditLogsModule,
	],
})
export class V1Module {}
