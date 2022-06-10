import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"
import { IPagination, IResponse, successResponse } from "src/helpers/response"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto } from "./dto/get-products-dto"
import { ProductEntity } from "./entities/product.entity"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productsService.createProduct(body)
    return successResponse(product)
  }

  @Get()
  async getProducts(
    @Query()
    query: GetProductsDto,
  ): Promise<IResponse<IPagination<ProductEntity[]>>> {
    return successResponse(await this.productsService.getProducts(query))
  }

  @Get(":id")
  async getProduct(@Param("id") id: string): Promise<IResponse<ProductEntity>> {
    const product = await this.productsService.getProduct(id)
    return successResponse(product)
  }
}
