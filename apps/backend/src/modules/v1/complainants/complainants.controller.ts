import { Controller, Get, Post, Patch, Param, Body } from "@nestjs/common"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { ComplainantsService } from "./complainants.service"
@AllowAnonymous()
@Controller({ path: "complainants", version: "1" })
export class ComplainantsController {
	constructor(private readonly svc: ComplainantsService) {}
	@Get() findAll() { return this.svc.findAll() }
	@Get(":id") findOne(@Param("id") id: string) { return this.svc.findOne(id) }
	@Post() create(@Body() body: any) { return this.svc.create(body) }
	@Patch(":id") update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body) }
}
