import { IsOptional, IsString, Matches } from "class-validator"
import { Regex } from "src/configs/constants"

export class SignInByPasswordDto {
  @IsOptional()
  @IsString()
  @Matches(Regex.EMAIL)
  email?: string

  @IsOptional()
  @IsString()
  @Matches(Regex.PHONE)
  phone?: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
