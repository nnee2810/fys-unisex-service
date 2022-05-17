import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { User } from "src/entities/user.entity"
import { errorResponse } from "src/helpers/response"
import { getQueryError } from "src/utils/getQueryError"
import { Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10)

      const user = this.userRepository.create({
        ...body,
        password: hashedPassword,
      })
      await this.userRepository.insert(user)
      return user
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse(getQueryError(error)),
      )
    }
  }
}
