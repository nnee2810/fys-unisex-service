import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { google, identitytoolkit_v3 } from "googleapis"
import { addCountryCode } from "src/utils"
import { SendOTPDto, VerifyOTPDto } from "./dto"

@Injectable()
export class SmsService {
  private identityToolkit: identitytoolkit_v3.Identitytoolkit

  constructor() {
    this.identityToolkit = google.identitytoolkit({
      auth: process.env.GCP_API_KEY,
      version: "v3",
    })
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
      let message = ""
      switch (error?.message) {
        case "TOO_MANY_ATTEMPTS_TRY_LATER": {
          message = "Gửi quá nhiều yêu cầu, vui lòng thử lại sau"
          break
        }
        default: {
          message = error?.message
          break
        }
      }
      throw new InternalServerErrorException(message)
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
        default: {
          message = error?.message
          break
        }
      }
      throw new InternalServerErrorException(message)
    }
  }
}
