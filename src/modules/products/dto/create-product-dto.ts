import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
  @IsString()
  name: string

  @IsArray()
  images: string[]

  @IsString()
  type: string

  @IsString()
  gender: string

  @IsNumber()
  price: number

  @IsNumber()
  salePrice: number

  @IsBoolean()
  isSale: boolean

  @IsBoolean()
  inStock: boolean

  @IsBoolean()
  isFeatured: boolean
}
