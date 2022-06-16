import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AbilityModule } from "./ability/ability.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AddressModule } from "./modules/address/address.module"
import { AuthModule } from "./modules/auth/auth.module"
import { ProductsModule } from "./modules/products/products.module"
import { UploadModule } from "./modules/upload/upload.module"
import { UsersModule } from "./modules/users/users.module"

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
    ProductsModule,
    UsersModule,
    UploadModule,
    AddressModule,
    AbilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
