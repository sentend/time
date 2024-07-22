import express from "express";

export const errorHandler = (
	err: Error,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	console.log("\u001b[" + 31 + "m" + "<=====ERROR=====>" + "\u001b[0m");
	if (res.headersSent) {
		return next(err);
	}

	console.log(err);

	if (err) {
		const anyErr = err as any;
		const code = anyErr.statusCode || 500;
		const errorJson = {
			status: 0,
			message: err.message || err,
			responseCode: code,
			userInfo: anyErr.userInfo,
			errorFields: anyErr.errorFields,
		};
		res.status(code).json(errorJson);
	}
};
