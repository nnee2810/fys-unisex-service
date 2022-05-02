import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Response } from "src/utils/response"

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(({ data, message }) => ({
        data,
        message,
        status: context.switchToHttp().getResponse().statusCode,
      })),
    )
  }
}
