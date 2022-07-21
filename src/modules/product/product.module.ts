import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProductEntity, ProductImageEntity } from "src/entities"
import { UploadModule } from "../upload/upload.module"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    UploadModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
