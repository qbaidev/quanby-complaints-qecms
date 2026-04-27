import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { RespondentsService } from "./respondents.service"
@AllowAnonymous()
@Controller({ path: "respondents", version: "1" })
export class RespondentsController {
	constructor(private readonly svc: RespondentsService) {}
	@Get() findAll() { return this.svc.findAll() }
	@Get(":id") findOne(@Param("id") id: string) { return this.svc.findOne(id) }
	@Post() create(@Body() body: any) { return this.svc.create(body) }
	@Patch(":id") update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body) }
	@Delete(":id") remove(@Param("id") id: string) { return this.svc.remove(id) }
}
