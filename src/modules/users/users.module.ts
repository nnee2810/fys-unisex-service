import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/entities"
import { AddressModule } from "../address/address.module"
import { UploadModule } from "../upload/upload.module"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UploadModule,
    AddressModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
