import { Body, Controller, Post } from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers/response"
import { UserEntity } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"
import { SignInByPasswordDto } from "./dto/sign-in-by-password.dto"
import { SignUpDto } from "./dto/sign-up.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(
    @Body() body: SignInByPasswordDto,
  ): Promise<IResponse<{ accessToken: string }>> {
    const accessToken = await this.authService.signIn(body)
    return successResponse({ accessToken })
  }

  @Post("sign-up")
  async signUp(@Body() body: SignUpDto): Promise<IResponse<UserEntity>> {
    const user = await this.authService.signUp(body)
    return successResponse(user)
  }
}
