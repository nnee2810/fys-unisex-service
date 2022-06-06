import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Key, Message } from "src/configs/constants"
import { FindOptionsSelect, FindOptionsWhere, Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import { User } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
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

  async getUser(params: {
    select?: FindOptionsSelect<User>
    where: FindOptionsWhere<User>
  }): Promise<User> {
    try {
      const user = await this.usersRepository.findOne(params)
      return user
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async updateUserProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<void> {
    try {
      const result = await this.usersRepository.update({ id }, data)
      console.log(result)
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException()
    }
  }

  async updateUserAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<string> {
    return ""
  }
}
