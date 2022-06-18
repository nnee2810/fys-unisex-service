import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/entities"
import { AddressModule } from "../address/address.module"
import { UploadModule } from "../upload/upload.module"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UploadModule,
    AddressModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
