import { Column } from "typeorm"
import { BaseEntity } from "."

export class FileUploadEntity extends BaseEntity {
  @Column()
  src: string

  @Column()
  key: string
}
