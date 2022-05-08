import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateProductDto {
  @IsString()
  name: string

  @IsOptional()
  @IsArray()
  images?: string[]

  @IsString()
  type: string

  @IsString()
  gender: string

  @IsNumber()
  price: number

  @IsOptional()
  @IsNumber()
  forSale: boolean

  @IsOptional()
  @IsNumber()
  salePrice?: number

  @IsOptional()
  @IsBoolean()
  isSale?: boolean

  @IsOptional()
  @IsBoolean()
  inStock?: boolean

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean
}
