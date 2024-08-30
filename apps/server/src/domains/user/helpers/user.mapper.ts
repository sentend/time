import type { User } from "../user.entity";
import type { UserDTO } from "../user.model";
import { pick } from "@/libs/pick";

export class UserMapper {
	public static toModel(entity: User): UserDTO {
		return pick<User, UserDTO>(entity, [
			"createdAt",
			"email",
			"id",
			"initials",
			"name",
			"updatedAt",
		]);
	}
}
