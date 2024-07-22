import pick from "lodash/pick";
import { User } from "../user";
import type { TUser } from "~types/models";

export default (user: User): TUser => {
	return {
		...pick(user, ["id", "name", "email", "initials"]),
		createdAt: user.createdAt.getTime(),
		updatedAt: user.updatedAt.getTime(),
	};
};
