import { IsEmail, IsPhoneNumber, IsString, Matches } from "class-validator"
import { Regex } from "src/configs/constants"

export class CreateUserDto {
  @IsString()
  name: string

  @IsString()
  @IsPhoneNumber("VN")
  phone: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
