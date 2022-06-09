import { BaseEntity } from "src/entities/base.entity"
import { Column, Entity } from "typeorm"

@Entity("uploads")
export class FileUploadEntity extends BaseEntity {
  @Column()
  src: string

  @Column()
  key: string
}
