export default class ApiError extends Error {
	statusCode: number;
	userInfo?: unknown;

	constructor(message: string, statusCode = 500, userInfo?: unknown) {
		super(message);
		this.statusCode = statusCode;
		this.userInfo = userInfo;
	}
}
