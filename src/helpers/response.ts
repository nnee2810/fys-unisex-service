import { HttpStatus } from "@nestjs/common"

export interface IResponse<T> {
  status: number
  message: string
  data?: T
}
export interface IPagination<T> {
  data: T
  total: number
  page: number
  take: number
}

export function successResponse<T>(data: T, message = "Success"): IResponse<T> {
  return {
    message,
    status: HttpStatus.OK,
    data,
  }
}
