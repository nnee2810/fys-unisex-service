import { IsPhoneNumber, IsString, Matches } from "class-validator"
import { Regex } from "src/configs/constants"

export class SignInByPasswordDto {
  @IsPhoneNumber("VN")
  phone: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
