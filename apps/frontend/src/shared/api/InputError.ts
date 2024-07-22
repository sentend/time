import ApiError from "./ApiError";

export default class InputError extends ApiError {
	fields: Record<string, string>;

	constructor(fields: Record<string, string>, userInfo?: unknown) {
		super("InputError", 400, userInfo);
		this.fields = fields;
	}
}
