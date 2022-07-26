import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ProductEntity, UserRole } from "src/entities"
import {
  imageFileFilter,
  IPagination,
  IResponse,
  successResponse,
} from "src/helpers"
import { PublicRoute, Roles } from "../auth/decorators"
import { CreateProductDto, GetProductsDto, UpdateProductDto } from "./dto"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post("create-product")
  @Roles([UserRole.MOD, UserRole.ADMIN])
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productService.create(body)
    return successResponse(product, "CREATE_PRODUCT_SUCCESS")
  }

  @PublicRoute()
  @Get("get-products")
  async getProducts(
    @Query()
    query: GetProductsDto,
  ): Promise<IResponse<IPagination<ProductEntity[]>>> {
    const products = await this.productService.find(query)
    return successResponse(products, "GET_PRODUCTS_SUCCESS")
  }

  @PublicRoute()
  @Get("get-product/:id")
  async getProductById(
    @Param("id") id: string,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productService.findById(id)
    return successResponse(product, "GET_PRODUCT_SUCCESS")
  }

  @Patch("update-product/:id")
  @Roles([UserRole.MOD, UserRole.ADMIN])
  async updateProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
  ): Promise<IResponse<null>> {
    await this.productService.update(id, body)
    return successResponse(null, "UPDATE_PRODUCT_SUCCESS")
  }

  @Delete("delete-product/:id")
  @Roles([UserRole.MOD, UserRole.ADMIN])
  async deleteProduct(@Param("id") id: string): Promise<IResponse<null>> {
    await this.productService.delete(id)
    return successResponse(null, "DELETE_PRODUCT_SUCCESS")
  }

  @Post("upload-product-image/:id")
  @Roles([UserRole.MOD, UserRole.ADMIN])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
      limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadProductImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse<null>> {
    await this.productService.uploadImage(id, file)
    return successResponse(null, "UPLOAD_PRODUCT_IMAGE_SUCCESS")
  }

  @Roles([UserRole.MOD, UserRole.ADMIN])
  @Delete("delete-product-image/:id")
  async deleteProductImage(@Param("id") id: string): Promise<IResponse<null>> {
    await this.productService.deleteImage(id)
    return successResponse(null, "DELETE_PRODUCT_IMAGE_SUCCESS")
  }
}
