import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

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
			host: process.env.VITE_HOST || "127.0.0.1",
			port: parseInt(process.env.VITE_PORT || "3000"),
			strictPort: true,
		},

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"~": __dirname,
			},
		},
	});
};
