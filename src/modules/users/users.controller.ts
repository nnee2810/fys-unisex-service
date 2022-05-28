import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers/response"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import { Role, UserEntity } from "./entities/user.entity"
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
  ): Promise<IResponse<UserEntity>> {
    if (req.user.id !== id && req.user.role !== Role.Admin)
      throw new ForbiddenException()
    const profile = await this.usersService.updateUserProfile(id, body)
    return successResponse(profile)
  }
}
