import { IsEmail, IsString, Matches } from "class-validator"
import { REGEX } from "src/configs/constants"

export class SignUpDto {
  @IsString()
  fullName: string

  @IsString()
  @Matches(REGEX.PHONE)
  phone: string

  @IsEmail()
  @Matches(REGEX.EMAIL)
  email: string

  @IsString()
  @Matches(REGEX.PASSWORD)
  password: string
}
