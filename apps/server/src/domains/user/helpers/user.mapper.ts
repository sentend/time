import type { User } from "../user.entity";
import type { UserModel } from "../user.model";
import { pick } from "@/libs/pick";

export class UserMapper {
	public static toModel(entity: User): UserModel {
		return pick<User, UserModel>(entity, [
			"createdAt",
			"email",
			"id",
			"initials",
			"name",
			"updatedAt",
		]);
	}
}
