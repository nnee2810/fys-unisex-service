import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { limitPerPage } from "src/configs/constants"
import { Product } from "src/entities/product.entity"
import { PaginationData } from "src/utils/response"
import {
  ArrayContains,
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from "typeorm"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto } from "./dto/get-products-dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts({
    name,
    type,
    gender,
    size,
    minPrice,
    maxPrice,
    forSale,
    inStock,
    isSale,
    isFeatured,
    sort,
    page = 1,
    limit = limitPerPage,
  }: GetProductsDto): Promise<PaginationData<Product[]>> {
    try {
      let whereOption: FindOptionsWhere<Product> = {}
      if (name) whereOption.name = Like("%" + name + "%")
      if (type) whereOption.type = type
      if (gender) whereOption.gender = gender
      if (size) whereOption.sizes = ArrayContains([size])
      if (minPrice) whereOption.price = MoreThanOrEqual(minPrice)
      if (maxPrice) whereOption.price = LessThanOrEqual(maxPrice)
      if (minPrice && maxPrice) whereOption.price = Between(minPrice, maxPrice)
      if (forSale) whereOption.forSale = forSale
      if (inStock) whereOption.inStock = inStock
      if (isSale) whereOption.isSale = isSale
      if (isFeatured) whereOption.isFeatured = isFeatured

      let orderOption: FindOptionsOrder<Product> = {}
      switch (sort) {
        case "time":
          orderOption["updatedAt"] = "desc"
          break
        case "price-asc":
          orderOption.price = "asc"
          break
        case "price-desc":
          orderOption.price = "desc"
          break
        case "percent": {
          break
        }
      }

      const [products, total] = await this.productRepository.findAndCount({
        where: whereOption,
        order: orderOption,
        skip: page * limit,
        take: limit,
      })

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

  async createProduct(body: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(body)
      await this.productRepository.insert(product)
      return product
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
