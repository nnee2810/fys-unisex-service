import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type ProductDocument = Product & Document

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string

  @Prop([String])
  images: string[]

  @Prop()
  type: string

  @Prop()
  gender: string

  @Prop()
  price: number

  @Prop()
  salePrice: number

  @Prop()
  isSale: boolean

  @Prop()
  inStock: boolean

  @Prop()
  isFeatured: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)
