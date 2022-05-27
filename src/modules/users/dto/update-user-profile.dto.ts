import { ArrayContains, IsOptional, IsString, Matches } from "class-validator"
import { REGEX } from "src/configs/constants"
import { Gender } from "../entities/user.entity"

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  @Matches(REGEX.PHONE)
  phone?: string

  @IsOptional()
  @IsString()
  @Matches(REGEX.EMAIL)
  email?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  province?: string

  @IsOptional()
  @IsString()
  district?: string

  @IsOptional()
  @IsString()
  ward?: string

  @IsOptional()
  @IsString()
  @ArrayContains(["male", "female"])
  gender?: Gender
}
