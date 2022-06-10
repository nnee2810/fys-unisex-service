import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { avatarFileFilter } from "src/helpers/fileFilter"
import { IResponse, successResponse } from "src/helpers/response"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import { UserEntity } from "./entities/user.entity"
import { UsersService } from "./users.service"

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("profile")
  async getUserProfile(@Request() req): Promise<IResponse<UserEntity>> {
    return successResponse(req.user)
  }

  @Get("profile/:id")
  async getUserProfileById(
    @Request() req,
    @Param("id") id: string,
  ): Promise<IResponse<UserEntity>> {
    if (req.user.id === id) return successResponse(req.user)
    const user = await this.usersService.getUserById(id)
    if (!user) throw new NotFoundException()
    return successResponse(user)
  }

  @Patch("profile")
  async updateUserProfile(
    @Request() req,
    @Body() body: UpdateUserProfileDto,
  ): Promise<IResponse<string>> {
    await this.usersService.updateUserProfile(req.user.id, body)
    return successResponse(req.user.id)
  }

  @Patch("profile/:id")
  async updateUserProfileById(
    @Param("id") id: string,
    @Body() body: UpdateUserProfileDto,
  ): Promise<IResponse<UserEntity>> {
    const user = await this.usersService.updateUserProfile(id, body)
    return successResponse(user)
  }

  @Patch("avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: avatarFileFilter,
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async updateUserAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<string>> {
    const src = await this.usersService.updateUserAvatar(req.user.id, file)
    return successResponse(src)
  }
}
