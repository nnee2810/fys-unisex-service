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
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Message } from "src/configs/constants"
import { AddressEntity, UserEntity } from "src/entities"
import { imageFileFilter, IResponse, successResponse } from "src/helpers"
import { RequestWithUser } from "src/interfaces"
import { AddressService } from "../address/address.service"
import { SmsService } from "../sms/sms.service"
import { UploadService } from "../upload/upload.service"
import {
  CreateAddressDto,
  UpdateAddressDto,
  UpdatePhoneDto,
  UpdateProfileDto,
} from "./dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private smsService: SmsService,
    private uploadService: UploadService,
  ) {}

  @Get("get-profile")
  async getProfile(
    @Req() req: RequestWithUser,
  ): Promise<IResponse<UserEntity>> {
    return successResponse(req.user, "GET_PROFILE_SUCCESS")
  }

  @Patch("update-profile")
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileDto,
  ): Promise<IResponse<null>> {
    await this.userService.update({ id: req.user.id }, body)
    return successResponse(null, "UPDATE_PROFILE_SUCCESS")
  }

  @Patch("update-phone")
  async updatePhone(
    @Req() req: RequestWithUser,
    @Body() { otp, session_info, new_phone }: UpdatePhoneDto,
  ): Promise<IResponse<null>> {
    const user = await this.userService.findOne({
      where: {
        phone: new_phone,
      },
    })
    if (user) throw new BadRequestException(Message.PHONE_ALREADY_EXIST)
    await this.smsService.verifyOTP({
      otp,
      session_info,
    })
    await this.userService.update(
      {
        id: req.user.id,
      },
      {
        phone: new_phone,
      },
    )
    return successResponse(null, "UPDATE_PHONE_SUCCESS")
  }

  @Post("upload-avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<string>> {
    if (req.user.avatar) await this.uploadService.delete(req.user.avatar)
    const key = await this.userService.uploadAvatar(req.user.id, file)
    return successResponse(key, "UPLOAD_AVATAR_SUCCESS")
  }

  @Post("create-address")
  async createAddress(
    @Req() req: RequestWithUser,
    @Body() body: CreateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.create(req.user.id, body)
    return successResponse(address, "CREATE_ADDRESS_SUCCESS")
  }

  @Get("get-addresses")
  async getAddresses(
    @Req() req: RequestWithUser,
  ): Promise<IResponse<AddressEntity[]>> {
    const addresses = (
      await this.userService.findOne({
        where: { id: req.user.id },
        relations: {
          addresses: true,
        },
      })
    ).addresses
    return successResponse(addresses, "GET_ADDRESSES_SUCCESS")
  }

  @Patch("update-address/:id")
  async updateAddress(
    @Req() req: RequestWithUser,
    @Param("id") id: string,
    @Body() body: UpdateAddressDto,
  ): Promise<IResponse<AddressEntity>> {
    const address = await this.addressService.update(req.user.id, id, body)
    return successResponse(address, "UPDATE_ADDRESS_SUCCESS")
  }

  @Delete("delete-address/:id")
  async deleteAddress(@Param("id") id: string): Promise<IResponse<null>> {
    await this.addressService.delete(id)
    return successResponse(null, "DELETE_ADDRESS_SUCCESS")
  }
}
