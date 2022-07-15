import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ProductEntity } from "src/entities"
import { IPagination, IResponse, successResponse } from "src/helpers"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CreateProductDto, GetProductListDto, UpdateProductDto } from "./dto"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch("update-product/:id")
  async updateProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
  ): Promise<IResponse<null>> {
    await this.productService.getProductById(id)
    await this.productService.updateProduct(id, body)
    return successResponse(null, "UPDATE_PRODUCT_SUCCESS")
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-product/:id")
  async deleteProduct(@Param("id") id: string): Promise<IResponse<null>> {
    await this.productService.deleteProduct(id)
    return successResponse(null, "DELETE_PRODUCT_SUCCESS")
  }
}
