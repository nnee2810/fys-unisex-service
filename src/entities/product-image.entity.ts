import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { FileUploadEntity, ProductEntity } from "."

@Entity("product_images")
export class ProductImageEntity extends FileUploadEntity {
  @Column()
  position: number

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity
}
