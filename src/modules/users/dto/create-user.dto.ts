import { IsString, Matches } from "class-validator"
import { Regex } from "src/configs/constants"

export class CreateUserDto {
  @IsString()
  fullName: string

  @IsString()
  @Matches(Regex.PHONE)
  phone: string

  @IsString()
  @Matches(Regex.EMAIL)
  email: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
