import { IsPhoneNumber } from "class-validator"

export class CheckPhoneDto {
  @IsPhoneNumber("VN")
  phone: string
}
