import { Column, Entity } from "typeorm"
import { BaseEntity } from "."

@Entity("uploads")
export class FileUploadEntity extends BaseEntity {
  @Column()
  src: string

  @Column()
  key: string
}
