import "express-async-errors";
import { Workspace, User } from "../../models";
import { getUsers } from "../../models/user/methods/getUsers";
import { TUser } from "../../../../types/models";

export default async (workspace: Workspace, query: any, currentUser?: User): Promise<TUser[]> => {
	const { filters, sort, page } = query;
	const users = await getUsers(workspace, filters, sort, page);
	return users;
};
