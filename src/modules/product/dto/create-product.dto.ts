import {
  ArrayContains,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  Min,
} from "class-validator"
import { ProductClassify, ProductSize } from "src/entities"

export class CreateProductDto {
  @IsString()
  name: string

  @IsString({ each: true })
  images: string[]

  @IsString()
  @IsIn(Object.keys(ProductClassify))
  classify: ProductClassify

  @IsString()
  @IsArray()
  @ArrayContains(Object.keys(ProductSize))
  sizes: ProductSize[]

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(0)
  sale_price: number

  @IsBoolean()
  on_sale: boolean

  @IsBoolean()
  in_sale: boolean

  @IsBoolean()
  in_stock: boolean

  @IsBoolean()
  is_featured: boolean
}
