export function deleteWhiteSpace(value: string = "") {
  return value.trim().replace(/ +/g, " ")
}
