import { UnsupportedMediaTypeException } from "@nestjs/common"
import { Request } from "express"
import { Regex } from "src/configs/constants"

type FileFilterCallback = (error: Error, acceptFile: boolean) => void

export function avatarFileFilter(
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) {
  if (file.mimetype.match(Regex.AVATAR_FILE_EXTENSION)) callback(null, true)
  else callback(new UnsupportedMediaTypeException(), false)
}
