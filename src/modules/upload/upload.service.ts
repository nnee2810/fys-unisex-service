import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { S3 } from "aws-sdk"
import { FileUploadEntity } from "src/entities"
import { getAwsCloudFrontUrl } from "src/utils"
import { Repository } from "typeorm"
import { v4 } from "uuid"
import { UploadFileDto } from "./dto"

@Injectable()
export class UploadService {
  private s3 = new S3()

  constructor(
    @InjectRepository(FileUploadEntity)
    private uploadRepository: Repository<FileUploadEntity>,
  ) {}

  async uploadFile({ file, folder }: UploadFileDto): Promise<FileUploadEntity> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: [folder, v4()].join(""),
      })
      .promise()
    const fileUpload = this.uploadRepository.create({
      src: getAwsCloudFrontUrl(uploadResult.Key),
      key: uploadResult.Key,
    })
    await this.uploadRepository.insert(fileUpload)
    return fileUpload
  }

  async deleteFile(id: string): Promise<void> {
    const fileUpload = await this.uploadRepository.findOne({ where: { id } })
    await this.s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileUpload.key,
      })
      .promise()
    await this.uploadRepository.delete(id)
  }
}
