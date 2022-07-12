import { deleteWhiteSpace } from "src/utils"
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm"
import { BaseEntity } from "."

export enum ProductClassify {
  SHIRT = "SHIRT",
  PANT = "PANT",
  ACCESSORY = "ACCESSORY",
  SET = "SET",
}

export enum ProductSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
}

@Entity("products")
export class ProductEntity extends BaseEntity {
  @Column()
  name: string

  @Column()
  slug: string

  @Column({
    type: "varchar",
    array: true,
    default: [],
  })
  images: string[]

  @Column({
    type: "enum",
    enum: ProductClassify,
    nullable: true,
  })
  classify: ProductClassify

  @Column({
    type: "enum",
    enum: ProductSize,
    array: true,
    default: [],
  })
  sizes: string[]

  @Column({
    default: 0,
  })
  price: number

  @Column({
    default: 0,
  })
  sale_price: number

  @Column({
    default: false,
  })
  on_sale: boolean

  @Column({
    default: false,
  })
  in_sale: boolean

  @Column({
    default: false,
  })
  in_stock: boolean

  @Column({
    default: false,
  })
  is_featured: boolean

  @BeforeInsert()
  @BeforeUpdate()
  async transformValues() {
    if (this.name) this.name = deleteWhiteSpace(this.name)
    if (this.price && this.sale_price)
      this.sale_percent = 100 - Math.round(this.sale_price / this.price)
  }

  protected sale_percent: number
  @AfterLoad()
  getsale_percent() {
    if (this.price && this.sale_price) {
      this.sale_percent = Math.round(100 - (this.sale_price / this.price) * 100)
    } else this.sale_percent = 0
  }
}
