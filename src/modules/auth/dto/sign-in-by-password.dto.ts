import { IsOptional, IsString, Matches } from "class-validator"
import { REGEX } from "src/configs/constants"

export class SignInByPasswordDto {
  @IsOptional()
  @IsString()
  @Matches(REGEX.EMAIL)
  email?: string

  @IsOptional()
  @IsString()
  @Matches(REGEX.PHONE)
  phone?: string

  @IsString()
  @Matches(REGEX.PASSWORD)
  password: string
}
