import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"
import { ProductEntity } from "src/entities"
import { IPagination, IResponse, successResponse } from "src/helpers"
import { CreateProductDto, GetProductListDto } from "./dto"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post("create-product")
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productService.createProduct(body)
    return successResponse(product, "CREATE_PRODUCT_SUCCESS")
  }

  @Get("get-product-list")
  async getProductList(
    @Query()
    query: GetProductListDto,
  ): Promise<IResponse<IPagination<ProductEntity[]>>> {
    const productList = await this.productService.getProductList(query)
    return successResponse(productList, "GET_PRODUCT_LIST_SUCCESS")
  }

  @Get("get-product/:id")
  async getProductById(
    @Param("id") id: string,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productService.getProductById(id)
    return successResponse(product, "GET_PRODUCT_SUCCESS")
  }
}
