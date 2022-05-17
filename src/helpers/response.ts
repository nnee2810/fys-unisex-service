import { HttpStatus } from "@nestjs/common"

export interface Response<T> {
  status: number
  message: string
  data?: T
  error?: T
}
export interface PaginationData<T> {
  data: T
  page: number
  limit: number
  total: number
}
export interface QueryError {
  code: number
  detail: string
}

export function successResponse<T>(data: T): Response<T> {
  return {
    message: "Success",
    status: HttpStatus.OK,
    data,
  }
}
export function errorResponse<T>(error: T): Response<T> {
  return {
    message: "Error",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    error,
  }
}
