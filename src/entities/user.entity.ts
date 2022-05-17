import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    default: "",
    unique: true,
  })
  email: string

  @Column({
    default: "",
  })
  password: string

  @Column({
    default: "",
  })
  fullName: string

  @Column({
    default: "",
  })
  image: string

  @Column({
    default: "",
    unique: true,
  })
  phone: string

  @Column({
    default: "",
  })
  address: string

  @Column({
    default: "customer",
  })
  role: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: Date
}
