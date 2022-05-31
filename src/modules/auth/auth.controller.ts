import { Body, Controller, Post, Res } from "@nestjs/common"
import { Response } from "express"
import { Key } from "src/configs/constants"
import { IResponse, successResponse } from "src/helpers/response"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { UserEntity } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"
import { SignInByPasswordDto } from "./dto/sign-in-by-password.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(
    @Body() body: SignInByPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const accessToken = await this.authService.signIn(body)
    res.cookie(Key.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
    })
    return res.json(successResponse({ accessToken }))
  }

  @Post("sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<IResponse<UserEntity>> {
    const user = await this.authService.signUp(body)
    return successResponse(user)
  }
}
