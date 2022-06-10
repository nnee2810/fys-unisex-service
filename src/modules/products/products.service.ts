import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { IPagination } from "src/helpers/response"
import {
  ArrayContains,
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm"
import { CreateProductDto } from "./dto/create-product-dto"
import { GetProductsDto, ProductSort } from "./dto/get-products-dto"
import { ProductEntity } from "./entities/product.entity"

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = this.productsRepository.create(data)
      await this.productsRepository.insert(product)
      return product
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async getProducts({
    name,
    classify,
    gender,
    size,
    minPrice,
    maxPrice,
    onSale,
    inSale,
    inStock,
    isFeatured,
    sort,
    page,
    take,
  }: GetProductsDto): Promise<IPagination<ProductEntity[]>> {
    try {
      const where: FindOptionsWhere<ProductEntity> = {
        name: name && ILike("%" + name + "%"),
        classify,
        gender,
        sizes: size && ArrayContains([size]),
        price:
          minPrice && maxPrice
            ? Between(minPrice, maxPrice)
            : minPrice
            ? MoreThanOrEqual(minPrice)
            : maxPrice
            ? LessThanOrEqual(maxPrice)
            : undefined,
        onSale,
        inSale,
        inStock,
        isFeatured,
      }

      const order: FindOptionsOrder<ProductEntity> = {
        price:
          sort === ProductSort.PRICE_ASC
            ? "asc"
            : sort === ProductSort.PRICE_DESC
            ? "desc"
            : undefined,
        updatedAt: sort === ProductSort.TIME ? "desc" : undefined,
      }

      const [data, total] = await this.productsRepository.findAndCount({
        where,
        order,
        skip: (page - 1) * take,
        take,
      })

      return {
        data,
        total,
        page,
        take,
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async getProduct(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productsRepository.findOne({
        where: {
          id,
        },
      })
      if (!product) throw new NotFoundException()
      return product
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
