import { BadRequestException, Body, Controller, Post } from "@nestjs/common"
import { Message } from "src/configs/constants"
import { IResponse, successResponse } from "src/helpers"
import { AddressService } from "../address/address.service"
import { ActionOTP, SendOTPDto } from "../sms/dto"
import { SmsService } from "../sms/sms.service"
import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { PublicRoute } from "./decorators/public-route.decorator"
import { ResetPasswordDto, SignInByPasswordDto } from "./dto"
import { SignUpDto } from "./dto/sign-up.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private smsService: SmsService,
    private addressService: AddressService,
  ) {}

  @PublicRoute()
  @Post("send-otp")
  async sendOTP(@Body() body: SendOTPDto): Promise<IResponse<string>> {
    const user = await this.userService.findOne({
      where: {
        phone: body.phone,
      },
    })
    switch (body.action) {
      case (ActionOTP.SIGN_UP, ActionOTP.UPDATE_PHONE): {
        if (user) throw new BadRequestException(Message.PHONE_ALREADY_EXIST)
        break
      }
      case ActionOTP.RESET_PASSWORD: {
        if (!user) throw new BadRequestException(Message.PHONE_DOES_NOT_EXIST)
        break
      }
    }
    const sessionInfo = await this.smsService.sendOTP(body)
    return successResponse(sessionInfo, "SEND_OTP_SUCCESS")
  }

  @PublicRoute()
  @Post("sign-in")
  async signIn(@Body() body: SignInByPasswordDto): Promise<IResponse<string>> {
    const accessToken = await this.authService.signIn(body)
    return successResponse(accessToken, "SIGN_IN_SUCCESS")
  }

  @PublicRoute()
  @Post("sign-up")
  async signUp(
    @Body()
    {
      otp,
      session_info,
      phone,
      password,
      name,
      province_code,
      ward_code,
      district_code,
      address_detail,
    }: SignUpDto,
  ): Promise<IResponse<null>> {
    await this.smsService.verifyOTP({ otp, session_info })
    const user = await this.userService.create({
      phone,
      password,
      name,
    })
    await this.addressService.create(user.id, {
      name,
      phone,
      province_code,
      district_code,
      ward_code,
      address_detail,
      is_default: true,
    })
    return successResponse(null, "SIGN_UP_SUCCESS")
  }

  @PublicRoute()
  @Post("reset-password")
  async resetPassword(
    @Body() { otp, session_info, phone, password }: ResetPasswordDto,
  ): Promise<IResponse<null>> {
    await this.smsService.verifyOTP({ otp, session_info })
    await this.userService.update({ phone }, { password })
    return successResponse(null, "RESET_PASSWORD_SUCCESS")
  }
}
