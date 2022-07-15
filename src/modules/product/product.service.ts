import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ProductEntity } from "src/entities"
import { IPagination } from "src/helpers"
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm"
import {
  CreateProductDto,
  GetProductListDto,
  ProductSort,
  UpdateProductDto,
} from "./dto"

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = this.productRepository.create(data)
      await this.productRepository.insert(product)
      return product
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async getProductList({
    name,
    classify,
    min_price,
    max_price,
    on_sale,
    in_sale,
    in_stock,
    is_featured,
    sort,
    page,
    take,
  }: GetProductListDto): Promise<IPagination<ProductEntity[]>> {
    try {
      const where: FindOptionsWhere<ProductEntity> = {
        name: name && ILike("%" + name + "%"),
        classify,
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
        updated_at: "desc",
      }

      const [data, total] = await this.productRepository.findAndCount({
        where,
        order,
        skip: (page - 1) * take,
        take,
        relations: {
          images: true,
        },
      })

      return {
        data,
        total,
        page,
        take,
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async getProductById(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id,
        },
      })
      if (!product) throw new NotFoundException()
      return product
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<void> {
    try {
      await this.productRepository.update(id, data)
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.productRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }
}
