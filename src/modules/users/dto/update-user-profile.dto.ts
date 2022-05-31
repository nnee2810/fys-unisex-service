import { IsIn, IsOptional, IsString } from "class-validator"
import { Gender } from "../entities/user.entity"

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string

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
  @IsIn(["male", "female"])
  gender?: Gender
}
