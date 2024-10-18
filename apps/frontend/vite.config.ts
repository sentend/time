import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

const port = Number(process.env.VITE_CLIENT_PORT) || 3030;
const host = process.env.VITE_CLIENT_HOST || "localhost";
const serverTraget = process.env.VITE_SERVER_API_URL || "http://localhost:3000";

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [
			react(),
			svgr({
				exportAsDefault: false,
				svgrOptions: {
					icon: true,
				},
			}),
		],
		server: {
			host,
			port,
			strictPort: true,
			proxy: {
				"/api": {
					target: serverTraget,
					changeOrigin: true,
					rewrite: (path) => {
						const fixedPath = path.replace(/^\/api/, "");
						console.log("fixed path", fixedPath);
						return fixedPath;
					},
				},
			},
		},

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"~": __dirname,
			},
		},
	});
};
