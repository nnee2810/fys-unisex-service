import * as bcrypt from "bcrypt"
import { Key } from "src/configs/constants"
import { BaseEntity } from "src/entities/base.entity"
import { FileUploadEntity } from "src/modules/upload/entities/file-upload.entity"
import { deleteWhiteSpace } from "src/utils/deleteWhiteSpace"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  Unique,
} from "typeorm"

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  MOD = "MOD",
  ADMIN = "ADMIN",
}

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

@Entity("users")
@Unique(Key.UNIQUE_USER_EMAIL_CONSTRAINT, ["email"])
@Unique(Key.UNIQUE_USER_PHONE_CONSTRAINT, ["phone"])
export class UserEntity extends BaseEntity {
  @Column({
    default: "",
  })
  fullName: string

  @Column({
    type: "enum",
    enum: UserGender,
    nullable: true,
  })
  gender?: UserGender

  @Column()
  email: string

  @Column()
  phone: string

  @Column({
    select: false,
  })
  password: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @OneToOne(() => FileUploadEntity, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  avatar?: FileUploadEntity

  @BeforeInsert()
  @BeforeUpdate()
  async transformValues() {
    if (this.fullName) {
      this.fullName = deleteWhiteSpace(this.fullName)
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }
}
