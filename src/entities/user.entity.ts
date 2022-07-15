import * as bcrypt from "bcrypt"
import { Key } from "src/configs/constants"
import { deleteWhiteSpace } from "src/utils"
import { BeforeInsert, Column, Entity, OneToMany, Unique } from "typeorm"
import { AddressEntity, BaseEntity } from "."

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  MOD = "MOD",
  ADMIN = "ADMIN",
}

export enum StaffRole {
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
    nullable: true,
  })
  avatar?: string

  @Column("enum", {
    enum: UserGender,
    nullable: true,
  })
  gender?: UserGender

  @Column("enum", {
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @OneToMany(() => AddressEntity, (address) => address.user, {
    nullable: true,
  })
  address_list?: AddressEntity[]

  @BeforeInsert()
  async transformValues() {
    if (this.name) this.name = deleteWhiteSpace(this.name)
    if (this.password) this.password = await bcrypt.hash(this.password, 10)
  }
}
