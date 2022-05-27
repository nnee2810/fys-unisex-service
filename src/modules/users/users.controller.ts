import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers/response"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import { UsersService } from "./users.service"

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  getUserProfile(@Request() req): IResponse<any> {
    return successResponse(req.user)
  }

  @Patch("profile/:id")
  async updateUserProfile(
    @Request() req,
    @Param("id") id: string,
    @Body() body: UpdateUserProfileDto,
  ): Promise<IResponse<any>> {
    const profile = await this.usersService.updateUserProfile(id, body)

    return successResponse(req.user)
  }
}
