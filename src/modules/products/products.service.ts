import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { LIMIT_PER_PAGE, MESSAGE } from "src/configs/constants"
import { IPaginationData } from "src/helpers/response"
import { ProductEntity } from "src/modules/products/entities/product.entity"
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
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
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
    limit = LIMIT_PER_PAGE,
  }: GetProductsDto): Promise<IPaginationData<ProductEntity[]>> {
    try {
      let whereOption: FindOptionsWhere<ProductEntity> = {}
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

      let orderOption: FindOptionsOrder<ProductEntity> = {}
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

      const [products, total] = await this.productsRepository.findAndCount({
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
      throw new InternalServerErrorException(MESSAGE.ERROR)
    }
  }

  async getProduct(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productsRepository.findOne({
        where: {
          id,
        },
      })
      return product
    } catch (error) {
      throw new InternalServerErrorException(MESSAGE.ERROR)
    }
  }

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = this.productsRepository.create(data)
      await this.productsRepository.insert(product)
      return product
    } catch (error) {
      throw new InternalServerErrorException(MESSAGE.ERROR)
    }
  }
}
