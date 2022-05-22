import { Controller, Get, Request, UseGuards } from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers/response"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("users")
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req): IResponse<any> {
    return successResponse(req.user)
  }
}
