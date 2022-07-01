import { Body, Controller, Post } from "@nestjs/common"
import { IResponse, successResponse } from "src/helpers"
import { CreateUserDto } from "../user/dto"
import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { CheckPhoneDto, SignInByPasswordDto } from "./dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() body: SignInByPasswordDto): Promise<IResponse<string>> {
    const accessToken = await this.authService.signIn(body)
    return successResponse(accessToken)
  }

  @Post("sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<IResponse<string>> {
    await this.userService.createUser(body)
    return successResponse("SIGN_UP_SUCCESS")
  }

  @Post("check-phone")
  async checkPhone(
    @Body() { phone }: CheckPhoneDto,
  ): Promise<IResponse<boolean>> {
    const user = this.userService.getUser({
      where: {
        phone,
      },
    })
    return successResponse(!!user)
  }
}
