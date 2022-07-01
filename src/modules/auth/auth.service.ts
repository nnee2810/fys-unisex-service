import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { UserService } from "../user/user.service"
import { SignInByPasswordDto } from "./dto"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ phone, password }: SignInByPasswordDto): Promise<string> {
    const user = await this.userService.getUser({
      select: {
        id: true,
        password: true,
      },
      where: {
        phone,
      },
    })

    if (!user) throw new UnauthorizedException("SIGN_IN_FAIL")
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException("SIGN_IN_FAIL")

    const accessToken = this.jwtService.sign({
      id: user.id,
    })

    return accessToken
  }
}
