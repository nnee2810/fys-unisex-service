import * as bcrypt from "bcrypt"
import { Key } from "src/configs/constants"
import { deleteWhiteSpace } from "src/utils"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from "typeorm"
import { AddressEntity, BaseEntity, FileUploadEntity } from "."

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
  @Column()
  name: string

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
    eager: true,
  })
  @JoinColumn({ name: "avatar_id" })
  avatar?: FileUploadEntity

  @OneToMany(() => AddressEntity, (address) => address.user, {
    nullable: true,
  })
  address_list?: AddressEntity[]

  @BeforeInsert()
  @BeforeUpdate()
  async transformValues() {
    if (this.name) {
      this.name = deleteWhiteSpace(this.name)
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }
}
