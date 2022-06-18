import { BadRequestException, Body, Controller, Post } from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers"
import { UserEntity } from "../../entities"
import { CreateUserDto } from "../user/dto"
import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { SignInByPasswordDto } from "./dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() body: SignInByPasswordDto): Promise<IResponse<string>> {
    if (body.email && body.phone) throw new BadRequestException()
    if (!body.email && !body.phone) throw new BadRequestException()
    const accessToken = await this.authService.signIn(body)
    return successResponse(accessToken)
  }

  @Post("sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<IResponse<UserEntity>> {
    const { password, ...user } = await this.userService.createUser(body)
    return successResponse(user as UserEntity)
  }
}
