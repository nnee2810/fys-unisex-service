import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator"
import { ProductClassify } from "src/entities"

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsIn(Object.keys(ProductClassify))
  classify?: ProductClassify

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  sale_price?: number

  @IsOptional()
  @IsBoolean()
  for_sale?: boolean

  @IsOptional()
  @IsBoolean()
  in_sale?: boolean

  @IsOptional()
  @IsBoolean()
  in_stock?: boolean

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean
}
