import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { isString } from "class-validator"
import { AddressEntity } from "src/entities"
import { getAddress } from "src/helpers"
import { deleteWhiteSpace } from "src/utils"
import { Repository } from "typeorm"
import { CreateAddressDto, UpdateAddressDto } from "../user/dto"

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async removeDefaultAddress(userId: string) {
    try {
      await this.addressRepository.update(
        {
          user: {
            id: userId,
          },
          is_default: true,
        },
        {
          is_default: false,
        },
      )
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async createAddress(
    userId: string,
    data: CreateAddressDto,
  ): Promise<AddressEntity> {
    try {
      if (data.is_default) await this.removeDefaultAddress(userId)
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
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async getAddressList(userId: string): Promise<AddressEntity[]> {
    try {
      const addressList = await this.addressRepository.find({
        where: {
          user: { id: userId },
        },
        order: {
          is_default: "desc",
        },
      })
      return addressList
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async getAddressById(id: string): Promise<AddressEntity> {
    try {
      const address = await this.addressRepository.findOne({ where: { id } })
      return address
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressDto,
  ): Promise<AddressEntity> {
    try {
      if (data.is_default) await this.removeDefaultAddress(userId)

      if (isString(data.name)) data.name = deleteWhiteSpace(data.name)
      if (isString(data.address_detail))
        data.address_detail = deleteWhiteSpace(data.address_detail)
      await this.addressRepository.update(addressId, data)
      const address = await this.getAddressById(addressId)
      return address
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }

  async deleteAddressById(id: string) {
    try {
      await this.addressRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error?.detail)
    }
  }
}
