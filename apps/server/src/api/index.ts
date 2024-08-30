import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serverConfig } from "@/config";
import { setupRouters } from "./setupRouters";

export const server = () => {
	const app = new Hono().basePath(serverConfig.apiVersion);

	const { hostname, port } = serverConfig;

	setupRouters(app);

	console.log(`API server listening at http://${hostname}:${port}`);

	return serve({
		fetch: app.fetch,
		port,
		hostname,
	});
};

// app.use(apiPrefix, resolveUser);
// app.use(apiPrefix, meRouter);
// app.use(apiPrefix, workspaceRouter);

// const workspacePrefix = `${apiPrefix}/:workspaceId`;
// app.use(workspacePrefix, resolveWorkspace);
// app.use(workspacePrefix, projectRouter);
// app.use(workspacePrefix, clientRouter);
// app.use(workspacePrefix, nodeRouter);

// // if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
// //   app.use(Sentry.Handlers.errorHandler());
// // }

// app.use(errorHandler);
