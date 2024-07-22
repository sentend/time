import { User, Workspace } from "../models";

declare global {
	namespace Express {
		export interface Request {
			user?: User;
			workspace?: Workspace;
		}
	}
}
