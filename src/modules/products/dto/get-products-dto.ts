import { Type } from "class-transformer"
import { IsBoolean, IsIn, IsNumber, IsOptional } from "class-validator"
import { PaginationDto } from "src/dto/pagination-dto"
import {
  ProductClassify,
  ProductGender,
  ProductSize,
} from "../entities/product.entity"

export enum ProductSort {
  TIME = "TIME",
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
  PERCENT = "PERCENT",
}

export class GetProductsDto extends PaginationDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @IsIn(Object.keys(ProductClassify))
  classify?: ProductClassify

  @IsOptional()
  @IsIn(Object.keys(ProductGender))
  gender?: ProductGender

  @IsOptional()
  @IsIn(Object.keys(ProductSize))
  size?: ProductSize

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  onSale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inSale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inStock?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean

  @IsOptional()
  @IsIn(Object.keys(ProductSort))
  sort?: ProductSort
}
