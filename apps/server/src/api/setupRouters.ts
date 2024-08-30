import { Hono } from "hono";
import { authRouter, projectRouter } from "./routers";
import { resolveUser } from "./middlewares/resolveUser";
import { authController } from "@/domains/auth";
import { prettyRequestLog } from "./middlewares/prettyRequestLog";
import { errorHandler } from "./middlewares/errorHandler";
import { resolveWorkspace } from "./middlewares/resolveWorkspace";

export const setupRouters = (app: Hono) => {
	const workspaceApp = new Hono();

	app.use(prettyRequestLog);
	app.route("/auth", authRouter);
	app.use(resolveUser);
	app.get("/me", ctx => authController.me(ctx));

	workspaceApp.use(resolveWorkspace);
	workspaceApp.route("/projects", projectRouter);
	app.route("/:workspaceId", workspaceApp);

	app.onError(errorHandler);

	return app;
};

// const app = express();

// app.use(cors());
// app.use(helmet());
// app.use(morgan("combined"));
// app.use(fileUpload());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ limit: "50mb" }));
// app.use(cookieParser());
// app.use(prettyRequestLog);

// app.get("/", (_req, res) => {
// 	res.send(`timemator-api ${version}`);
// });
