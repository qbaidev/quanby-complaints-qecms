import { Controller, Get, Post, Body } from "@nestjs/common"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { AuditLogsService } from "./audit-logs.service"
@AllowAnonymous()
@Controller({ path: "audit-logs", version: "1" })
export class AuditLogsController {
	constructor(private readonly svc: AuditLogsService) {}
	@Get() findAll() { return this.svc.findAll() }
	@Post() create(@Body() body: any) { return this.svc.create(body) }
}
