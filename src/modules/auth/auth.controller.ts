import { Body, Controller, Post } from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers/response"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { User } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"
import { AuthService } from "./auth.service"
import { SignInByPasswordDto } from "./dto/sign-in-by-password.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() body: SignInByPasswordDto): Promise<IResponse<string>> {
    const accessToken = await this.authService.signIn(body)
    return successResponse(accessToken)
  }

  @Post("sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<IResponse<User>> {
    const user = await this.usersService.createUser(body)
    return successResponse(user)
  }
}
