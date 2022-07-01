import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { config as awsConfig } from "aws-sdk"
import * as cookieParser from "cookie-parser"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: "http://localhost:3000",
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  awsConfig.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  })

  await app.listen(process.env.PORT)
}
bootstrap()
