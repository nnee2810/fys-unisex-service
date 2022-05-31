import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { Message } from "src/configs/constants"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { UserEntity } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"
import { SignInByPasswordDto } from "./dto/sign-in-by-password.dto"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: SignInByPasswordDto) {
    const user = await this.usersService.getUser({
      select: {
        password: true,
      },
      where: [{ email: data.email }, { phone: data.phone }],
    })

    if (!user) throw new UnauthorizedException(Message.UNAUTHORIZED)
    if (!(await bcrypt.compare(data.password, user.password)))
      throw new UnauthorizedException(Message.UNAUTHORIZED)

    const accessToken = this.jwtService.sign({
      id: user.id,
    })

    return accessToken
  }

  async signUp(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.createUser(data)
    return user
  }
}