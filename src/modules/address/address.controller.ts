import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AddressEntity } from "src/entities"
import { IResponse, successResponse } from "src/helpers"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateAddressDto } from "../user/dto"
import { AddressService } from "./address.service"

@UseGuards(JwtAuthGuard)
@Controller("addresses")
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  async createAddress(
    @Req() req,
    @Body() body: CreateAddressDto,
  ): Promise<IResponse<null>> {
    await this.addressService.createAddress(req.user, body)
    return successResponse(null)
  }

  @Get()
  async getAddresses(@Req() req): Promise<IResponse<AddressEntity[]>> {
    const address = await this.addressService.getAddressesByUserId(req.user.id)
    return successResponse(address)
  }
}
