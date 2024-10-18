import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

type Data = {
	status: number;
	data: unknown;
	count?: number;
};

type Meta = {
	count?: number;
	headers?: Record<string, string | string[]>;
	status?: StatusCode;
};

export const sendResult = (
	ctx: Context,
	data: unknown,
	{ headers = {}, count, status }: Meta = {},
) => {
	const json: Data = { status: 1, data };

	if (count) {
		json.count = count;
	} else if (Array.isArray(data)) {
		json.count = data.length;
	}

	const sendingStatus = status || 200;
	console.log("headers", headers);
	return ctx.json({ ...json }, sendingStatus, { ...headers });
};
