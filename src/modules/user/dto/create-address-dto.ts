import { IsBoolean, IsNumber, IsPhoneNumber, IsString } from "class-validator"

export class CreateAddressDto {
  @IsString()
  name: string

  @IsPhoneNumber("VN")
  phone: string

  @IsNumber()
  province_code: number

  @IsNumber()
  district_code: number

  @IsNumber()
  ward_code: number

  @IsString()
  address_detail: string

  @IsBoolean()
  is_default: boolean
}
