import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Key, Message } from "src/configs/constants"
import { UserEntity } from "src/entities"
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm"
import { UploadService } from "../upload/upload.service"
import { CreateUserDto, UpdateProfileDto } from "./dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private uploadService: UploadService,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(data)
      await this.userRepository.insert(user)
      return user
    } catch (error) {
      let message = ""
      switch (error?.constraint) {
        case Key.UNIQUE_USER_EMAIL_CONSTRAINT:
          message = Message.EMAIL_ALREADY_EXIST
          break
        case Key.UNIQUE_USER_PHONE_CONSTRAINT:
          message = Message.PHONE_ALREADY_EXIST
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
      throw new InternalServerErrorException()
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
      throw new InternalServerErrorException()
    }
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<string> {
    try {
      const user = await this.getUserById(id)
      if (user?.avatar?.id) await this.uploadService.deleteFile(user.avatar.id)
      const fileUpload = await this.uploadService.uploadFile(file, {
        user,
      })
      await this.userRepository.update(id, {
        avatar: fileUpload,
      })
      return fileUpload.src
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
