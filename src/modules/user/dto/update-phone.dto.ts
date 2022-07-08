import { IsPhoneNumber, IsString, MaxLength } from "class-validator"

export class UpdatePhoneDto {
  @IsString()
  otp: string

  @IsString()
  session_info: string

  @IsPhoneNumber("VN")
  @MaxLength(10)
  new_phone: string
}
