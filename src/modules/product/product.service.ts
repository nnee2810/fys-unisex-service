import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ObjectIdentifierList } from "aws-sdk/clients/s3"
import { ProductEntity, ProductImageEntity } from "src/entities"
import { IPagination } from "src/helpers"
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from "typeorm"
import { UploadService } from "../upload/upload.service"
import {
  CreateProductDto,
  GetProductsDto,
  ProductSort,
  UpdateProductDto,
} from "./dto"

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = this.productRepository.create(data)
      await this.productRepository.insert(product)
      return product
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async find({
    name,
    classify,
    min_price,
    max_price,
    for_sale,
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
        price:
          min_price && max_price
            ? Between(min_price, max_price)
            : min_price
            ? MoreThanOrEqual(min_price)
            : max_price
            ? LessThanOrEqual(max_price)
            : undefined,
        for_sale,
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
        images: {
          position: "asc",
        },
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
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async findById(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id,
        },
        order: {
          images: {
            position: "asc",
          },
        },
        relations: {
          images: true,
        },
      })
      if (!product) throw new NotFoundException()
      return product
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async update(id: string, data: UpdateProductDto): Promise<void> {
    try {
      await this.productRepository.update(id, data)
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const images: ObjectIdentifierList = (
        await this.productImageRepository.find({
          where: { product: { id } },
        })
      ).map((item) => ({ Key: item.key }))
      if (images.length) await this.uploadService.bulkDelete(images)
      await this.productRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<void> {
    try {
      const position =
        (
          await this.productImageRepository.find({
            where: { product: { id } },
          })
        ).length + 1
      const key = await this.uploadService.upload("products", file)
      const productImage = this.productImageRepository.create({
        key,
        position,
        product: {
          id,
        },
      })
      await this.productImageRepository.insert(productImage)
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async deleteImage(id: string) {
    try {
      const file = await this.productImageRepository.findOne({
        where: { id },
        relations: { product: true },
      })
      if (!file) throw new NotFoundException()
      await this.uploadService.delete(file.key)
      await this.productImageRepository.delete(id)
      await this.productImageRepository.decrement(
        {
          position: MoreThan(file.position),
          product: { id: file.product.id },
        },
        "position",
        1,
      )
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }
}
