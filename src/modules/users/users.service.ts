import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Message } from "src/configs/constants"
import { UserEntity } from "src/modules/users/entities/user.entity"
import { getQueryError } from "src/utils/getQueryError"
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getUser({
    select,
    where,
  }: {
    select?:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity>
    where?: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]
  }): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOne({
        select,
        where,
      })
      return user
    } catch (error) {
      throw new InternalServerErrorException(Message.ERROR)
    }
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.usersRepository.create(data)
      await this.usersRepository.insert(user)
      return user
    } catch (error) {
      let message = Message.ERROR
      if (error instanceof QueryFailedError) {
        const { code, column } = getQueryError(error)
        if (code === "23505")
          switch (column) {
            case "email":
              message = Message.EMAIL_ALREADY_EXIST
              break

            case "phone":
              message = Message.PHONE_ALREADY_EXIST
              break
          }
      }
      throw new InternalServerErrorException(Message)
    }
  }

  async updateUserProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    try {
      const profile = await this.usersRepository.save({
        id,
        ...data,
      })
      return profile
    } catch (error) {
      throw new InternalServerErrorException(Message.ERROR)
    }
  }
}
