import { IsString, Matches } from "class-validator"
import { REGEX } from "src/configs/constants"

export class CreateUserDto {
  @IsString()
  fullName: string

  @IsString()
  @Matches(REGEX.PHONE)
  phone: string

  @IsString()
  @Matches(REGEX.EMAIL)
  email: string

  @IsString()
  @Matches(REGEX.PASSWORD)
  password: string
}
