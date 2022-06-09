import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FileUploadEntity } from "./entities/file-upload.entity"
import { UploadService } from "./upload.service"

@Module({
  imports: [TypeOrmModule.forFeature([FileUploadEntity])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
