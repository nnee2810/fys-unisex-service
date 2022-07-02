import { IsIn, IsPhoneNumber, IsString, MaxLength } from "class-validator"

export enum ActionOTP {
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
}

export class SendOTPDto {
  @IsPhoneNumber("VN")
  @MaxLength(10)
  phone: string

  @IsString()
  recaptcha_token: string

  @IsIn(Object.values(ActionOTP))
  action: number
}
