import { IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator"
import { Regex } from "src/configs/constants"

export class SignInByPasswordDto {
  @IsPhoneNumber("VN")
  @MaxLength(10)
  phone: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
