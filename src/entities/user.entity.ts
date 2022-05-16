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

  @Column()
  fullName: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: Date
}
