import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { isString } from "class-validator"
import { Key, Message } from "src/configs/constants"
import { UserEntity } from "src/entities"
import { deleteWhiteSpace } from "src/utils"
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { UploadService } from "../upload/upload.service"
import { CreateUserDto } from "./dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private uploadService: UploadService,
  ) {}

  async createUser({
    phone,
    password,
    name,
  }: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create({
        phone,
        password,
        name,
      })
      await this.userRepository.insert(user)
      return user
    } catch (error) {
      let message = error?.detail
      switch (error?.constraint) {
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
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async updateUser(
    where: FindOptionsWhere<UserEntity>,
    data: QueryDeepPartialEntity<UserEntity>,
  ) {
    try {
      if (isString(data.name)) data.name = deleteWhiteSpace(data.name)
      if (isString(data.password))
        data.password = await bcrypt.hash(data.password, 10)
      await this.userRepository.update(where, data)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<string> {
    try {
      const fileUpload = await this.uploadService.uploadFile({
        file,
        folder: "avatars",
      })
      await this.updateUser(
        { id },
        {
          avatar: fileUpload.src,
        },
      )
      return fileUpload.src
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
