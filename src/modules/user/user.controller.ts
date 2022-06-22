import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateAddressDto, UpdateAddressDto, UpdateProfileDto } from "./dto"
import { UserService } from "./user.service"

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
  ) {}

  @Get("get-profile")
  async getProfile(@Request() req): Promise<IResponse<UserEntity>> {
    return successResponse(req.user)
  }

  @Patch("update-profile")
  async updateProfile(
    @Request() req,
    @Body() body: UpdateProfileDto,
  ): Promise<IResponse<UserEntity>> {
    const user = await this.userService.updateProfile(req.user.id, body)
    return successResponse(user)
  }

  @Patch("update-avatar")
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
    const src = await this.userService.updateAvatar(req.user.id, file)
    return successResponse(src)
  }

  @Post("create-address")
  async createAddress(
    @Request() req,
    @Body() body: CreateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.createAddress(req.user.id, body)
    return successResponse(address)
  }

  @Get("get-address-list")
  async getAddressList(@Request() req): Promise<IResponse<AddressEntity[]>> {
    const addressList = await this.addressService.getAddressList(req.user.id)
    return successResponse(addressList)
  }

  @Patch("update-address/:id")
  async updateAddress(
    @Request() req,
    @Param("id") id: string,
    @Body() body: UpdateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.updateAddress(
      req.user.id,
      id,
      body,
    )
    return successResponse(address)
  }

  @Delete("delete-address/:id")
  async deleteAddress(@Param("id") id: string): Promise<IResponse<string>> {
    await this.addressService.deleteAddressById(id)
    return successResponse(id)
  }
}
