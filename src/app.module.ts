import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AddressModule } from "./modules/address/address.module"
import { AuthModule } from "./modules/auth/auth.module"
import { ProductModule } from "./modules/product/product.module"
import { SmsModule } from "./modules/sms/sms.module"
import { UploadModule } from "./modules/upload/upload.module"
import { UserModule } from "./modules/user/user.module"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    UserModule,
    UploadModule,
    AddressModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
