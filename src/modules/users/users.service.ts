import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Key, Message } from "src/configs/constants"
import { FindOptionsSelect, FindOptionsWhere, Repository } from "typeorm"
import { UploadService } from "../upload/upload.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private uploadService: UploadService,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.usersRepository.create(data)
      await this.usersRepository.insert(user)

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
  }: {
    select?: FindOptionsSelect<UserEntity>
    where: FindOptionsWhere<UserEntity>
  }): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({
        select: {
          avatar: {
            src: true,
          },
          ...select,
        },
        where,
        relations: ["avatar"],
      })
      return user
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  getUserById(id: string, select?: FindOptionsSelect<UserEntity>) {
    return this.getUser({
      select,
      where: {
        id,
      },
    })
  }

  async updateUserProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    try {
      await this.usersRepository.update(id, data)
      const user = this.getUserById(id)
      return user
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async updateUserAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const user = await this.getUserById(id, {
        avatar: {
          id: true,
        },
      })
      if (user.avatar.id) await this.uploadService.deleteFile(user.avatar.id)
      const fileUpload = await this.uploadService.uploadFile(file)
      await this.usersRepository.update(id, {
        avatar: fileUpload,
      })
      return fileUpload.src
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
