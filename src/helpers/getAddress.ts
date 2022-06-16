import { getDistrict, getProvince, getWard } from "src/services"

export async function getAddress(
  province_code: number,
  district_code: number,
  ward_code: number,
) {
  const provincePromise = getProvince(province_code)
  const districtPromise = getDistrict(district_code)
  const wardPromise = getWard(ward_code)
  return [
    (await wardPromise).name,
    (await districtPromise).name,
    (await provincePromise).name,
  ].join(", ")
}
