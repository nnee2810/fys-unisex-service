import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AddressEntity } from "src/entities"
import { AddressService } from "./address.service"

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
