import type { HTTPError } from "@/libs/httpError";
import type { Context } from "hono";

export const errorHandler = (err: HTTPError, ctx: Context) => {
	console.log(
		"\u001b[" + 31 + "m" + "<==========ERROR=========>" + "\u001b[0m",
	);

	const message = err.message || err;
	console.log(`\x1b[41m ${message} \x1b[0m`);

	if (err.res) {
		return err.res;
	}

	const errorResponse = {
		status: 0,
		message,
		code: err.status,
		cause: err.cause,
	};

	return ctx.json(errorResponse, err.status);
};
