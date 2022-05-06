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
    size,
    minPrice,
    maxPrice,
    inStock,
    isSale,
    isFeatured,
    sort,
    page = 1,
    limit = limitPerPage,
  }: GetProductsDto): Promise<PaginationData<Product[]>> {
    try {
      let findQuery = {}
      if (name) findQuery["name"] = new RegExp(name, "i")
      if (type) findQuery["type"] = type
      if (gender) findQuery["gender"] = gender
      if (size) findQuery["size"] = size
      if (minPrice) findQuery["minPrice"]["$gt"] = minPrice
      if (maxPrice) findQuery["maxPrice"]["$lt"] = maxPrice
      if (inStock) findQuery["inStock"] = inStock
      if (isSale) findQuery["isSale"] = isSale
      if (isFeatured) findQuery["isFeatured"] = isFeatured

      let sortQuery = {}
      switch (sort) {
        case "time":
          sortQuery["updatedAt"] = -1
          return
        case "price-asc":
          sortQuery["price"] = 1
          return
        case "price-desc":
          sortQuery["price"] = -1
          return
        case "percent":
      }

      const products = await this.productModel
        .find(findQuery)
        .sort(sortQuery)
        .skip(page * limit)
        .skip(limit)
      const total = await this.productModel.find(findQuery).count()

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
