import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { AddressEntity } from "src/entities"
import { getAddress } from "src/helpers"
import { Repository } from "typeorm"
import { CreateAddressDto } from "../users/dto"

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async createAddress(
    userId: string,
    data: CreateAddressDto,
  ): Promise<AddressEntity> {
    const address = this.addressRepository.create({
      ...data,
      address: await getAddress(
        data.province_code,
        data.district_code,
        data.ward_code,
      ),
      user: {
        id: userId,
      },
    })
    await this.addressRepository.insert(address)
    return address
  }

  async getAddressesByUserId(id: string): Promise<AddressEntity[]> {
    try {
      const addreses = await this.addressRepository.find({
        where: {
          user: {
            id,
          },
        },
      })
      return addreses
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
