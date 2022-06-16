import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { UserEntity } from "."
import { BaseEntity } from "./base.entity"

@Entity("addresses")
export class AddressEntity extends BaseEntity {
  @Column()
  name: string

  @Column()
  phone: string

  @Column()
  address: string

  @Column()
  province_code: number

  @Column()
  district_code: number

  @Column()
  ward_code: number

  @Column()
  address_detail: string

  @Column()
  is_default: boolean

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user?: UserEntity
}
