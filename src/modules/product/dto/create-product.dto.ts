import { IsIn, IsNumber, IsString, Min } from "class-validator"
import { ProductClassify } from "src/entities"

export class CreateProductDto {
  @IsString()
  name: string

  @IsIn(Object.keys(ProductClassify))
  classify: ProductClassify

  @IsNumber()
  @Min(0)
  price: number
}
