import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import express from "express";
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
import { prettyRequestLog } from "./middlewares/prettyRequestLog.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

export default async (): Promise<void> => {
	const app = express();

	app.use(cors());
	app.use(helmet());
	app.use(morgan("combined"));
	app.use(fileUpload());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json({ limit: "50mb" }));
	app.use(cookieParser());
	app.use(prettyRequestLog);

	app.get("/", (_req, res) => {
		res.send(`timemator-api ${version}`);
	});

	const apiPrefix = process.env.API_VERSION;

	app.use(apiPrefix, authRouter);
	app.use(apiPrefix, resolveUser);
	app.use(apiPrefix, meRouter);
	app.use(apiPrefix, workspaceRouter);

	const workspacePrefix = `${apiPrefix}/:workspaceId`;
	app.use(workspacePrefix, resolveWorkspace);
	app.use(workspacePrefix, projectRouter);
	app.use(workspacePrefix, clientRouter);
	app.use(workspacePrefix, nodeRouter);

	// if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
	//   app.use(Sentry.Handlers.errorHandler());
	// }

	app.use(errorHandler);

	const host = process.env.API_HOST || "localhost";
	const port = process.env.API_PORT || 3000;

	app.listen({ host, port }, () => {
		console.log(`API server listening at http://${host}:${process.env.API_PORT}`);
	});
};
