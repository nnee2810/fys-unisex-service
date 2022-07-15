import { StaffRole, UserEntity } from "src/entities"

export function isStaff(user: UserEntity) {
  if (Object.keys(StaffRole).includes(user.role)) return true
  return false
}
