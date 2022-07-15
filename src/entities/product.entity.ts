import { deleteWhiteSpace } from "src/utils"
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"
import { BaseEntity, ProductImageEntity } from "."

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

  @Column("enum", {
    enum: ProductClassify,
    nullable: true,
  })
  classify: ProductClassify

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

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product, {
    nullable: true,
  })
  images?: ProductImageEntity[]

  @BeforeInsert()
  async transformValues() {
    if (this.name) this.name = deleteWhiteSpace(this.name)
  }
}
