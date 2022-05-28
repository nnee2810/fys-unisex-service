import * as bcrypt from "bcrypt"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

export enum Role {
  Customer = "customer",
  Mod = "mod",
  Admin = "admin",
}
export enum Gender {
  Male = "male",
  Female = "female",
}

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    default: "",
  })
  fullName: string

  @Column({
    default: "",
  })
  gender: Gender

  @Column({
    default: "",
  })
  image?: string

  @Column({
    default: "",
    unique: true,
  })
  phone: string

  @Column({
    default: "",
    unique: true,
  })
  email: string

  @Column({
    select: false,
  })
  password: string

  @Column({
    default: "",
  })
  address: string

  @Column({
    default: "",
  })
  province: string

  @Column({
    default: "",
  })
  district: string

  @Column({
    default: "",
  })
  ward: string

  @Column({
    type: "enum",
    enum: Role,
    default: Role.Customer,
  })
  role: Role

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
