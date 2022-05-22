import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common"
import {
  IPaginationData,
  IResponse,
  successResponse,
} from "src/helpers/response"
import { ProductEntity } from "src/modules/products/entities/product.entity"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto } from "./dto/get-products-dto"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() query: GetProductsDto,
  ): Promise<IResponse<IPaginationData<ProductEntity[]>>> {
    const products = await this.productsService.getProducts(query)
    return successResponse(products)
  }

  @Get(":id")
  async getProduct(
    @Param() params: { id: string },
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productsService.getProduct(params.id)
    if (!product) throw new NotFoundException()
    return successResponse(product)
  }

  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productsService.createProduct(body)
    return successResponse(product)
  }
}
