import { IsIn, IsPhoneNumber, IsString, MaxLength } from "class-validator"

export enum ActionOTP {
  SIGN_IN,
  SIGN_UP,
  RESET_PASSWORD,
  UPDATE_PHONE,
}

export class SendOTPDto {
  @IsIn(Object.values(ActionOTP))
  action: number

  @IsPhoneNumber("VN")
  @MaxLength(10)
  phone: string

  @IsString()
  recaptcha_token: string
}
