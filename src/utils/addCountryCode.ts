export function addCountryCode(phone: string, countryCode: string = "84") {
  return `+${countryCode}${phone.slice(1)}`
}
