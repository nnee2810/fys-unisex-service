export const TAKE_PER_PAGE = 20
export const Regex = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  AVATAR_FILE_EXTENSION: /\/(jpg|jpeg|png)$/,
}
export enum PostgresErrorCode {
  UNIQUE_VIOLATION = "23505",
  CHECK_VIOLATION = "23514",
  NOT_NULL_VIOLATION = "23502",
  FOREIGN_KEY_VIOLATION = "23503",
}
export enum Key {
  UNIQUE_USER_PHONE_CONSTRAINT = "UNIQUE_USER_PHONE_CONSTRAINT",
}
