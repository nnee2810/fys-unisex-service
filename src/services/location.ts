import { LocationAPI } from "src/configs/services"
import { IDistrict, IProvince, IWard } from "src/interfaces"

export async function getProvince(code: number) {
  return (await LocationAPI.get<IProvince>(`/p/${code}`)).data
}

export async function getDistrict(code: number) {
  return (await LocationAPI.get<IDistrict>(`/d/${code}`)).data
}

export async function getWard(code: number) {
  return (await LocationAPI.get<IWard>(`/w/${code}`)).data
}
