import { BadRequestException, Body, Controller, Post } from "@nestjs/common"
import { Message } from "src/configs/constants"
import { IResponse, successResponse } from "src/helpers"
import { CreateUserDto } from "../user/dto"
import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { ActionOTP, SendOTPDto, SignInByPasswordDto, VerifyOTPDto } from "./dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() body: SignInByPasswordDto): Promise<IResponse<string>> {
    const accessToken = await this.authService.signIn(body)
    return successResponse(accessToken)
  }

  @Post("sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<IResponse<string>> {
    await this.userService.createUser(body)
    return successResponse("SIGN_UP_SUCCESS")
  }

  @Post("send-otp")
  async sendOTP(@Body() body: SendOTPDto): Promise<IResponse<string>> {
    switch (body.action) {
      case ActionOTP.SIGN_UP: {
        const user = await this.userService.getUser({
          where: {
            phone: body.phone,
          },
        })
        if (user) throw new BadRequestException(Message.PHONE_ALREADY_EXIST)
        break
      }
    }
    const sessionInfo = await this.authService.sendOTP(body)
    return successResponse(sessionInfo)
  }

  @Post("verify-otp")
  async checkPhone(@Body() data: VerifyOTPDto): Promise<IResponse<null>> {
    await this.authService.verifyOTP(data)
    return successResponse(null)
  }
}
