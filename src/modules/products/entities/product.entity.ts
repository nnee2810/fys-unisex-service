import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column("varchar", {
    array: true,
    default: [],
  })
  images: string[]

  @Column()
  type: string

  @Column()
  gender: string

  @Column("varchar", {
    array: true,
    default: [],
  })
  sizes: string[]

  @Column()
  price: number

  @Column({
    default: false,
  })
  forSale: boolean

  @Column({
    default: 0,
  })
  salePrice: number

  @Column({
    default: false,
  })
  isSale: boolean

  @Column({
    default: false,
  })
  inStock: boolean

  @Column({
    default: false,
  })
  isFeatured: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
