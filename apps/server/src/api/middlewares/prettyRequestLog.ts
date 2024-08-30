import { createMiddleware } from "hono/factory";

export const prettyRequestLog = createMiddleware(async (ctx, next) => {
	console.log(
		"\u001b[" +
			32 +
			"m" +
			"---------------NEW REQUEST----------------" +
			"\u001b[0m",
	);
	console.log(
		"\u001b[" +
			36 +
			"m" +
			`${ctx.req.method} url:: ${ctx.req.url}` +
			"\u001b[0m",
	);
	await next();
});
