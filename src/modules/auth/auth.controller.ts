import { Body, Controller, Post } from "@nestjs/common"
import { Response, successResponse } from "src/helpers/response"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { UsersService } from "../users/users.service"

@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post("/sign-up")
  async signUp(@Body() body: CreateUserDto): Promise<Response<null>> {
    await this.usersService.createUser(body)
    return successResponse(null)
  }
}
