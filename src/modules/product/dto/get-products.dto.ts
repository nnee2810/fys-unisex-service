import { Type } from "class-transformer"
import { IsBoolean, IsIn, IsNumber, IsOptional } from "class-validator"
import { PaginationDto } from "src/dto"
import { ProductClassify } from "src/entities"

export enum ProductSort {
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
  @IsNumber()
  @Type(() => Number)
  min_price?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max_price?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  for_sale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  in_sale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  in_stock?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_featured?: boolean

  @IsOptional()
  @IsIn(Object.keys(ProductSort))
  sort?: ProductSort
}
