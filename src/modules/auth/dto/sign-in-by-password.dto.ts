import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Matches,
} from "class-validator"
import { Regex } from "src/configs/constants"

export class SignInByPasswordDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsMobilePhone("vi-VN")
  phone?: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string
}
