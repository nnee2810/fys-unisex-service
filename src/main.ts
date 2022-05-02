import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import "dotenv/config"
import { AppModule } from "./app.module"
import { TransformInterceptor } from "./interceptors/transform.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.PORT)
}
bootstrap()
