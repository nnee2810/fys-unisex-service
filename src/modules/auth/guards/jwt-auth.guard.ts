import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.get<boolean>(
      "isPublicRoute",
      context.getHandler(),
    )

    if (isPublicRoute) return true

    return super.canActivate(context)
  }
}
