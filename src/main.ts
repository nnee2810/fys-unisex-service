import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import "dotenv/config"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    credentials: true,
    origin: "http://localhost:3000",
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.PORT)
}
bootstrap()
