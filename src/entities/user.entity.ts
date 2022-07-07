import * as bcrypt from "bcrypt"
import { Key } from "src/configs/constants"
import { deleteWhiteSpace } from "src/utils"
import {
  BeforeInsert,
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
@Unique(Key.UNIQUE_USER_PHONE_CONSTRAINT, ["phone"])
export class UserEntity extends BaseEntity {
  @Column()
  phone: string

  @Column({
    select: false,
  })
  password: string

  @Column()
  name: string

  @Column({
    type: "enum",
    enum: UserGender,
    nullable: true,
  })
  gender?: UserGender

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @OneToOne(() => FileUploadEntity, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "avatar_id" })
  avatar?: FileUploadEntity

  @OneToMany(() => AddressEntity, (address) => address.user, {
    nullable: true,
  })
  address?: AddressEntity[]

  @BeforeInsert()
  async transformValues() {
    if (this.name) this.name = deleteWhiteSpace(this.name)
    if (this.password) this.password = await bcrypt.hash(this.password, 10)
  }
}
