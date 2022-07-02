import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { google, identitytoolkit_v3 } from "googleapis"
import { Message } from "src/configs/constants"
import { addCountryCode } from "src/utils"
import { UserService } from "../user/user.service"
import { SendOTPDto, SignInByPasswordDto, VerifyOTPDto } from "./dto"

@Injectable()
export class AuthService {
  private identityToolkit: identitytoolkit_v3.Identitytoolkit

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.identityToolkit = google.identitytoolkit({
      auth: process.env.GCP_API_KEY,
      version: "v3",
    })
  }

  async signIn({ phone, password }: SignInByPasswordDto): Promise<string> {
    const user = await this.userService.getUser({
      select: {
        id: true,
        password: true,
      },
      where: {
        phone,
      },
    })

    if (!user) throw new UnauthorizedException(Message.SIGN_IN_FAIL)
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(Message.SIGN_IN_FAIL)

    const accessToken = this.jwtService.sign({
      id: user.id,
    })

    return accessToken
  }

  async sendOTP({ phone, recaptcha_token }: SendOTPDto): Promise<string> {
    try {
      const res = await this.identityToolkit.relyingparty.sendVerificationCode({
        requestBody: {
          phoneNumber: addCountryCode(phone),
          recaptchaToken: recaptcha_token,
        },
      })
      return res.data.sessionInfo
    } catch (error) {
      console.log(error.response)
      throw new InternalServerErrorException()
    }
  }

  async verifyOTP({ otp, session_info }: VerifyOTPDto) {
    try {
      await this.identityToolkit.relyingparty.verifyPhoneNumber({
        requestBody: {
          code: otp,
          sessionInfo: session_info,
        },
      })
    } catch (error) {
      console.log(error?.message)
      let message = ""
      switch (error?.message) {
        case "INVALID_CODE": {
          message = "Mã xác minh không chính xác"
          break
        }
        case "SESSION_EXPIRED": {
          message = "Mã xác minh đã hết hạn"
          break
        }
      }
      throw new InternalServerErrorException(message)
    }
  }
}
