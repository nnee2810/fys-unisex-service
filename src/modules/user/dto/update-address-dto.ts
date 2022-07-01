import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator"

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsPhoneNumber("VN")
  phone?: string

  @IsOptional()
  @IsNumber()
  province_code?: number

  @IsOptional()
  @IsNumber()
  district_code?: number

  @IsOptional()
  @IsNumber()
  ward_code?: number

  @IsOptional()
  @IsString()
  address_detail?: string

  @IsOptional()
  @IsBoolean()
  is_default?: boolean
}
