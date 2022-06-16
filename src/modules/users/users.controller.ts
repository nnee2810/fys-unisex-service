import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { AddressEntity, UserEntity } from "src/entities"
import { avatarFileFilter, IResponse, successResponse } from "src/helpers"
import { AddressService } from "../address/address.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateAddressDto, UpdateProfileDto } from "./dto"
import { UsersService } from "./users.service"

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private addressService: AddressService,
  ) {}

  @Get("profile")
  async getProfile(@Request() req): Promise<IResponse<UserEntity>> {
    return successResponse(req.user)
  }

  @Patch("profile")
  async updateProfile(
    @Request() req,
    @Body() body: UpdateProfileDto,
  ): Promise<IResponse<UserEntity>> {
    const user = await this.usersService.updateProfile(req.user.id, body)
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
  async updateAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<string>> {
    const src = await this.usersService.updateAvatar(req.user.id, file)
    return successResponse(src)
  }

  @Post("address")
  async createAddress(
    @Request() req,
    @Body() body: CreateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.createAddress(req.user.id, body)
    return successResponse(address)
  }

  @Get("address-list")
  async getAddressList(@Request() req): Promise<IResponse<AddressEntity[]>> {
    const addressList = (
      await this.usersService.getUserById(req.user.id, {
        relations: {
          address_list: true,
        },
      })
    ).address_list
    return successResponse(addressList)
  }
}
