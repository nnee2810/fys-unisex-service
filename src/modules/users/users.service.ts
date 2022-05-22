import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { MESSAGE } from "src/configs/constants"
import { UserEntity } from "src/modules/users/entities/user.entity"
import { getQueryError } from "src/utils/getQueryError"
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from "typeorm"
import { SignUpDto } from "../auth/dto/sign-up.dto"

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
      if (error instanceof QueryFailedError) {
        console.log(error)
      }
      throw new InternalServerErrorException(MESSAGE.ERROR)
    }
  }

  async createUser(data: SignUpDto): Promise<UserEntity> {
    try {
      const user = this.usersRepository.create(data)
      await this.usersRepository.insert(user)
      return user
    } catch (error) {
      let message = MESSAGE.ERROR
      if (error instanceof QueryFailedError) {
        const { code, column } = getQueryError(error)
        if (code === "23505")
          switch (column) {
            case "email":
              message = MESSAGE.EMAIL_ALREADY_EXIST
              break

            case "phone":
              message = MESSAGE.PHONE_ALREADY_EXIST
              break
          }
      }
      throw new InternalServerErrorException(message)
    }
  }
}
