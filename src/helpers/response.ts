import { HttpStatus } from "@nestjs/common"

export interface IResponse<T> {
  status: number
  message: string
  data?: T
}
export interface IPaginationData<T> {
  data: T
  page: number
  limit: number
  total: number
}
export interface QueryError {
  code: number
  detail: string
}

export function successResponse<T>(data: T, message = "Success"): IResponse<T> {
  return {
    message,
    status: HttpStatus.OK,
    data,
  }
}
