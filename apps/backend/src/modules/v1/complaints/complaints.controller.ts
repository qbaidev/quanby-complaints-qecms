import { Controller, Get, Post, Patch, Param, Body } from "@nestjs/common"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { ComplaintsService } from "./complaints.service"

@AllowAnonymous()
@Controller({ path: "complaints", version: "1" })
export class ComplaintsController {
	constructor(private readonly svc: ComplaintsService) {}

	@Get() findAll() { return this.svc.findAll() }
	@Get("stats") getStats() { return this.svc.getStats() }
	@Get(":id") findOne(@Param("id") id: string) { return this.svc.findOne(id) }
	@Get(":id/activities") getActivities(@Param("id") id: string) { return this.svc.getActivities(id) }
	@Post() create(@Body() body: any) { return this.svc.create(body) }
	@Patch(":id") update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body) }
	@Post(":id/activities") addActivity(@Param("id") id: string, @Body() body: any) { return this.svc.addActivity(id, body) }
}
