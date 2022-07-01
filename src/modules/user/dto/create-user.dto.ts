import { IsNumber, IsPhoneNumber, IsString, Matches } from "class-validator"
import { Regex } from "src/configs/constants"

export class CreateUserDto {
  @IsPhoneNumber("VN")
  phone: string

  @IsString()
  @Matches(Regex.PASSWORD)
  password: string

  @IsString()
  name: string

  @IsNumber()
  province_code: number

  @IsNumber()
  district_code: number

  @IsNumber()
  ward_code: number

  @IsString()
  address_detail: string
}