import { Ability, InferSubjects } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { ProductEntity } from "src/modules/products/entities/product.entity"
import { UserEntity } from "src/modules/users/entities/user.entity"

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}
export type Subjects =
  | InferSubjects<typeof UserEntity | typeof ProductEntity>
  | "all"
export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserEntity) {}
}