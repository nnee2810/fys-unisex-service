import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import {
  Product,
  ProductDocument,
} from "src/modules/products/schemas/product.shema"
import {
  PaginationData,
  paginationResponse,
  Response,
  successResponse,
} from "src/utils/response"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto } from "./dto/get-products-dto"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() query: GetProductsDto,
  ): Promise<Response<PaginationData<Product[]>>> {
    const products = await this.productsService.getProducts(query)
    return paginationResponse(products)
  }

  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<Response<ProductDocument>> {
    const product = await this.productsService.createProduct(body)
    return successResponse(product)
  }
}
