import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ProductEntity } from "src/entities"
import { IPagination } from "src/helpers"
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
import { CreateProductDto, GetProductsDto, ProductSort } from "./dto"

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
    min_price,
    max_price,
    on_sale,
    in_sale,
    in_stock,
    is_featured,
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
          min_price && max_price
            ? Between(min_price, max_price)
            : min_price
            ? MoreThanOrEqual(min_price)
            : max_price
            ? LessThanOrEqual(max_price)
            : undefined,
        on_sale,
        in_sale,
        in_stock,
        is_featured,
      }

      const order: FindOptionsOrder<ProductEntity> = {
        price:
          sort === ProductSort.PRICE_ASC
            ? "asc"
            : sort === ProductSort.PRICE_DESC
            ? "desc"
            : undefined,
        updated_at: sort === ProductSort.TIME ? "desc" : undefined,
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
