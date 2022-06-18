import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { BaseEntity, UserEntity } from "."

@Entity("uploads")
export class FileUploadEntity extends BaseEntity {
  @Column()
  src: string

  @Column()
  key: string

  @OneToOne(() => UserEntity, (user) => user.avatar, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity
}
