import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Key } from "src/configs/constants"
import { UserEntity } from "src/entities"
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm"
import { AddressService } from "../address/address.service"
import { UploadService } from "../upload/upload.service"
import { CreateUserDto, UpdateProfileDto } from "./dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private uploadService: UploadService,
    private addressService: AddressService,
  ) {}

  async createUser({
    phone,
    password,
    name,
    province_code,
    district_code,
    ward_code,
    address_detail,
  }: CreateUserDto): Promise<void> {
    try {
      const user = this.userRepository.create({
        phone,
        password,
        name,
      })
      await this.userRepository.insert(user)
      await this.addressService.createAddress(user.id, {
        name,
        phone,
        province_code,
        district_code,
        ward_code,
        address_detail,
        is_default: true,
      })
    } catch (error) {
      let message = error?.detail
      switch (error?.constraint) {
        case Key.UNIQUE_USER_PHONE_CONSTRAINT:
          message = "PHONE_ALREADY_EXIST"
          break
      }

      throw new InternalServerErrorException(message)
    }
  }

  async getUser({
    select,
    where,
    relations,
  }: {
    select?: FindOptionsSelect<UserEntity>
    where: FindOptionsWhere<UserEntity>
    relations?: FindOptionsRelations<UserEntity>
  }): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        select,
        where,
        relations: relations,
      })
      return user
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  getUserById(
    id: string,
    options?: {
      select?: FindOptionsSelect<UserEntity>
      relations?: FindOptionsRelations<UserEntity>
    },
  ) {
    return this.getUser({
      where: {
        id,
      },
      ...options,
    })
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<UserEntity> {
    try {
      await this.userRepository.update(id, data)
      const user = await this.getUserById(id)
      return user
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<string> {
    try {
      const user = await this.getUserById(id)
      if (user?.avatar?.id) await this.uploadService.deleteFile(user.avatar.id)
      const fileUpload = await this.uploadService.uploadFile({
        file,
        folder: "avatars/",
      })
      await this.userRepository.update(id, {
        avatar: fileUpload,
      })
      return fileUpload.src
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }
}
