import { Controller, Get, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { JwtStrategy } from "./modules/auth/jwt.strategy"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtStrategy)
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
