import { Injectable } from "@nestjs/common"
import { S3 } from "aws-sdk"
import { v4 } from "uuid"

@Injectable()
export class UploadService {
  constructor() {}

  async upload(folder: string, file: Express.Multer.File): Promise<string> {
    const s3 = new S3()
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: [folder, v4()].join("/"),
      })
      .promise()

    return uploadResult.Key
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
