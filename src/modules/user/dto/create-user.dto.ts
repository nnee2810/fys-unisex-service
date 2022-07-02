import {
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
} from "class-validator"
import { Regex } from "src/configs/constants"

export class CreateUserDto {
  @IsPhoneNumber("VN")
  @MaxLength(10)
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
