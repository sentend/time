import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";

type ErrorOptions = {
	message?: string;
	cause?: unknown;
	res?: Response;
};

export class HTTPError extends HTTPException {
	constructor(
		readonly statusCode: StatusCode = 500,
		readonly options: ErrorOptions = {},
	) {
		const { cause, message, res } = options;

		super(statusCode, { message, cause, res });
	}
}
