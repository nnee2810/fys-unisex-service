import { Type } from "class-transformer"
import { IsNumber, IsOptional, Min } from "class-validator"
import { LIMIT_PER_PAGE } from "src/configs/constants"

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page?: number = 0

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = LIMIT_PER_PAGE
}
