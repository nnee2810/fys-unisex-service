import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "../../users/users.service"
import { JwtPayload } from "../interfaces/jwt-payload.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    })
  }

  async validate(payload: JwtPayload) {
    console.log(payload)

    const user = await this.usersService.getUser({
      where: { id: payload.id },
    })
    if (!user) throw new UnauthorizedException("Invalid token")
    return user
  }
}