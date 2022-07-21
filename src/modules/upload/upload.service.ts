import { Injectable } from "@nestjs/common"
import { S3 } from "aws-sdk"
import { FileUpload } from "src/interfaces"
import { getAwsCloudFrontUrl } from "src/utils"
import { v4 } from "uuid"
import { UploadFileDto } from "./dto"

@Injectable()
export class UploadService {
  constructor() {}

  async upload({ file, folder }: UploadFileDto): Promise<FileUpload> {
    const s3 = new S3()
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: [folder, v4()].join("/"),
      })
      .promise()
    const fileUpload = {
      src: getAwsCloudFrontUrl(uploadResult.Key),
      key: uploadResult.Key,
    }
    return fileUpload
  }

  async delete(key: string): Promise<void> {
    const s3 = new S3()
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise()
  }
}
