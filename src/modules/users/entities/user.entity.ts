import * as bcrypt from "bcrypt"
import { Key } from "src/configs/constants"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
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
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

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

  @Column({
    default: "",
  })
  avatar?: string

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

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }
}
