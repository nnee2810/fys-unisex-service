import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { Message } from "src/configs/constants"
import { UsersService } from "../users/users.service"
import { SignInByPasswordDto } from "./dto"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({
    email,
    phone,
    password,
  }: SignInByPasswordDto): Promise<string> {
    const user = await this.usersService.getUser({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
        phone,
      },
    })

    if (!user) throw new UnauthorizedException(Message.SIGN_IN_FAIL)
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(Message.SIGN_IN_FAIL)

    const accessToken = this.jwtService.sign({
      id: user.id,
    })

    return accessToken
  }
}
