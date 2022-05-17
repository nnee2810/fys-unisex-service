export function getQueryError({ code, detail }: any) {
  return {
    code,
    detail,
    column: detail.match(/\(([^)]+)\)/)[1],
  }
}
