import { IsOptional, IsString } from "class-validator"
import { UserGender } from "../entities/user.entity"

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  gender?: UserGender
}
