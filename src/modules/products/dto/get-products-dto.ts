import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional } from "class-validator"
import { PaginationDto } from "src/dto/pagination-dto"

export class GetProductsDto extends PaginationDto {
  @IsOptional()
  name?: string

  @IsOptional()
  type?: string

  @IsOptional()
  gender?: string

  @IsOptional()
  size?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Boolean)
  forSale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inStock?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSale?: boolean

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean

  @IsOptional()
  sort?: "time" | "price-asc" | "price-desc" | "percent"
}
