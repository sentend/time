import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import express, { NextFunction, Request, Response } from "express";

// import { usersRouter } from "./routers/usersRouter";

import { resolveWorkspace } from "./middlewares/resolveWorkspace.js";
import { version } from "../../package.json";

import {
	authRouter,
	clientRouter,
	meRouter,
	nodeRouter,
	projectRouter,
	workspaceRouter,
} from "./routers/index.js";
import { resolveUser } from "./middlewares/resolveUser.js";

export default async (): Promise<void> => {
	const app = express();

	// Set content type to json for aws sns callback requests to be able to parse body right
	// TODO: extract to own middleware
	app.use((req, _res, next) => {
		if (req.header("x-amz-sns-message-type")) {
			req.headers["content-type"] = "application/json";
		}
		next();
	});

	app.use(cors());
	app.use(helmet());
	app.use(morgan("combined"));
	app.use(fileUpload());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json({ limit: "50mb" }));
	app.use(cookieParser());

	app.use((req: Request, res: Response, next: NextFunction) => {
		console.log(
			"\u001b[" + 32 + "m" + "---------------NEW REQUEST----------------" + "\u001b[0m",
		);
		console.log("\u001b[" + 36 + "m" + `${req.method} url:: ${req.url}` + "\u001b[0m");
		next();
	});

	app.get("/", (_req, res) => {
		res.send(`timemator-api ${version}`);
	});

	const apiPrefix = "/v1";

	app.use(apiPrefix, authRouter);

	app.use(apiPrefix, resolveUser);
	app.use(apiPrefix, meRouter);
	app.use(apiPrefix, workspaceRouter);

	const workspacePrefix = `${apiPrefix}/:workspaceId`;
	app.use(workspacePrefix, resolveWorkspace); // sets req.workspace
	// app.use(workspacePrefix, usersRouter);
	app.use(workspacePrefix, projectRouter);
	app.use(workspacePrefix, clientRouter);
	app.use(workspacePrefix, nodeRouter);

	// if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
	//   app.use(Sentry.Handlers.errorHandler());
	// }

	// Error handler
	app.use(function (
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) {
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
	});

	app.listen({ host: "127.0.0.1", port: process.env.API_PORT || 3000 }, () => {
		console.log(`API server listening at http://127.0.0.1:${process.env.API_PORT}`);
	});
};
