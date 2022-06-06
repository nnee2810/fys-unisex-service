export function getQueryColumnError(error: any) {
  return error?.detail?.match(/\(([^)]+)\)/)[1] || ""
}
