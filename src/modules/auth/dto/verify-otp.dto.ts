import { IsString } from "class-validator"

export class VerifyOTPDto {
  @IsString()
  otp: string

  @IsString()
  session_info: string
}
