import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { limitPerPage } from "src/configs/constants"
import {
  Product,
  ProductDocument,
} from "src/modules/products/schemas/product.shema"
import { PaginationData } from "src/utils/response"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto } from "./dto/get-products-dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getProducts({
    name,
    type,
    gender,
    inStock,
    isSale,
    isFeatured,
    page = 1,
    limit = limitPerPage,
  }: GetProductsDto): Promise<PaginationData<Product[]>> {
    try {
      let query = {}
      if (name) query["name"] = new RegExp(name, "i")
      if (type) query["type"] = type
      if (gender) query["gender"] = gender
      if (inStock) query["inStock"] = inStock
      if (isSale) query["isSale"] = isSale
      if (isFeatured) query["isFeatured"] = isFeatured

      const products = await this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()
      const total = await this.productModel.find(query).count()

      return {
        data: products,
        page,
        limit,
        total,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async createProduct(body: CreateProductDto): Promise<ProductDocument> {
    const productDocument = await this.productModel.create(body)
    return productDocument
  }
}
