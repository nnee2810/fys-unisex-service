import {
  IsBoolean,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsMobilePhone("vi-VN")
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
