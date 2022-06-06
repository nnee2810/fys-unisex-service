import {
  ArrayContains,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  Min,
} from "class-validator"
import {
  ProductClassify,
  ProductGender,
  ProductSize,
} from "../entities/product.entity"

export class CreateProductDto {
  @IsString()
  name: string

  @IsString({ each: true })
  images: string[]

  @IsString()
  @IsIn(Object.keys(ProductClassify))
  classify: ProductClassify

  @IsString()
  @IsIn(Object.keys(ProductGender))
  gender: ProductGender

  @IsString()
  @IsArray()
  @ArrayContains(Object.keys(ProductSize))
  sizes: ProductSize[]

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(0)
  salePrice: number

  @IsBoolean()
  onSale: boolean

  @IsBoolean()
  inSale: boolean

  @IsBoolean()
  inStock: boolean

  @IsBoolean()
  isFeatured: boolean
}
