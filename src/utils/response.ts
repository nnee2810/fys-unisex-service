import { HttpStatus } from "@nestjs/common"

export interface Response<T> {
  status: number
  message: string
  data: T
}
export interface PaginationData<T> {
  data: T
  page: number
  limit: number
  total: number
}

export function successResponse<T>(data: T): Response<T> {
  return {
    message: "Success",
    status: HttpStatus.OK,
    data,
  }
}
export function paginationResponse<T>(
  data: PaginationData<T>,
): Response<PaginationData<T>> {
  return {
    status: HttpStatus.OK,
    message: "Success",
    data,
  }
}
