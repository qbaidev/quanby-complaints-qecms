import { Module } from "@nestjs/common"
import { ComplainantsController } from "./complainants.controller"
import { ComplainantsService } from "./complainants.service"
@Module({ controllers: [ComplainantsController], providers: [ComplainantsService] })
export class ComplainantsModule {}
