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
import { ProductEntity } from "src/entities"
import {
  imageFileFilter,
  IPagination,
  IResponse,
  successResponse,
} from "src/helpers"
import { PublicRoute } from "../auth/decorators/public-route.decorator"
import { UploadService } from "../upload/upload.service"
import { CreateProductDto, GetProductListDto, UpdateProductDto } from "./dto"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(
    private productService: ProductService,
    private uploadService: UploadService,
  ) {}

  @Post("create-product")
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<IResponse<ProductEntity>> {
    const product = await this.productService.create(body)
    return successResponse(product, "CREATE_PRODUCT_SUCCESS")
  }

  @PublicRoute()
  @Get("get-product-list")
  async getProductList(
    @Query()
    query: GetProductListDto,
  ): Promise<IResponse<IPagination<ProductEntity[]>>> {
    const productList = await this.productService.find(query)
    return successResponse(productList, "GET_PRODUCT_LIST_SUCCESS")
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
  async updateProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
  ): Promise<IResponse<null>> {
    await this.productService.update(id, body)
    return successResponse(null, "UPDATE_PRODUCT_SUCCESS")
  }

  @Delete("delete-product/:id")
  async deleteProduct(@Param("id") id: string): Promise<IResponse<null>> {
    await this.productService.delete(id)
    return successResponse(null, "DELETE_PRODUCT_SUCCESS")
  }

  @Post("upload-product-image/:id")
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
    const order =
      (await this.productService.findById(id)).images.length + 1 || 1
    await this.productService.uploadImage(id, file, order)
    return successResponse(null, "UPLOAD_PRODUCT_IMAGE_SUCCESS")
  }

  @Delete("delete-product-image/:id")
  async deleteProductImage(@Param("id") id: string): Promise<IResponse<null>> {
    await this.productService.deleteImage(id)
    return successResponse(null, "DELETE_PRODUCT_IMAGE_SUCCESS")
  }
}
