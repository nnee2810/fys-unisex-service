import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Message } from "src/configs/constants"
import { AddressEntity, UserEntity } from "src/entities"
import { avatarFileFilter, IResponse, successResponse } from "src/helpers"
import { AddressService } from "../address/address.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { SmsService } from "../sms/sms.service"
import {
  CreateAddressDto,
  UpdateAddressDto,
  UpdatePhoneDto,
  UpdateProfileDto,
} from "./dto"
import { UserService } from "./user.service"

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private smsService: SmsService,
  ) {}

  @Get("get-profile")
  async getProfile(@Req() req): Promise<IResponse<UserEntity>> {
    return successResponse(req.user)
  }

  @Patch("update-profile")
  async updateProfile(
    @Req() req,
    @Body() body: UpdateProfileDto,
  ): Promise<IResponse<null>> {
    await this.userService.updateUser({ id: req.user.id }, body)
    return successResponse(null, "UPDATE_PROFILE_SUCCESS")
  }

  @Patch("update-phone")
  async updatePhone(
    @Req() req,
    @Body() { otp, session_info, new_phone }: UpdatePhoneDto,
  ): Promise<IResponse<null>> {
    const user = await this.userService.getUser({
      where: {
        phone: new_phone,
      },
    })
    if (user) throw new BadRequestException(Message.PHONE_ALREADY_EXIST)
    await this.smsService.verifyOTP({
      otp,
      session_info,
    })
    await this.userService.updateUser(
      {
        id: req.user.id,
      },
      {
        phone: new_phone,
      },
    )
    return successResponse(null, "UPDATE_PHONE_SUCCESS")
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
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<string>> {
    const src = await this.userService.updateAvatar(req.user.id, file)
    return successResponse(src, "UPDATE_AVATAR_SUCCESS")
  }

  @Post("create-address")
  async createAddress(
    @Req() req,
    @Body() body: CreateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.createAddress(req.user.id, body)
    return successResponse(address, "CREATE_ADDRESS_SUCCESS")
  }

  @Get("get-address-list")
  async getAddressList(@Req() req): Promise<IResponse<AddressEntity[]>> {
    const addressList = await this.addressService.getAddressList(req.user.id)
    return successResponse(addressList)
  }

  @Patch("update-address/:id")
  async updateAddress(
    @Req() req,
    @Param("id") id: string,
    @Body() body: UpdateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.updateAddress(
      req.user.id,
      id,
      body,
    )
    return successResponse(address, "UPDATE_ADDRESS_SUCCESS")
  }

  @Delete("delete-address/:id")
  async deleteAddress(@Param("id") id: string): Promise<IResponse<null>> {
    await this.addressService.deleteAddressById(id)
    return successResponse(null, "DELETE_ADDRESS_SUCCESS")
  }
}
