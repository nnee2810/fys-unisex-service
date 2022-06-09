import { BaseEntity } from "src/entities/base.entity"
import { deleteWhiteSpace } from "src/utils/deleteWhiteSpace"
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm"

export enum ProductClassify {
  SHIRT = "SHIRT",
  PANT = "PANT",
  ACCESSORY = "ACCESSORY",
  SET = "SET",
}

export enum ProductGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNISEX = "UNISEX",
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
    enum: ProductGender,
    nullable: true,
  })
  gender: ProductGender

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
  salePrice: number

  @Column({
    default: false,
  })
  onSale: boolean

  @Column({
    default: false,
  })
  inSale: boolean

  @Column({
    default: false,
  })
  inStock: boolean

  @Column({
    default: false,
  })
  isFeatured: boolean

  @BeforeInsert()
  @BeforeUpdate()
  async transformValues() {
    if (this.name) {
      this.name = deleteWhiteSpace(this.name)
    }
  }
}
