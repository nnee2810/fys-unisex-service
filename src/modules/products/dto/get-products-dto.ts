import { Type } from "class-transformer"
import { IsBoolean, IsOptional } from "class-validator"
import { PaginationDto } from "src/dto/pagination-dto"

export class GetProductsDto extends PaginationDto {
  @IsOptional()
  name?: string

  @IsOptional()
  type?: string

  @IsOptional()
  gender?: string

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
}
