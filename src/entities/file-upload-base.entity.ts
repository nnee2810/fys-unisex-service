import { Column } from "typeorm"
import { BaseEntity } from "."

export class FileUploadEntity extends BaseEntity {
  @Column()
  key: string
}
