import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { S3 } from "aws-sdk"
import { FileUploadEntity, UserEntity } from "src/entities"
import { getAwsCloudFrontUrl } from "src/utils"
import { Repository } from "typeorm"
import { v4 } from "uuid"

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FileUploadEntity)
    private uploadRepository: Repository<FileUploadEntity>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    relations?: {
      user?: UserEntity
    },
  ): Promise<FileUploadEntity> {
    const s3 = new S3()
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: v4(),
      })
      .promise()
    const fileUpload = this.uploadRepository.create({
      src: getAwsCloudFrontUrl(uploadResult.Key),
      key: uploadResult.Key,
      ...relations,
    })
    await this.uploadRepository.insert(fileUpload)
    return fileUpload
  }

  async deleteFile(id: string): Promise<void> {
    const s3 = new S3()
    const fileUpload = await this.uploadRepository.findOne({ where: { id } })
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileUpload.key,
      })
      .promise()
    await this.uploadRepository.delete(id)
  }
}
