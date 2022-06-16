import { IsOptional, IsString } from "class-validator"
import { UserGender } from "src/entities"

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  gender?: UserGender
}
