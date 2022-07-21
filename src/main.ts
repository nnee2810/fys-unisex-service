import { ValidationPipe } from "@nestjs/common"
import { NestFactory, Reflector } from "@nestjs/core"
import { config as awsConfig } from "aws-sdk"
import * as cookieParser from "cookie-parser"
import { AppModule } from "./app.module"
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)

  app.enableCors({
    origin: "http://localhost:3000",
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  awsConfig.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  })

  await app.listen(process.env.PORT)
}
bootstrap()
