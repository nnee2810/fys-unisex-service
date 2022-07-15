import { deleteWhiteSpace } from "src/utils"
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { UserEntity } from "."
import { BaseEntity } from "./base.entity"

@Entity("address")
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

  @ManyToOne(() => UserEntity, (user) => user.address_list, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @BeforeInsert()
  async transformValues() {
    if (this.name) this.name = deleteWhiteSpace(this.name)
    if (this.address_detail)
      this.address_detail = deleteWhiteSpace(this.address_detail)
  }
}
